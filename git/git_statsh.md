`#每日一命令系列` :muscle:


### git stash

> git-stash - Stash the changes in a dirty working directory away

将当前变更保存到脏工作目录中， 脏的工作目录可以理解为有修改还未提交的工作目录。


#### 命令

```bash
git stash list [<options>]
git stash show [<stash>]
git stash drop [-q|--quiet] [<stash>]
git stash ( pop | apply ) [--index] [-q|--quiet] [<stash>]
git stash branch <branchname> [<stash>]
git stash [push [-p|--patch] [-k|--[no-]keep-index] [-q|--quiet]
	     [-u|--include-untracked] [-a|--all] [-m|--message <message>]
	     [--] [<pathspec>…​]]
git stash clear
git stash create [<message>]
git stash store [-m|--message <message>] [-q|--quiet] <commit>
```

#### 描述

如果你想在切换到其他干净的工作目录(比如：切换到其他分支)之前保存当前工作目录的状态（changes and index)时， 可以使用`git stash`. 此命令会保存你在当前工作目录下本地的一些修改并且将index回退到HEAD.

- `git stash list` 可以列出已经隐藏过的修改
- `git stash show` 检查隐藏过得修改
- `git stash apply` 恢复隐藏的修改
- `git stash pop` 恢复最近一次隐藏的修改
- `git stash [push]` 默认是隐藏当前的修改内容


#### 典型应用场景

***在当前的工作目录中(on going状态)下拉取最新的代码***

如果上游upstream有新的更改， 且本地需要拉取时， 在没有冲突的情况下使用git pull是可以合并代码至当前工作目录的。

如果上游upstram有新的更改，但拉取时存在冲突，就没办法直接拉取代码了。

可以使用如下命令解决：

```bash
$ git pull
...
# WRONG !!!! file foobar not up to date, cannot merge.

# Use commands as below to instead
$ git stash
$ git pull
$ git stash pop
  ```

***中断当前工作流，开启另外的工作流***

比如有的时候需要修复一个bug， 这时候需要新建一个bugfix分支去修复bug....但是当前的工作目录有一波修改还未提交， 此时常规的做法的是：


```bash
# ... bala bala bala ...
# working branch is my_work
$ git commit -a -m "Temp"
$ git checkout -b hot_fix
$ edit emergency fix
$ git commit -a -m "Fix in a hurry"
$ git checkout my_work
$ git reset --soft HEAD^
# ... continue bala bala...
```

其实这时候可以使用`git stash` 简化操作:


```bash
# ... bala bala bala ...
# working branch is my_work
$ git stash
$ edit emergency fix
$ git commit -a -m "Fix in a hurry"
$ git stash pop
# ... continue bala bala...
```


***测试部分的提交更新***

如果要从工作树中的更改中进行两次或更多次提交，并且希望在提交之前测试每个更改，则可以使用`git stash push --keep-index`

```bash
# ... bala bala bala ...
$ git add --patch foo            # add just first part to the index
$ git stash push --keep-index    # save all other changes to the stash
$ edit/build/test first part
$ git commit -m 'First part'     # commit fully tested change
$ git stash pop                  # prepare to work on all other changes
# ... repeat above five steps until one commit remains ...
$ edit/build/test remaining parts
$ git commit foo -m 'Remaining parts'
```



参考: [git stash](https://git-scm.com/docs/git-stash)
