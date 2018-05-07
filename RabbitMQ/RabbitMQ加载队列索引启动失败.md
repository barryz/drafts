## 0x01 前言

测试环境的`rabbitmq` 遇到无法启动的情况， ops提供的日志截图中包括:

```bash
Had a server that couldn't start due to a corrupt queue index file.

=ERROR REPORT==== 7-May-2018::10:57:08 ===
** Generic server <0.171.0> terminating
** Last message in was {'$gen_cast',
                           {submit_async,
                               #Fun<rabbit_queue_index.32.38356666>}}
** When Server state == undefined
** Reason for termination ==
** {function_clause,
       [{rabbit_queue_index,journal_minus_segment1,
            [{{true,
                  <<210,124,139,191,213,156,62,104,107,226,7,108,7,75,110,182,
                    0,0,0,0,0,0,0,0,0,0,36,160>>,
                  <<>>},
              no_del,no_ack},
             {{true,
                  <<210,124,139,191,213,156,62,104,107,226,7,108,7,75,110,182,
                    0,0,0,0,0,0,0,0,0,0,36,160>>,
                  <<>>},
              del,no_ack}],
            []},
        {rabbit_queue_index,'-journal_minus_segment/3-fun-0-',4,[]},
        {array,sparse_foldl_3,7,[{file,"array.erl"},{line,1690}]},
        {array,sparse_foldl_2,9,[{file,"array.erl"},{line,1684}]},
        {rabbit_queue_index,'-recover_journal/1-fun-0-',1,[]},
        {lists,map,2,[{file,"lists.erl"},{line,1238}]},
        {rabbit_queue_index,segment_map,2,[]},
        {rabbit_queue_index,recover_journal,1,[]}]}
```

从日志上看应该是加载队列索引引起的启动报错。

---

## 0x02 解决

### 暴力方法(快速恢复集群可用性):

清空`rabbitmq`数据目录， 一般是`/locate/to/rabbitmq/mnesia/`， 一般使用:

```bash
cd $path
mv mnesia{,.bak}
```

清理数据目录时需要注意几个点：

- 清空时最好停掉`rabbitmq`: `$rabbitmqctl stop_app`
- 在集群的其他节点执行命令: `$rabbitmqctl forget_cluster_node $the_reset_node_name`
- 清空数据目录之后: `$rabbitmqctl force_reset && rabbitmqctl join_cluster $the_other_node_name && rabbitmqctl start_app`



### 保留队列和消息(删除数据目录下队列的索引文件)

如果能使用strace工具， 可以在rabbitmq启动时查看在哪一步hang住了： 命令如下：

```bash
strace -fytT -e trace=file -o strace.log rabbitmq-server
```

可以在strace.log中看到rabbitmq-server在加载哪个队列索引的时候卡住了。再去删除对应的索引文件即可。 索引文件一般以 `.idx` 结尾。

如果不能使用strace命令， 那就需要**清除数据目录下`***/mnesia/$node_name/queues/$RANDOM_DIR/*.idx`所有的索引文件**。
这里最好写个脚本批量删除， 索引文件可能有很多个。


清理队列索引文件时需要注意几个点：

- 清空时最好停掉`rabbitmq`: `$rabbitmqctl stop_app`
- 清空索引文件之后: `$rabbitmqctl start_app`即可


## 0x03 报错原因分析
TODO
