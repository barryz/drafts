### Setup/Configure redis:

```bash
$brew install redis
$brew info redis
$ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents
$launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
$launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

也可以使用homebrew服务管理工具:

```
$brew services list
$brew services start|stop|restart redis(mysql)
```



