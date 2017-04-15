### mac 安装mysql

访问MySQL官网下载链接: [click here](http://www.mysql.com/downloads/mysql/), 下载dmg安装包， 一路下一步 :joy:

---

### 启动
>On macOS Sierra & OS to start/stop/restart MySQL post 5.7  from the command line:

```bash
$sudo launchctl load -F /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
```

```bash
$sudo launchctl unload -F /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
```

**maybe need you offer the root password.**

---

### 修改root原始密码:

```bash
>SET PASSWORD FOR 'root'@'localhost' = PASSWORD("root");
```

