# RabbitMQ 转移消息一般通过 `shovel plugin` 来做


## Shovel Plugin

>Sometimes it is necessary to reliably and continually move messages from a queue (a source) in one broker to an exchange in another broker (a destination). The Shovel plugin allows you to configure a number of shovels, which do just that and start automatically when the broker starts.

很多时候需要将消息从一个broker中的queue中持续可靠的转移到另一个broker的exchange当中。 `Shovel` 插件允许你这么做。

>The source queue and destination exchanges can be on the same broker (typically in different vhosts) or distinct brokers.

源队列和目标交换可以在同一broker（通常在不同的vhost中）或不同的broker中。

> A shovel behaves like a well-written client application, which connects to its source and destination, reads and writes messages, and copes with connection failures. In fact, Shovels use RabbitMQ Erlang client under the hood.

Shovel像一个编写良好的客户端应用程序，它连接到其源和目标，读取和写入消息，并处理连接故障。 事实上，Shovel使用RabbitMQ Erlang客户端。

特点：

- Shovel 可以在不同用户、不同vhost、不同RabbitMQ版本、 不同Erlang 版本之间转移消息
- 可以跨广域网转移消息
- 高度定制，当Shovel连接（到源或目的地）时，它可以被配置为执行任何数量的显式方法。 例如，源队列最初不需要存在，并且可以在connect上声明。

## 如何实现
Shovel插件定义（并运行）每个Shovel的Erlang客户端应用程序。
- **连接** 源broker和目的broker

  在连接到源或目标broker以后，Shovel可以发出一系列已配置的AMQP声明。 队列，交换和绑定就能够被声明。

  如果出现故障,而且为源和目标指定了多个broker，则可以选择（随机）重新连接到另一个代理，Shovel将尝试重新连接到broker。 可以指定重新连接延迟，以避免使用重新连接尝试来网络风暴，或者完全防止重新连接失败。

  发生重连时，所有配置的声明（源或者目标）会被重新发起

- **消费** 从队列中消费消息

  Shovel的消费者可以在接收时，在（重新）发布之后或在确认其发布之后自动地确认消息。

- **重新发布** 重新发布每条信息到目的broker

  可以使用显式参数值修改发布方法和消息属性。


## Let's Do It (开干吧 :muscle:)

安装插件先:pray:：

```bash
$rabbitmq-plugins enable rabbitmq_shovel
$rabbitmq-plugins enable rabbitmq_shovel_management
```
Shovel 可以完全独立运行， 不强制要求在相同的broker（包括source&destination)

Shovel 分为 静态和动态， 区别如下：

| 静态 Shovel | 动态 Shovel|
|-----|-----|
|在broker的配置文件中定义|在broker运行时参数指定 |
|需要重启|任何时候都能定义和销毁 |
|更加通用：任何队列，交换或绑定可以在启动时手动声明。|更有说服力：Shovel使用的队列，交换和绑定将被自动声明。 |


## 集群间配置Shovel

通常期望确保Shovel对源或目标集群中的任何节点或承载Shovel的集群的故障具有弹性。

你可以通过为每个Shovel指定多个源和/或目标URI，确保Shovel可以故障切换到源集群或目标集群中的不同节点。

动态Shovel自动定义在启用Shovel插件的托管集群的所有节点上。 每个Shovel将只在一个节点上（任意地）开始，但如果那个节点降级，则会将故障转移到另一个节点。

应在配置文件中为启用了Shovel插件的托管集群的所有节点定义静态Shovel。 再次，每个Shovel将仅在一个节点上启动，并在需要时故障转移。

## 监控 Shovels

健康途经有二：

- 使用 `management_ui` 或 `http api`
- 直接查询: `rabbitmqctl eval 'rabbitmq_shovel_status:status().' `



:six::six::six: 以上翻译自官网， 发现还是不会配... :joy:

---


## 测试
环境:

broker_source: xx-test-rmq-1, 3   cluster

broker_destinatin: xx-test-rmq-2  single_instance

注： 配置Shovel插件的RabbitMQ实例不一定要存在于source或destination的broker上， 可以单独部署 :+1:

将 qc-test-rmq-1、3 中 的 `test-shovel-queue` 中的转移至 qc-test-rmq-2 中的
`test-shovel-queue`

### 配置动态Shovels

- 使用 `rabbitmqctl` 配置 parameters

```bash
rabbitmqctl set_parameters shovel my-test-shovel '{"src-uri": "amqp://user:pass@qc-test-rmq-1:5672/test"}, "src-queue": "test-shovel-queue", "dest-uri": "amqp://user:pass@qc-test-rmq-2:5672/test", "dest-queue": "test-shovel-queue"'

rabbitmqctl set_parameters shovel my-test-shovel '{"src-uri": "amqp://user:pass@qc-test-rmq-1:5672/test"}, "src-queue": "test-shovel-queue", "dest-uri": "amqp://user:pass@qc-test-rmq-2:5672/test", "dest-exchange": "test-shovel-exch", "dest-exchange-key": "action.#"'
```

  第一条是从源队列移动消息至目标队列
  第二条是从源队列移动消息至目标交换器（目标broker根据指定的routing_key,将消息路由到对应的队列)

- 使用 `management_ui` 配置 (略)

### 概念解释

#### Source

- `src-uri`

  源broker的amqp连接串; 连接串格式[参考：:point_left:](https://www.rabbitmq.com/uri-spec.html)

- `src-queue`

  需要消费的源队列。 必须设置这个或 `src-exchagne`（但不能同时设置两者）。
  如果源代理上不存在此源队列，则它将被声明为不带参数的持久化队列。

- `src-exchange`

  需要消费的源交换器。 必须设置此或 `src-queue`（但不能同时设置两者）。
  在从队列中消耗之前，Shovel将声明一个独占队列(exclusive queue)并将其绑定到与 `src-exchange-key` 命名的交换。
  如果源broker上不存在源交换器，它将不被声明; Shovel将无法启动。

- `src-exchange-key`

  使用 `src-exchange` 指定的路由键

#### Destination

- `dest-uri`

  目标broker的amqp连接串; 连接串格式[参考：:point_left:](https://www.rabbitmq.com/uri-spec.html)

- `dest-queue`

  应该发布消息的队列。 可以设置此队列或 `dest-exchange-key`（但不是两者）。 如果两者都未设置，则消息将使用其原始交换器(默认exchange)和路由键重新发布。
  如果目标队列在源broker上不存在，它将被声明为不带参数的持久队列。

- `dest-exchange`

  应该发布消息的交换器。 可以设置此交换器或 `dest-queue`（但不是两者）。
  如果源broker上不存在目标交换器，它将不被声明; Shovel将无法启动。

- `dest-exchange-key`

  使用 `dest-exchange` 时指定的路由键。 如果未设置，则将使用默认交换器的路由键。


#### Shovel

- `prefetch-count`

    在任意时间通过Shovel复制的未确认消息的最大数量。 默认值为1000。

- `reconnect-delay`

  在任何一端断开后，重新连接到broker之前需要等待的持续时间（以秒为单位）。 默认值为1。

- `publish-properties`

  Shovel取消息时要覆盖的属性。 目前不支持以此方式设置headers。 默认值为{}。

- `add-forward-headers`

  是否向Shovel消息中添加X headers，指示它们已经从哪里转移出来。 默认值为false。

- `ack-mode`

  确定Shovel应该如何确认消息。

  如果设置为 `on-confirm`（默认值），则消息在目标方确认后将确认回复给源broker。 这可以处理网络错误和broker 失效，

  如果设置为 `on-publish`，则源broker上确认已在目标broker发布消息之后，就确认消息。 这可以处理网络错误，而不会丢失消息，但在broker失效的情况下可能会丢失消息。

  如果设置为 `no-ack`，则不使用消息确认。 这是最快的选项，但在网络或broker失效的情况下可能丢失消息。

- `delete-after`

  确定Shovel何时（如果有）应该自我删除。 如果Shovel被视为更多的移动消息操作，即用于在特定的基础上将消息从一个队列移动到另一个队列，这可能是有用的。

  默认值为 `never` ，表示Shovel不应该删除自己。

  如果设置为 `queue-length`，那么Shovel将在启动时测量源队列的长度，并在它传递了N多消息后删除自己。

  如果设置为 `整数`，则Shovel将在删除自身之前传输该指定数量的消息。


  ---

  TODO:
  这么麻烦 :joy:  不如自己写个算了。。
