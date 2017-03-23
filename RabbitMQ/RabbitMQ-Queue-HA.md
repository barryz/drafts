# RabbitMQ 镜像队列(Mirrored Queue)原理剖析

---
### 队列主节点， 主节点迁移， 本地数据
---

#### 队列主节点

RabbitMQ中每个队列都有一个主节点（**home node**), 这个主节点称之为 `queue master`。所有针对队列的操作首先通过`master`然后再复制到其他`mirrors`上。这对保证消息的有序性（FIFO）非常有必要。

队列的`masters`属性可以通过策略配置分布到不同的节点上。策略的配置可以通过三种方式：

  - 代码中队列声明时增加 `x-queue-master-locator` 参数
  - 使用 `queue_master_locator` 作为key配置policy
  - 配置文件中增加 `queue-master-locator`， 推荐

有三种策略可以配置：

  - 选取masters数量最小的节点: `min-masters`
  - 选取声明队列的客户端所连接的节点: `client-local`
  - 选取随机节点: `random`

---

#### 节点策略和主节点迁移

需要注意的是， 设置 `ha-mode=nodes` 这种策略会导致已经存在的主节点消失，假如这个主节点不在设置的策略里面。

为了保证消息不丢失， **RabbitMQ将保持现有的主节点，直到至少另外一个镜像节点已经同步（即使会花费很长时间）。
然而，一旦发生同步，情况就会像节点发生故障一样：消费者将与主机断开连接，然后需要重新建立连接。**

#### 独占队列（Exclusive Queue)
独占队列会在声明他们的连接关闭是被删除， 基于此， 为一个独占队列设置镜像（或者持久化）是没有必要的，因为当这个独占队列所在的节点死亡之后， 声明这个独占队列的连接也会随之关闭， 独占队列也会被删除。

---

### 镜像队列的实现和语义

每个镜像队列都会有一个master和一些mirrors分布在不同节点上，
**mirrors会以与master完全相同的顺序应用发生在master上的操作，从而保持一致的状态。 除了发布之外的所有动作都只能先发给master， 然后master将动作的效果广播给其他mirrors。因此， 从mirrors队列消费的客户端事实上是从master队列上消费的**

:grey_question: 那么publish这个动作在镜像模式下是如何工作的?

**如果镜像失败， 事实上影响很小， master还是master， 并且客户端不会触发任何异常动作或者被通告发生了错误。**

需要注意的是， 镜像失败可能不会被立刻检测到（受`net_ticktime`影响），:grey_question:并且每个连接流控机制的中断可能会延迟消息发布。

***如果master失效， 然后mirrors中一员会晋升为master， 此刻， 会发生如下事件***

 - mirror机制会选择一个最老的mirror节点（通常以`uptime`计算)晋升为master，
 此时它拥有与master同步的最佳时机。**然后需要注意的是，如果没有mirror和master同步的话， master拥有的消息将会丢失。**

 - mirror队列会认为所有之前连接的consumer都异常断开连接。 基于此， 它会将已投递给消费者但正在等待ack的所有消息重新入队（`requeued`)。这会包括客户端已经发出ack的消息： ack在到达master之前在链路上丢失， 或从master到mirror广播期间丢失。在任何一种情况下， 新的master都别无选择， 只能重新入队所有未被ack的消息。

 - 客户端的所有请求都会被取消。

 - 未被ack的消息重新入队可能会导致消费者重新消费之前已经消费过的消息。

随着所选的mirror晋升为master， 在此期间所有发布到镜像队列的消息都不会丢失： 发布到镜像队列的消息始终会直接发布到master和其他所有mirror。因此如果master失效， 消息将继续发送到mirrors， 并且一旦在mirror晋升到master完成后添加到队列中。

类似的， 客户端使用发送确认(publisher confirms)模式发布的消息仍将会被正确的ack， 当master(或任何mirrors)失效， 即使是在消息正在发布时和消息能够被确认给发送者时。因此， 从发布者角度来说， 发布消息到镜像队列和发布到其他普通队列没有任何区别。

若消费者使用noack模式消费镜像队列的消息，在master失效情况下， 消息可能会丢失。


#### 发送者确认和事务
镜像队列支持发送者确认和事务机制。 所选择的语境是在确认和事务的的案例下，该操作应用到队列的所有镜像上。 所以在这种情况下， `tx.commit-ok` 只会在队列的所有mirror上都成功应用之后才会被返回给客户端。

同样的， 在发送者确认模式下， 只有在队列的所有镜像都接收操作后才会向发布者发送ack。

#### 流控机制
RabbitMQ使用基于`credit`的算法来限制发布消息的速率。发送者在接收到镜像队列的`credit`后才会被允许发布消息。`Credit`在这种情况下是指发布消息的权限。无法发出`credit`的镜像队列可能会导致发送者停滞。发送者将保持阻塞状态，直到所有的镜像发出`credit`， 或者直到剩余的节点认为该镜像节点与集群断开连接。

Erlang通过周期性的发送`tick`至所有节点来检测这种失联的情况，`tick`时间间隔可以在 [*net_ticktime*](https://www.rabbitmq.com/nettick.html) 的配置中被控制。

#### master失效和消费者取消 Master Failures and Consumer Cancellation

> Clients that are consuming from a mirrored queue may wish to know that the queue from which they have been consuming has failed over. When a mirrored queue fails over, knowledge of which messages have been sent to which consumer is lost, and therefore all unacknowledged messages are redelivered with the redelivered flag set. Consumers may wish to know this is going to happen.


从镜像队列消费消息的客户端可能希望知道它们消费的队列已经失效了。当一个镜像队列失效之后，当镜像队列发生故障转移时，发送到某个消费者丢失的消息和因此所有未确认的消息会被设置重传标志之后发生重传，消费者可能需要知道发生了什么。

:joy: 翻译不太准确~

如果是这样， 消费者可以使用参数 `x-cancel-on-ha-failover` 为 `true` 。 然后消费者会在故障切换和一个[*consumer cancellation notification*](https://www.rabbitmq.com/consumer-cancel.html)发送后被取消。那么消费者需要重新使用`basic.consume`重新消费消息。

范例：

```java
Channel channel = ...;
Consumer consumer = ...;
Map<String, Object> args = new HashMap<String, Object>();
args.put("x-cancel-on-ha-failover", true);
channel.basicConsume("my-queue", false, args, consumer);
```

这样使用该参数创建一个新的消费者。

---

### 不同步的镜像 Unsynchronised Mirrors
(同步策略非automatical)

>A node may join a cluster at any time. Depending on the configuration of a queue, when a node joins a cluster, queues may add a mirror on the new node. At this point, the new mirror will be empty: it will not contain any existing contents of the queue. Such a mirror will receive new messages published to the queue, and thus over time will accurately represent the tail of the mirrored queue. As messages are drained from the mirrored queue, the size of the head of the queue for which the new mirror is missing messages, will shrink until eventually the mirror's contents precisely match the master's contents. At this point, the mirror can be considered fully synchronised, but it is important to note that this has occurred because of actions of clients in terms of draining the pre-existing head of the queue.

一个节点可能会随时加入到某个集群中。 依赖于队列的HA配置， 当某个节点加入集群中时，队列可能会在新的节点上增加mirror。此时， 这个新的mirror队列内容为空：它没有包含任何队列已存在的内容。 这样的mirror将会接收刚刚发送到队列的新消息，因此随着时间的推移，mirror将能精确的表示被镜像队列尾部。当旧消息(新mirror未同步的消息)从镜像队列中移除出时，镜像队列的头部(保存旧消息)的大小将会缩小，直到新镜像节点的内容与master节点内容精确匹配。此时，可以认为镜像是完全同步的， 但是要注意的是，这是由于客户端在排队队列的预先存在的头部方面的动作而发生的。

:joy: 翻译的太挫~

因此，新添加的mirror不会在添加镜像之前提供队列内容的额外形式的冗余或可用性，除非该队列已被显式同步。 由于在发生显式同步时队列变得无响应，所以最好允许排队消息的活动队列自然同步，并且只显式地同步不活动队列。

PS： 显示全同步会阻塞生产者和消费者， 所以官方建议自然同步。

可以使用以下命令确定哪些镜像队列同步情况：

```bash
rabbitmqctl list_queues name slave_pids synchronised_slave_pids
```

手动同步一个队列：

```bash
rabbitmqctl sync_queue name
```

取消队列同步：
```bash
rabbitmqctl cancel_sync_queue name
```

#### 停止节点和同步 Stopping nodes and synchronisation

假设你停止了RabbitMQ中的一个含有镜像队列master角色的节点，其他节点上的mirror会晋升为master(假设是已经同步过的mirror)。假如你接着停止其他节点直到该镜像队列没有mirror时： 它将只存在于一个节点上，即为master。如果镜像队列被声明为持久化(`durable`)的，如果它剩余的最后一个节点也宕机了， 持久化的消息将会存留当节点重启后。通常来说， 当你重启其他节点时，如果它们之前是镜像队列的一部分，那么它们将会重新加入镜像队列。

然而，目前没有办法让mirror在其重新加入到镜像队列时知道它的队列内容和master的差异情况(比如出现了网络分区)， **因此，当mirror重新加入镜像队列时，会抛弃它已经拥有的任何持久的本地内容，并清空队列。 在这一点上，它的行为与加入到集群新节点一样。**

*总结: 当镜像队列的节点宕机恢复后，会清空队列内容，执行full sync， 在配置了同步策略为 `automatic` 的情况下* :clap:

#### 在未同步的mirrors情况下停止master节点
一种可能的情况是master节点宕机但可用的其他mirror节点未完成同步(消息不全)。可能发生该异常是集群回滚或升级。**默认情况下， RabbitMQ在可控的master宕机情况下(如手动停止RabbitMQ服务或者关机)会拒绝故障转移至一个未同步的mirror上以避免消息丢失; 取而代之的是将整个队列关闭，就好像未同步的mirror不存在一样。在不可控的master宕机情况下(服务器、节点崩溃， 网络中断)， RabbitMQ仍然会故障转移至一个未同步的mirror上。**

如果希望在任何情况下都将master故障转移至未同步的mirror上(即选择队列的可用性以避免消息丢失)，那么你可以设置`ha-promotioin-on-shutdown` 为 `always`， 而不是使用当同步发生时的默认值。

*总结: 队列可用性 > 消息完整性的情况下使用此方式*

#### 所有mirrors停止时丢失master

master有可能在所有mirrors都停止时产生丢失的情况。正常操作中，将要关闭的队列的最后一个节点将成为master，并且当该节点再次启动时，该节点仍然是master节点。（因为它可能已经接收到其他mirror未看见的消息)。

然而， 当你调用 `rabbitmqctl forget_cluster_node` 指令时， RabbitMQ将会尝试为已经剔除集群的节点上的每个队列寻找一个目前停止的mirror，并且在再次启动时将该mirror晋升为新的master，如果有多个候选， RabbitMQ将会选择最近停止的mirror。

需要了解的是RabbitMQ只能在`forget_cluster_node`期间晋升已停止的mirror， 因为任何再次启动的mirror都将清楚其队列内容，因此， 在已经停止的集群中剔除丢失的master时，必须先调用 `rabbimqcll forget_cluster_node`命令， 才能再次启动mirror。

#### 批量同步

RabbitMQ 3.6.0为镜像队列引入了一个新参数：`ha-sync-batch-size`。 通过批量同步消息，同步过程可以大大加快。

要为`ha-sync-batch-size`选择合适的值，您需要考虑：

- 队列平均消息大小。 该值将是您根据你的特定网络带宽考虑的批量大小。

- 设置太高的值可能会导致集群中的节点丢失来自其他节点的`tick`消息。

例如，如果将`ha-sync-batch-size`设置为每批次50000条消息，并且队列中的每个消息大小为1kb，则节点之间的每个同步消息将为50MB。 需要确保队列镜像之间的网络带宽可以适应这种流量。 如上所述，如果发送一批消息网络上花费的时间超过[*net_ticktime*](https://www.rabbitmq.com/nettick.html)，则集群中的节点可能认为它们存在了网络分区。

#### 配置显式同步

可以通过两种方式触发显式同步：手动或自动。

如果队列设置为自动同步，则每当新mirror加入时，它将执行自动同步 - 阻塞所有其他操作，直到同步完成。

可以通过将`ha-sync-mode`策略键设置为`automatic`实现自动同步。 `ha-sync-mode`也可以设置为`manual`。 如果未设置，则假定手动同步。


默认情况下队列将一次同步一条消息，但是RabbitMQ 3.6.0之后，我们可以让master批量同步消息。 为此，请将`ha-sync-batch-size`的策略设置为适合您特定工作负载的整数值。 如果未指定`ha-sync-batch-size`，则假定值为1。
