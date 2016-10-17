### RabbitMQ性能测试工具**`PerfTest`**
RabbitMQ 官方提供的MQ的性能测试工具。 包含在`rabbitmq-client-tests.jar`中。`PerfTest`源代码在`RabbitMQ Java client library`的`test/src`下。

------------------------------
#### **下载编译安装`RabbitMQ Java client library`**
- [rabbitmq-java-client-3.6.3.tar.gz](http://www.rabbitmq.com/releases/rabbitmq-java-client/v3.6.3/rabbitmq-java-client-3.6.3.tar.gz)
- 依赖组件
 1. java编译器(>1.5)
 2. Ant(Java编译的一个工具)
 ````bash
 $yum -y install ant.noarch
 ````
- 编译打包
````bash
$tar xf rabbitmq-java-client-3.6.3.tar.gz
$cd rabbitmq-java-client-3.6.3
$ant
$ant build
$ant clean
$ant jar
$ant dist
````
**[参考文档](http://www.rabbitmq.com/build-java-client.html)**

-------------------------
#### 使用方法
- PerfTest
````bash
$./runjava.sh com.rabbitmq.examples.PerfTest --help
usage: <program>
 -?,--help                  show usage
 -A,--multiAckEvery <arg>   multi ack every
 -a,--autoack               auto ack
 -b,--heartbeat <arg>       heartbeat interval
 -C,--pmessages <arg>       producer message count
 -c,--confirm <arg>         max unconfirmed publishes
 -D,--cmessages <arg>       consumer message count
 -e,--exchange <arg>        exchange name
 -f,--flag <arg>            message flag
 -h,--uri <arg>             connection URI
 -i,--interval <arg>        sampling interval in seconds
 -K,--randomRoutingKey      use random routing key per message
 -k,--routingKey <arg>      routing key
 -M,--framemax <arg>        frame max
 -m,--ptxsize <arg>         producer tx size
 -n,--ctxsize <arg>         consumer tx size
 -p,--predeclared           allow use of predeclared objects
 -Q,--globalQos <arg>       channel prefetch count
 -q,--qos <arg>             consumer prefetch count
 -R,--consumerRate <arg>    consumer rate limit
 -r,--rate <arg>            producer rate limit
 -s,--size <arg>            message size in bytes
 -t,--type <arg>            exchange type
 -u,--queue <arg>           queue name
 -x,--producers <arg>       producer count
 -y,--consumers <arg>       consumer count
 -z,--time <arg>            run duration in seconds (unlimited by default)
 
 $./runjava.sh com.rabbitmq.examples.PerfTest -h "amqp://test:test@test.example.com:5672/perftest" -e perftest_fanout -t fanout -u perftest_q1 -x15 -y10 -z10 -p

````
- PertTestMulti(生成的json文件可用于绘制性能曲线图)
[rabbitmq-perf-html](https://github.com/rabbitmq/rabbitmq-perf-html)
````bash
$./runjava.sh com.rabbitmq.examples.PerfTestMulti
Usage: PerfTestMulti input-json-file output-json-file
$./runjava.sh com.rabbitmq.examples.PerfTestMulti publish-consume-spec.js qps-noha-single-queue.js
````
