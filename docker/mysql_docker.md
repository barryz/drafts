docker创建mysql容器时，出现几个小问题， 在此记录下：

### 使用docker-compose拉起MySQL容器

**Q**: 本地使用localhost(127.0.0.1)访问MySQL容器出现鉴权问题， 容器内的MySQL实例拒绝`172.18.x.x`网段的访问。

**A**:

***step1*** 使用`docker exec -it $container_id /bin/bash`进入容器

***step2*** 使用MySQL-client登录进入MySQL server，执行以下命令使得所有网段都可以访问该服务器

```bash
>mysql grant all on *.* to root@'%' with grant option ;
>mysql flush privileges;
>mysql select user, host from mysql.user;
```
***step3*** 再回到Mac终端， 即可登录MySQL容器

----
