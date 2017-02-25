# RabbitMQ Federation介绍

标签（空格分隔）： RabbitMQ Linux


---
### 介绍
在非集群模式下不同的broker传递消息是federation插件的终极目标。几个原因：

- 松耦合
    Federation插件能够在不同的broker(cluster)之间传递消息。
        可以拥有不同的用户和虚拟主机,
        可以运行不同的RabbitMQ、Erlang版本
- 广域网支持
    Fderation插件使用AMQP 0-9-1协议进行多broker通信，并支持断点重连。
- 自定义配置
    每个broker可拥有联合组件/本地组件， 你不必联合broker内所有组件。
- 灵活扩展
    Federation在不同的brokers之间不要求O(n^2)的连接。因此很容易扩展。

---

### 如何实现的？
- Federation插件允许用户为exchange和queue做联合。每个federated exchange 或者queue能够接收上游(upstreams,位于另一个broker的远程exchange/queue)上的消息。federated exchange能够路由上游发布的消息到本地的队列上。联合队列可以让本地的consumer消费来自上游队列的消息。
- Federation连接上游使用RabbitMQ Erlang Client. 因此可以指定vhost， 使用TLS、 多样的认证机制。
- 获取更多细节，请参阅[federated exchanges][1] 和 [federated queues][2]。

--- 

### 配置Federation
要使用Federation， 首先需要两项配置:
***Federation的配置需在下游(downstreams)的broker/cluster上配置。***

需要联合的其他节点broker(cluster)可以连接到一个或多个上游节点。这可以通过`runtime parameters`配置， 或使用`federation mangement plugin`在`management UI`上增加配置标签。
单条或多条策略可以匹配联合的exchanges/queues，并且能使之建立federation。

#### Getting Started
Federation插件默认包含在RabbitMQ版本包中，通过`rabbitmq-plugins`命令启用：
```bash
rabbitmq-plugins enable rabbitmq_federation
```

如果使用management插件，仍需要打开`rabbitmq_federation_management`，
```bash
rabbitmq-plugins enable rabbitmq_federation_management
```
***当在集群间使用federation时， 集群内的每个节点都应该安装federation插件。***


Federation的信息随着用户、权限、队列等存储在RabbitMQ 数据库中，有三个级别的配置才能参与federatioin。

- upstreams: 定义需要连接的上游。
- upstreams sets: 定义需要连接的上游集合。
- policies: 为Exchange、Queue设置策略，并将这些策略应用到那些配置好的上游。


实际应用中，对于一些简单的应用案列可以忽略upstreams sets的存在，因为存在被称为all的隐式定义的upstream集合，所有upstream都被添加到该upstream集合。
upstream和upstream sets都是[runtime parameters][3]实例。与exchange和queue类似，每个vhost都有自己不同的参数和策略集。获得更多参数、策略的信息，请参考[parameters and policies][4]文档。获得federation参数的更多更全的细节信息，参考[federation reference][5]文档。

参数和策略可通过三种途经设置：

- rabbitmqctl
- management HTTP API
- rabbitmq_federation_management

---

### Federated Exchange(联合交换器)
#### 联合交换器做了什么？
Federated Exchange连接了另外一个exchange(称为上游exchange)。 逻辑上来说，被发布至上游exchange的消息会被**复制**到federated exchange， 这就好像消息直接发给了它们一样。上游的exchange无需重新配置且不要求和federated exhange处于同一个broker(cluster)中。

下图演示了一个broker内的federated exchange连接到另一个broker内由两个上游exchange集合：
![federated exchange](https://www.rabbitmq.com/img/federation00.png)

***建立上游链路和federated exchange所需的所有配置都在具有federated exchange的broker中。(所有的配置都仅需在下游交换器中配置)***


#### 疑问

- **是否所有的消息都被复制了？**
  仅传输那些配置过的需要复制的消息，由federation插件动态优化的。
- **Federated exchagne如何连接到上游exchange？**
  Federated Exchagne将使用AMQP协议连接到所有上游exchange。当声明或配置Federated Exchange时，每个上游Exchange都会列出要用于建立链路的连接属性。
- **是否可以对federated Exchange再进行federated(多级federation)?**
  没有什么能够阻止一个Federated Exchange成为另一个Federated Exchange的上游，甚至配置成一个环路。
  比如： Exchange A 将 Exchange B 声明为其上游，并且 Exchange B 也将 Exchange A 声明为其上游(相互联合)。
  同时也允许更为复杂的连接拓扑结构。
- **是否能够联合任意类型的Exchange？**
  无法联合默认的Exchage（以""命名)，因为这种exchange只是一种直接处理队列的方式。
  同样的，也不可以将标记内internal的exchange进行联合。

#### Federated Exchange 典型用例？
一个典型的用途是具有一个分布在多个broker的相同"逻辑"的交换器。每个broker将声明一个与所有其他federated exchange上游的federated exchange(链路将在n个交换器上形成完整的双向图)。
另一个用途是实现大规模广播 - 在一个broker(不需要联合)中的单个"root"exhange 可以被其它broker中的许多其他federeated exchange声明为上游。 反过来，这些中的每一个可以是用于更多的exchange的上游，等等。 

#### 实现
使用AMQP(可使用SSL来保证安全)实现代理间通信。
绑定组成分组，绑定/解绑命令被发送到上游exchange。因此，Federated Exchange只接受其订阅的消息。且绑定是异步发送到上游的 - 因此添加或删除绑定的效果只能保证最终一致。

消息被缓冲在上游broker创建的队列中。这类队列被称之为上游队列。 而这些队列正是通过分组绑定关系绑定到上游交换器的。因此可以在上游的配置中定制此队列的某些属性。

---

### Federated Queue(联合队列)
除了Federated Exchanges， RabbitMQ 同样支持Federated Queues。此功能提供了一种跨节点、集群的单一队列的负载均衡的方法。

一个Federated Queue与另外一个队列做联盟(称之为上游队列)。它将从上游队列检索消息，以满足本地消费者的消费需求。上游队列无需更改配置，并且也不要求它们在同一个broker或cluster中。

#### 使用联合队列
联合队列和其他队列一样，由应用程序声明。为了是RabbitMQ能够识别哪些队列需要联合，以及应该消费哪些其他节点的消息， 因此需要配置下游(消费)的节点。
配置是由策略声明来完成的。设置策略可以通过模式匹配，匹配后队列将会被联合。 一个联合队列可以属于一条策略。如果多条策略匹配到同一个队列，具有最高优先级的策略将会被应用。当两条策略具有相同优先级时，被匹配的策略将是不确定的。

策略能够通过`RabbitMQ management UI`, `rabbitmqctl`，或 `HTTP API` 手动配置。

一个联合队列可以成为另一个联合队列的上游。甚至可以形成”环路”，举例来说，队列A可以声明队列B为其上游，队列B也可以声明队列A为其上游。当然也可以允许有更多更复杂的组合出现。

#### 联合队列如何工作
联合队列使用AMQP协议连接至其所有的上游(可选择SSL来保证安全)。当声明或配置联合队列时，将列出每个上游队列的连接属性用于建立链路。

联合队列只会在本地消息耗尽时检索消息，前提是联合队列的消费者需要消费消息，并且上游队列有剩余的未被消费的消息。这样做的目的在于消息仅在需要的时候在联合队列间传输，这是由[consumer priorities][6]实现的。

如果一条消息从一个队列转发到另一个队列，节点之间拥有完全相同的转发路径的消息的顺序才会被保留。
某些情况下，毗邻的被发布的消息通过不同路径达到相同的节点，消息会在联合队列下被重新排序。

单独的参数只对单独的队列生效，例如：若在一个联合队列上设置x-max-length参数，于是此参数只会在联合队列上生效但是不会影响到其他队列。特别注意的是， 当为每个队列或者每条消息使用TTL时，当消息被传送到另一个队列时，它的定时器会被重置。

不同于联合交换器，对于在联合队列之间转发消息的次数没有限制。
在一组相互联合的队列里，消息将被转移到具有消费容量空闲的队列中- 所以，当消费的空闲容量不断变化时，消息也会来回移动。

#### 限制
当本地队列中(客户端连接到的节点)没有消息时，`basic.get`方法无法通过联合队列检索消息。由于`basic.get`是一个同步方法，提供请求的节点不得不在联系所有其他节点检索信息的时候阻塞。因此不能保证联合队列的可用性(分区容错)。

运行不同RabbitMQ版本的Brokers可以通过federation连接。然而，因为联合队列要求[consuemr priorities][6]，所以不能和3.2.0以前的RabbitMQ版本的broker建立联合关系。

#### 陷阱
联合队列目前不能仅仅因为某个节点队列需要消息而让消息多跳(遍历多个节点)。比如：节点A和节点B建立了联合队列，节点B和节点C建立了联合队列，但是节点A和节点C没有建立连接；然后当消息在节点A可用时，且节点C有消费者等待接收消息，消息不会通过B节点从A节点传输到节点C(节点B有消费者除外)。

有可以将联合队列绑定到联合交换器的可能。然而，这可能导致意想不到的后果。因为联合交换器会从其上游检索匹配其绑定的消息，任何发布到联合交换器的消息将被复制到匹配绑定的任何节点。 联合队列然后将在节点之间移动这些消息，并且因此可能在同一个节点上结束相同消息的多个副本。


  [1]: https://www.rabbitmq.com/federated-exchanges.html
  [2]: https://www.rabbitmq.com/federated-queues.html
  [3]: https://www.rabbitmq.com/parameters.html
  [4]: https://www.rabbitmq.com/parameters.html
  [5]: https://www.rabbitmq.com/federation-reference.html
  [6]: https://www.rabbitmq.com/consumer-priority.html
