### RabbitMQ 分区后出现 mnesia 队列数据不一致时， 使用如下命令彻底清除队列:
(表现为ui显示存在队列， 但无法显示队列的详细信息，客户端访问报 `not found`错误)

```bash
$rabbitmqctl eval 'Q = {resource, <<"VHOST NAME">>, queue, <<"QUEUE NAME">>}, rabbit_amqqueue:internal_delete(Q).'
```

---

### `RabbitMQ Dashboard` 或者 `REST API` 获取不到相关的统计信息
(表现为`rabbitmq_management_plugin overload`)

```bash
$sudo rabbitmqctl eval 'application:stop(rabbitmq_management), application:start(rabbitmq_management).'
or
$sudo rabbitmqctl eval 'exit(erlang:whereis(rabbit_mgmt_db), please_terminate).'
or
$sudo rabbitmqctl eval 'exit(erlang:whereis(rabbit_mgmt_db), please_crash).'
```
