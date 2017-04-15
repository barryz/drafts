### Setup/Configure redis:

```bash
$brew install redis
$brew info redis
$ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents
$launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
$launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```


