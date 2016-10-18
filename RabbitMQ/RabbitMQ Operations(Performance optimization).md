# RabbitMQ Operations(Performance optimization)

标签（空格分隔）：RabbitMQ Linux

---

### Provisioning（配置）
  - Be aware of mirrors: Github, Bintray...
  - Looking into community-hosted mirros
  - Use packages + Chef/Puppet/SaltStack/Ansible...

---
### OS resources （系统资源）
#### Modern Linux defautls are ***absulutely inadequate*** for servers
  - Set ulimit -n and fs.file-max to 500K and forget about it
  - TCP keepalive timeout: from 11 minutes to over 2 hours by default
```bash
net.ipv4.tcp_keepalive_time = 6
net.ipv4.tcp_keepalive_intvl = 3
net.ipv4.tcp_keepalive_probes= 3
```
  - Enable client's ***heartbeat***, eg. with an interval of 6-12 seconds

#### Tuning for ***throughput*** vs. high number of ***concurrent connections***
  - Throughput: larger TCP buffers
```bash
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
```
  - rabbit.hipt_compile = true (only on Erlang 17.x or 18.x)

#### Concurrent connections
smaller TCP buffers, low tcp_fin_timeout, tcp_tw_reuse = 1, ...***

#### Reduce per connection RAM use by 10x
```bash
rabbit.tcp_listen_options.sndbuf = 16384
rabbit.tcp_listen_options.recbuf = 16384
rabbit.tcp_listen_options.backlog
```
```bash
net.ipv4.tcp_fin_timeout = 5
net.ipv4.tcp_tw_reuse = 1
net.core.somaxconn = 4096
```
Careful with tcp_tw_reuse behind NAT*. [YOU MUST READ HERE!][tcp_reuse]

---

### Disk space
  - Pay attention to what partition `/var/lib` ends up on
  - Transient messages can be paged to disk
  - RabbitMQ's disk monitor isn's supported on all platforms

---

### RAM usage
- `rabbit.vm_memory_high_watermark`
- `rabbit.vm_memory_high_watermark_paging_ratio`
- Significant paging efficiency improvements (3.5.5+)
- Disable `rabbit.fhc_read_buffering` (3.5.6+)
```bash
$sudo rabbitmqctl eval 'file_handle_cache:clear_read_cache().'
```
- Ability to set VM RAM watermark as absolute value in 3.6.x
  
---

### Stats collector falls behind(落后)
- Management DB stats collector cat get overwhelmed
- Key symptom: disproportionally higher RAM use on the node that hosts management DB
```bash
$sudo rabbitmqctl eval 'P = whereis(rabbit_mgmt_db), erlang:process_info(P).'

[{registered_name,rabbit_mgmt_db}, 
 {current_function,{erlang,hibernate,3}}, 
 {initial_call,{proc_lib,init_p,5}}, 
 {status,waiting}, 
 {message_queue_len,0}, 
 {messages,[]},
{links,[<5477.358.0>]}, 
{dictionary,[{'$ancestors',[<5477.358.0>,rabbit_mgmt_sup,rabbit_mgmt_sup_sup,
<5477.338.0>]}, {'$initial_call',{gen,init_it,7}}]},
{trap_exit,false},
{error_handler,error_handler},
{priority,high},
{group_leader,<5477.337.0>}, 
{total_heap_size,167},
{heap_size,167},
{stack_size,0},
{reductions,318}, 
{garbage_collection,[{min_bin_vheap_size,46422},
{min_heap_size,233}, {fullsweep_after,65535}, {minor_gcs,0}]},
{suspending,[]}]
```
```bash
rabbit.collect_statistics_interval = 30000
rabbit_management.rates_mode = none
rabbitmqctl eval 'P = whereis(rabbit_mgmt_db), erlang:exit(P, please_crash).'
```
- Parallel stats collector coming soon (3.7.x)

---

### Cluster formation(集群构建)
- Node restart order dependency. 
- [RabbitMQ-Cluster][rabbitmq_cluster]
- [RabbitMQ-AutoCluster][rabbitmq_autocluster]

---

### Backups(备份)
- `cp $RABBITMQ_MNESIA_DIR` + command `tar`
- Replicate everything off-site with `exchange federation` + `messages TTL` via a policy

---

### Hostname changes(更改主机名)
```bash
$sudo rabbitmqctl rename_clsuter_node [old name] [new name]
```

---
### Network partition handling(网络分区处理)
- When in doubt, use "autoheal"
- "Merge" is coming but has very real downsides, too

---

### Misc(杂项)
- Don't use default vhost and(or) credentials
- Do not use 32-bit Erlang
- Use reasonably up-to-date releases
- Participate in [rabbitmq-users][rabbitmq-user]

[tcp_reuse]: http://vincent.bernat.im/en/blog/2014-tcp-time-wait-state-linux.html
[rabbitmq_cluster]: https://github.com/rabbitmq/rabbitmq-clusterer
[rabbitmq_autocluster]: https://github.com/aweber/rabbitmq-autocluster
[rabbitmq-user]: https://groups.google.com/forum/#!forum/rabbitmq-users
