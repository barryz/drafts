**`RabbitMQ Dashboard`或者`REST API`获取不到相关的统计信息**
````bash
$sudo rabbitmqctl eval 'application:stop(rabbitmq_management), application:start(rabbitmq_management).'
or
$sudo rabbitmqctl eval 'exit(erlang:whereis(rabbit_mgmt_db), please_terminate).'
or 
$sudo rabbitmqctl eval 'exit(erlang:whereis(rabbit_mgmt_db), please_crash).'
````
**意为重启状态统计数据库。**
- 参考链接：[@stackoverflow](http://stackoverflow.com/questions/7711528/rabbitmq-statistics-database-could-not-be-contacted-message-rates-and-queue-l)

--------------------------------

**修改`Statistics interval`: 状态统计时间间隔**
> By default the server will emit statistics events every 5000ms. The message rate values shown in the management plugin are calculated over this period. You may therefore want to increase this value in order to sample rates over a longer period, or to reduce the statistics load on a server with a very large number of queues or channels.
In order to do so, set the value of the collect_statistics_interval variable for the rabbit application to the desired interval in milliseconds and restart RabbitMQ.

编辑rabbitmq配置文件:

````python
[ 
    {rabbit,    [ {tcp_listeners,  [5672]},
                  {collect_statistics_interval, 10000}] },
]
                                                                            
````

**修改`Event backlog`: 统计事件堆积数**
> Under heavy load, the processing of statistics events can increase the memory consumption. To reduce this, the maximum backlog size of the channel and queue statistics collectors can be regulated. The value of the stats_event_max_backlog variable in the rabbitmq_management application sets the maximum size of both backlogs. Defaults to 250.


编辑rabbitmq配置文件:

````python
[ 
    {rabbitmq_management,    [ {http_log_dir,  "/tmp/http_log.log"},
                               {stats_event_max_backlog, 2000}] },
]

````


**PS**: 以上两项配置也可在运行时更改(runtime):
````bash
$sudo rabbitmqctl eval 'application:set_env(rabbit, collect_statistics_interval, 60000).'
$sudo rabbitmqctl eval 'application:set_env(rabbitmq_management, stats_event_max_backlog, 2000).'
````

- 参考链接: [Management Plugin](https://www.rabbitmq.com/management.html)

------------------------------------------

** Move management statistics database to other node **

You can terminate it with:
````bash
$sudo rabbitmqctl eval 'exit(erlang:whereis(rabbit_mgmt_db), please_crash).'
````
and it will be restarted, possible on another node. All data that management DB has is ephemeral in nature.

