# Consul使用说明

标签（空格分隔）： golang consul etcd

---

### Feature
- 服务发现
- 健康监测
- k/v存储
- 多数据中心
- DNS/REST API 查询

---

### 基础架构
> Every node that provides services to Consul runs a Consul agent. Running an agent is not required for discovering other services or getting/setting key/value data. The agent is responsible for health checking the services on the node as well as the node itself.

向Consul提供服务的每个节点都运行Consul Agent。 运行不需要发现其他服务或获取/设置key/value。 Agent 负责节点上的服务以及节点本身的健康检查。 

> The agents talk to one or more Consul servers. The Consul servers are where data is stored and replicated. The servers themselves elect a leader. While Consul can function with one server, 3 to 5 is recommended to avoid failure scenarios leading to data loss. A cluster of Consul servers is recommended for each datacenter.

Agent和一个（多个）Consul Server通信。 Consul Server 用于存储和复制数据。 Servers 自己选举`leader`。虽然说Consul可以放在一台服务器上运行， 但是建议使用3-5台服务器， 避免数据丢失。 推荐为每个数据中心建立一个集群。

> Components of your infrastructure that need to discover other services or nodes can query any of the Consul servers or any of the Consul agents. The agents forward queries to the servers automatically.

基础设施的组件需要发现其他服务或节点可以查询任何`leader`服务器或任何`leader` agent。 agent自动将查询转发给服务器。

> Each datacenter runs a cluster of Consul servers. When a cross-datacenter service discovery or configuration request is made, the local Consul servers forward the request to the remote datacenter and return the result.

每个数据中心运行一个Consul Servers的集群。 当一个跨数据中心的`服务发现` 或配置请求生成，本地的Consul Servers 将转发请求至远程数据中心，并返回结果。

---

### 安装
下载官方编译好的二进制包， 解压即可运行。 下载地址：[点击这里][download]
建议将二进制文件放入系统PATH路径下。

---

### Agent 运行
***`dev`模式运行agent***
```bash
$consul agent -dev
==> Starting Consul agent...
==> Starting Consul agent RPC...
==> Consul agent running!
           Version: 'v0.7.0'
         Node name: 'vm-test-barryz'
        Datacenter: 'dc1'
            Server: true (bootstrap: false)
       Client Addr: 127.0.0.1 (HTTP: 8500, HTTPS: -1, DNS: 8600, RPC: 8400)
      Cluster Addr: 127.0.0.1 (LAN: 8301, WAN: 8302)
    Gossip encrypt: false, RPC-TLS: false, TLS-Incoming: false
             Atlas: <disabled>

==> Log data will now stream in as it occurs:

    2016/09/15 10:21:10 [INFO] raft: Initial configuration (index=1): [{Suffrage:Voter ID:127.0.0.1:8300 Address:127.0.0.1:8300}]
```

***查看集群成员***
命令行:
```bash
$ consul members
Node                Address            Status  Type    Build     Protocol  DC
vm-test-barryz  172.16.18.130:8301  alive   server  0.7.1  2         dc1
```

[HTTP API][httpapi]
```bash
$ curl localhost:8500/v1/catalog/nodes
[{"Node":"vm-test-barryz","Address":"127.0.0.1","TaggedAddresses":{"lan":"127.0.0.1","wan":"127.0.0.1"},"CreateIndex":4,"ModifyIndex":110}]
```

---
### 服务注册
> A service can be registered either by providing a service definition or by making the appropriate calls to the HTTP API.

服务可以通过服务定义或HTTP API注册。

#### 服务定义
    编写服务定义文件， 例如在`/srv/consul/consul`下新建`conf.d`目录， 并新增文件`web.json`:
```json
{ 
"service": {
    "name": "web",
    "tags": ["nginx"],
    "port": 80
}
}
```
编辑完成之后重启agent， 指定以下参数：
```bash
$consul agent -dev -config-dir=/srv/consul/consul.d
```

#### 查询服务
- DNS API
    服务名的DNS 名称为`NAME.service.consul`
```bash
$ dig @127.0.0.1 -p 8600 web.service.consul
...

;; QUESTION SECTION:
;web.service.consul.        IN  A

;; ANSWER SECTION:
web.service.consul. 0   IN  A   172.16.18.130
```
通过查询`SRV`记录查询服务的IP和端口对应关系：
```bash
$ dig @127.0.0.1 -p 8600 web.service.consul SRV
...

;; QUESTION SECTION:
;web.service.consul.        IN  SRV

;; ANSWER SECTION:
web.service.consul. 0   IN  SRV 1 1 80 vm.test.barryz.node.dc1.consul.

;; ADDITIONAL SECTION:
Armons-MacBook-Air.node.dc1.consul. 0 IN A  172.16.18.130
```
可以通过`tags`来过滤查询的服务：
```bash
$ dig @127.0.0.1 -p 8600 nginx.web.service.consul
...

;; QUESTION SECTION:
;rails.web.service.consul.      IN  A

;; ANSWER SECTION:
nginx.web.service.consul.   0   IN  A   172.16.18.130
```
- HTTP API
```bash
$ curl http://localhost:8500/v1/catalog/service/web
[{"Node":"vm-test-barryz","Address":"172.20.20.11","ServiceID":"web", \
    "ServiceName":"web","ServiceTags":["nginx"],"ServicePort":80}]
```
可以通过查询字符串`passing`或`faling`查询特定状态的服务：
```bash
$ curl 'http://localhost:8500/v1/health/service/web?passing'
[{"Node":"vm-test-barryz","Address":"172.20.20.11","Service":{ \
    "ID":"web", "Service":"web", "Tags":["rails"],"Port":80}, "Checks": ...}]
```

---

### 集群创建
#### 节点定义
> Each node in a cluster must have a unique name. By default, Consul uses the hostname of the machine, but we'll manually override it using the -node command-line option.

集群中的每个节点必须拥有唯一名称， 默认的， Consul使用主机名作为节点名， 但可以使用`-node`手动指定节点名。

> We will also specify a bind address: this is the address that Consul listens on, and it must be accessible by all other nodes in the cluster. While a bind address is not strictly necessary, it's always best to provide one. Consul will by default attempt to listen on all IPv4 interfaces on a system, but will fail to start with an error if multiple private IPs are found. Since production servers often have multiple interfaces, specifying a bind address assures that you will never bind Consul to the wrong interface.

需要指定一个`-bind`地址用于Consul监听， 这个地址必须能和其他节点通信。 严格意义上来说， 这个配置不是必须的， 但是最好指定一个。 Consul默认地会尝试监听系统上所有的IPv4接口，如果检测到多个私有IP， Consul则会无法启动并报错。 生产环境中一般有多个接口，因此指定绑定的地址可以确保Consul不会绑定到错误的接口上。

`-server` 指定集群中的Server Agent。

> The -bootstrap-expect flag hints to the Consul server the number of additional server nodes we are expecting to join. The purpose of this flag is to delay the bootstrapping of the replicated log until the expected number of servers has successfully joined. You can read more about this in the bootstrapping guide.

`-bootstrap-expect`标志向Consul服务器提示我们期望加入的其他服务器节点的数量。 此标志的目的是延迟复制日志的引导，直到预期的服务器数量已成功加入。 更多内容可以在[bootstrapping][bootstrap]指南中阅读。

`-config-dir` 标志向Consul 服务器表明服务发现的定义文件的位置。

`-client` 指定HTTP/DNS API 查询接口的监听地址

组合在一起即为：
```bash
$consul agent -server -bootstrap-expect=1 -data-dir=/tmp/consul -node=agent-test1 -bind=172.16.18.130 -config-dir=/srv/consul/conf.d -ui-dir=/srv/consul-web/ -client 0.0.0.0
```

***在非Server的Agent上， 去掉`-server`标志即可***：
```bash
$consul agent -bootstrap-expect=1 -data-dir=/tmp/consul -node=agent-test1 -bind=172.16.18.130 -config-dir=/srv/consul/conf.d -ui-dir=/srv/consul-web/ -client 0.0.0.0

```

#### 加入集群
在Server Agent 上执行以下命令： 
```bash
$consul join $node_name[$node_ip]
```

#### 启动时自动加入集群
需要atlas 账号和TOKEN， 需在官网上申请， 官方地址: [请点击这里][atlas]

#### 查询节点
查询方法同HTTP/DNS API
> For the DNS API, the structure of the names is NAME.node.consul or NAME.node.DATACENTER.consul. If the datacenter is omitted, Consul will only search the local datacenter.

对于DNS API， 查询的名称结构为：`NAME.node.consul` 或 `name.node.DATACENTER.consul`。 如果数据中心不存在（未指定）， Consul只搜索本地数据中心。
```bash
$dig @127.0.0.1 -p 8600 agent-test2.node.consul

; <<>> DiG 9.9.4-RedHat-9.9.4-29.el7_2.3 <<>> @127.0.0.1 -p 8600 agent-test2.node.consul
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 44359
;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;agent-test2.node.consul.	IN	A

;; ANSWER SECTION:
agent-test2.node.consul. 0	IN	A	172.16.18.131

;; Query time: 0 msec
;; SERVER: 127.0.0.1#8600(127.0.0.1)
;; WHEN: Tue Nov 22 21:03:36 CST 2016
;; MSG SIZE  rcvd: 57
```

#### 脱离集群
关闭agent即可脱离集群。

---

### 健康检查
#### 定义检查项
> Similar to a service, a check can be registered either by providing a check definition or by making the appropriate calls to the HTTP API.

同服务注册一样， 健康检查同通过定义文件或HTTP API实现。
以下定义两个文件分别用于两个节点：
```bash
vm-test-barryz:$ echo '{"check": {"name": "ping",
  "script": "ping -c1 google.com >/dev/null", "interval": "30s"}}' \
  >/etc/consul.d/ping.json

vm-test2-barryz:$ echo '{"service": {"name": "web", "tags": ["rails"], "port": 80,
  "check": {"script": "curl localhost >/dev/null 2>&1", "interval": "10s"}}}' \
  >/etc/consul.d/web.json
```
第一个定义增加了一个主机级别的检查项"ping"， 每30s运行一次，调用`ping -c1 google.com`，在一个基于脚本的健康检查中， 运行该脚本的用户和consul进程用户相同，如果脚本的退出状态码`!=0`，节点就会标记为非健康的。这条规则适用于所有基于脚本的健康检查。
第二个定义修改了服务`web`, 增加了一个每10s通过curl检查web服务器是否可用的检查项，和主机级别的检查项相同， 如果退出状态码`!=0`， 则该服务标记为不可用。


#### 检查健康状态
通过HTTP API接口可以查看节点（服务）的健康状态：
```bash
curl -X GET http://localhost:8500/v1/health/state/critical  // critical 状态
curl -X GET http://localhost:8500/v1/health/state/passing  // passing状态
curl -X GET http://localhost:8500/v1/health/state/failing  // failing状态 
```

通过DNS API查询时，若检查对象不健康，则不返回结果。

---

### key/value 存储
key/value 存储可以用于保持动态配置、协调服务、构建leaders选举等等。

#### 简单用法：
查询（查看是否存在keys）：
```bash
$curl -X GET http://localhost:8500/v1/kv/\?recurse
```
若存在key，则会显示所有key的信息， 若不存在，则会返回404响应体。

`PUT`方法可以添加key：
```bash
$curl -X PUT http://localhost:8500/v1/kv/upstreams/test -d "test"
```
往`upstreams/test`这个key中添加value: `test`。
```bash
$curl -X PUT http://localhost:8500/v1/kv/upstreams/test2?flags=32 -d "test"
```
为`test2`这个key设置了32 的标志位。

***请求返回的响应体内额value值都是经过base64编码（适配非UTF-8字符）。***

#### 检索单个key
```bash
$curl -X GET http://localhost:8500/v1/kv/upstreams/LOCAL_TEST_SERVERS/127.0.0.1:2000
[{"LockIndex":0,"Key":"upstreams/LOCAL_TEST_SERVERS/127.0.0.1:2000","Flags":0,"Value":null,"CreateIndex":532,"ModifyIndex":532}]
```

#### 删除key
```bash
$curl -X DELETE http://localhost:8500/v1/kv/upstreams/LOCAL_TEST_SERVERS/127.0.0.1:2001
true#
```
删除成功返回`true`

***增加`?recurse`请求串删除所有key***

---

### WEB UI
```bash
$consul agent -ui
```
新版本可使用：
```bash
$consul agent -ui-dir=/srv/consul-web/
```
搜索静态资源




[download]: https://www.consul.io/downloads.html
[httpapi]: https://www.consul.io/docs/agent/http.html
[bootstrap]: https://www.consul.io/docs/guides/bootstrapping.html
[atlas]: https://atlas.hashicorp.com/account/new?utm_source=oss&utm_medium=getting-started-join&utm_campaign=consul

