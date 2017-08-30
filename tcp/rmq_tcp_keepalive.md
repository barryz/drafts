## 背景
阿里云的环境经常丢包， 比如tcp fin包， 这种包丢了之后， 就会导致 被动断开连接的一方 无法释放已经建立的连接（Established 连接没有超时的说法）。

## 现象
造成的现象就是 RabbitMQ server 端 tcp est状态的连接持续增长， 但client端并没有该连接。  最终导致server端的socket fd耗尽， 新的连接无法建立。

## 解决方法
- client 端开启 `heartbeat`
   具体参见amqp heartbeat 各个客户端实现
- server 端开启 `tcp keepalive`
   需在配置文件中指定： **keepalive, true**

```js
[
 {rabbit,
  [
    {log_levels, [{connection, info}, {channel, info}]},
    {tcp_listen_options, [{keepalive, true}]},
    {heartbeat, 30},
    {cluster_partition_handling, autoheal},
    {collect_statistics_interval, 10000},
    {vm_memory_high_watermark, 0.8},
    {vm_memory_high_watermark_paging_ratio, 0.8},
    {loopback_users, []}
  ]},
 {rabbitmq_management, [{http_log_dir, "/data/log/rabbitmq/http_access.log"},
     {stats_event_max_backlog, 500}
  ]}
].
```
