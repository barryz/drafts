# What is **prune called**

```bash
packets pruned from receive queue because of socket buffer overrun
```


> Socket buffer overrun means that data is not fit into special memory buffer, assigned to each connection. All the data coming from network interface is put into such a buffer, and your application is reading from it. Once the application has read the data - it's flushed from this buffer.
Basically you should expect application to read data as soon as it's available and application is free to process the data. But if you have not enough performance - is it CPU saturated or application locked (which is quite often with nodejs) - the data is keep coming, but buffer size is not enough to handle it all.

> Even if you have enourmous buffers - it's still be pruned and data discarded if you application cannot process everything in time.
So I'd suggest you to tune the application performance first.

**套接字缓冲区溢出**意味着数据不适合分配给每个连接的特殊内存缓冲区。 来自网络接口的所有数据都被放入这个缓冲区，应用程序会从这个缓冲区读取数据。缓冲区会在应用程序读取完数据后清空该数据。
基本上你应该期望应用程序在有可用数据的时候就读取数据，并且应用程序可以地自由处理数据。但是假如你的应用程序没有足够的性能-CPU跑满了或者应用hang住 - 数据持续不断的进入， 但缓冲区有限的
大小不足以处理这些数据。

即使你有很大的缓冲区 - 如果您的应用程序无法及时处理所有的内容，它仍然会被修剪并丢弃数据。所以建议优先调整应用性能。


refrenced by [stackoverflow](https://serverfault.com/questions/287157/lots-of-packets-pruned-and-packets-collapsed-because-of-socket-buffer-low-overru/528401)
