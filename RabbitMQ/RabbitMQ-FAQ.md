###RabbitMQ运维过程中遇到的一些问题，以及解决方法

**确认集群内所有的从节点(Mirror Mode)都拥有相同的`queue` or `messages` 内容**
````bash
$sudo rabbitmqctl list_queues -p $vhost synchronised_slave_pids
````
**若第二个<>内的PID列表不一致，则表示节点内容不同， 需要等待<PID>完全一致后才能摘除从节点，以保证消息不丢失**

--------------------------------

