
# Git图示

![Git Cheet Sheet](https://raw.githubusercontent.com/moooofly/ImageCache/master/Pictures/Git%20Cheat%20Sheet.jpg "Git Cheet Sheet")

![Git 常用命令速查表](https://raw.githubusercontent.com/moooofly/ImageCache/master/Pictures/Git%20%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4%E9%80%9F%E6%9F%A5%E8%A1%A8.png "Git 常用命令速查表")

----------

# Git Tips

**不建议 `git push` 的时候使用 `-f` 强制推送！！！**

### git clone 时直接 rename

```shell
git clone git@github.com:moooofly/aaa.git bbb
```

### 基于本地项目创建 github repo

```shell
cd /path/to/project/dir/
git init
git add .
git commit -m "first commit"
git remote add origin git@github.com:moooofly/your_project_name.git
(git pull origin master)
git push -u origin master
```

### 修改最近一次commit message

```bash
git commit --amend
```

### 新建本地分支并切换至该分支

```bash
git checkout -b your_branch

相当于:

git branch your_branch
git checkout your_branch
```

### 添加远程仓库

```bash
git remote add $repo_name $repo_addr
```

> 注1：在执行 `git remote add xxx` 前，需要先在 github 上创建一个名为 your_project_name 的 repo ；
>
> 注2：上面用小括号括起来的命令的使用场景为：若在 github 上新建 repo 的时候，顺带创建了 README 或 .gitignore 或 LICENSE 等文件时，则需要先将上述文件拉取到本地；
>
> 注3：上面的 git@github.com:moooofly/your_project_name.git 可以换成 https://github.com/moooofly/your_project_name.git ，还可以使用 https://github.com/moooofly/your_project_name
>
> 注4：`remote add` 后就可以进行 pull 了，但仍无法 push ；需要通过 `push -u` 或 `push --set-upstream` 的方式，在 push 的同时建立跟踪关系；
>
> 注5：上面执行 `git pull origin master` 时可能会报 "fatal: refusing to merge unrelated histories" 错误，此时可以使用 `--allow-unrelated-histories` 选项解决，即 `git pull origin master --allow-unrelated-histories` ；详情参见[这里](https://stackoverflow.com/questions/37937984/git-refusing-to-merge-unrelated-histories/40107973#40107973?newreg=5095f8141c34479ba419f5e8b2d1b415)；

### 回退当前repo到指定commit

```bash
git reset --hard $commit_id
```

### 回退当前repo到上次提交commit

```bash
git reset --hard HEAD^
```

### 回退当前repo HEAD指向至指定的commit，repo内容不回退

```bash
git reset --soft $commit_id
```

### 回退当前repo到上次提交commit, repo内容不回退

```bash
git reset --soft HEAD^
```


### diff当前commit与指定commit

```bash
git diff $commit_id
```

### diff当前commit与上次提交

```bash
git diff HEAD^
```

### 本地新建分支后 push 到 github repo

创建并切换分支（新分支内容为源分支内容的拷贝）

```shell
git checkout -b new_branch
```
此时分支信息**仅在本地存在**；

**若 github 上尚不存在 new_branch 分支**，则通过执行下面的命令，就可以将新建的本地 new_branch 分支中的内容 push 到 github 上对应的 new_branch 分支上（包含创建行为），并**建立跟踪关系**；

```shell
git push -u
git push --set-upstream origin new_branch
```

之后就可以在 github 页面中看到对应分支内容了；

**若 github 上已经存在 new_branch 分支**，那么你可能只是想要将本地的 new_branch 分支与其建立跟踪关系，可以执行如下命令；

```shell
git branch --set-upstream-to=origin/new_branch new_branch
```


### 将远端 github repo 里的指定分支拉取到本地（本地不存在的分支）

当想要从远端仓库里拉取一条本地不存在的分支时，可以执行

```
git checkout -b local_branch_name origin/remote_branch_name
```

将会自动创建一个新的名为 local_branch_name 的本地分支，并与指定的远程分支 origin/remote_branch_name 关联起来。

如果出现提示：

```
fatal: Cannot update paths and switch to branch 'aaa' at the same time.
Did you intend to checkout 'origin/bbb' which can not be resolved as commit?
```

需要先执行

```
git fetch
```

再执行

```
git checkout -b local_branch_name origin/remote_branch_name
```


### 重命名 github repo 中的远程分支名

当在本地执行过如下命令后，你将会创建一个本地分支 old_branch 并且关联到远程的 old_branch 分支上；

```shell
git checkout -b old_branch
git push -u
```

此时若想更改远程分支的名字，则可以按如下方式进行操作：

- 修改本地分支名字

```shell
git branch -m old_branch new_branch
```

- 删除远程待修改分支名（其实就是推送一个空分支到远程分支，以达到删除远程分支的目的）

```shell
git push origin :old_branch
```

在 Git v1.7.0 之后，可以使用这种语法删除远程分支

```shell
git push origin --delete <remote_branch_name>
```

> 删除本地分支命令为（需要切换到其他分支上执行该命令）
> ```shell
> git branch -d <local_branch_name>
> ```

- 将本地的新分支 push 到远程

```shell
git push -u
```


分支信息查看说明：

> - 查看本地分支名字
>
> ```shell
> git branch
> ```
>
> - 查看本地和远程分支名字（红色显示部分为远程分支）
>
> ```shell
> git branch -a
> ```
>
> - 查看本地和远程分支名字，会显示出本地和远程的 tracking 关系；
>
> ```shell
> git branch -a -vv
> ```


### 删除不存在对应远程分支的本地分支

一种情况：提交 PR 后，远端 master 分支在 PR 合并完成后，一般会直接删除对应的 PR 分支，而提交 PR 的人在本地会看到如下提示信息；

```shell
➜  redis_dissector_for_wireshark git:(master)  git branch -a  -- 该命令看不出问题
* master
  revert
  remotes/origin/master
  remotes/origin/revert
➜  redis_dissector_for_wireshark git:(master)
➜  redis_dissector_for_wireshark git:(master) git remote show origin
* remote origin
  Fetch URL: git@github.com:moooofly/redis_dissector_for_wireshark.git
  Push  URL: git@github.com:moooofly/redis_dissector_for_wireshark.git
  HEAD branch: master
  Remote branches:
    master                     tracked
    refs/remotes/origin/revert stale (use 'git remote prune' to remove) -- 这里
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (local out of date)
➜  redis_dissector_for_wireshark git:(master)
```

上述信息表明：
> remote 分支 revert 处于 stale 状态（过时）

两种解决方法：
- 使用 `git remote prune origin` 将对应的分支关联信息从本地版本库中去除；
- 更简单的方法是使用 `git fetch -p` 命令，在 fetch 之后，自动删除掉没有与远程分支对应的本地分支；

输出结果如下

```shell
➜  redis_dissector_for_wireshark git:(master) git fetch -p
From github.com:moooofly/redis_dissector_for_wireshark
 x [deleted]         (none)     -> origin/revert
remote: Counting objects: 1, done.
remote: Total 1 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (1/1), done.
   ea2ef49..193304e  master     -> origin/master
➜  redis_dissector_for_wireshark git:(master)
➜  redis_dissector_for_wireshark git:(master) git branch -a
* master
  revert
  remotes/origin/master
➜  redis_dissector_for_wireshark git:(master)
➜  redis_dissector_for_wireshark git:(master) git remote show origin
* remote origin
  Fetch URL: git@github.com:moooofly/redis_dissector_for_wireshark.git
  Push  URL: git@github.com:moooofly/redis_dissector_for_wireshark.git
  HEAD branch: master
  Remote branch:
    master tracked
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (local out of date)
➜  redis_dissector_for_wireshark git:(master)
```

最后还需要通过 `git branch -D revert` 删除 local 分支；
```shell
➜  redis_dissector_for_wireshark git:(master) git branch -D revert
Deleted branch revert (was be9b8d1).
➜  redis_dissector_for_wireshark git:(master)
```


### fork 别人项目后如何同步其后续更新

先从自己的 github 中 clone 一份内容
```shell
git clone git@github.com:moooofly/sre.git
```

此时只有名为 origin 的 remote
```shell
git remote -v
```

新增名为 eleme_sre 的 remote ，即当前 repo 的始祖；
```shell
git remote add eleme_sre https://github.com/eleme/sre.git
```

再次查看时，已经增加了名为 eleme_sre 的 remote ；
```shell
git remote -v
```

从 eleme_sre 的 master 分支上拉取内容到本地；
```shell
git pull eleme_sre master
```

将拉取到本地的内容推到名为 origin 的 master 分支，即推到自己的 github 仓库中；
```shell
git push origin master
```

> 上述命令最好写完整，否则容易引起混乱或歧义；


---

# Github WorkFlow （base fork)

### 1. 构建源码仓库

这一步通常由项目发起人来操作，我们这里把管理员设为PingHackers，假设PingHackers已经为我们建立起了一个源仓库PingHackers/git-demo，并且已经初始化了两个永久性分支master和develop，如图：

![PingHackers](https://raw.githubusercontent.com/livoras/blog-images/master/git/git-demo-branch.png)

### 2. 开发者fork仓库

源仓库建立以后，每个开发就可以去复制一份源仓库到自己的github账号中，然后作为自己开发所用的仓库。假设我是一个项目中的开发者，我就到PingHackers/git-demo项目主页上去fork：

![PingHackers_fork](https://raw.githubusercontent.com/livoras/blog-images/master/git/git-demo-fork-origin.png)

### 3. 把自己开发者仓库clone到本地

```bash
$git clone https://github.com/path/to/yourrepo
```

### 4. 构建功能分支进行开发

进入仓库中，按照前面说所的构建功能分支的步骤，构建功能分支进行开发、合并，假设我现在要开发一个“讨论”功能：

```bash
>>> git checkout develop
    # 切换到`develop`分支

    >>> git checkout -b feature-discuss
    # 分出一个功能性分支

    >> touch discuss.js
    # 假装discuss.js就是我们要开发的功能

    >> git add .
    >> git commit -m 'finish discuss feature'
    # 提交更改

    >>> git checkout develop
    # 回到develop分支

    >>> git merge --no-ff feature-discuss
    # 把做好的功能合并到develop中

    >>> git branch -d feature-discuss
    # 删除功能性分支

    >>> git push origin develop
    # 把develop提交到自己的远程仓库中

    若远程分支中不存在develop分支， 则需要新建远程develop分支
    >>> git push origin develop:develop
```

这时候，你上自己github的项目主页中develop分支中看看，已经有discuss.js这个文件了：

![PingHackers_push](https://raw.githubusercontent.com/livoras/blog-images/master/git/git-demo-push.png)

### 5. 向管理员提交pull request

假设我完成了“讨论”功能（当然，你还可能对自己的develop进行了多次合并，完成了多个功能），经过测试以后，觉得没问题，就可以请求管理员把自己仓库的develop分支合并到源仓库的develop分支中，这就是传说中的pull request。

![PingHackers_push_pr](https://raw.githubusercontent.com/livoras/blog-images/master/git/git-demo-pull-request.png)

点击上图的绿色按钮，开发者就可以就可以静静地等待管理员对你的提交的评审了。

![PingHackers_push_pr2](https://raw.githubusercontent.com/livoras/blog-images/master/git/git-demo-pull-request-origin.png)

### 6. 管理员测试、合并 (自动测试或开发者自己测试代码)

接下来就是管理员的操作了，作为管理员的PingHackers登陆github，便看到了我对源仓库发起的pull request。

![PingHackers_mg](https://raw.githubusercontent.com/livoras/blog-images/master/git/pull-request-origin.png)

这时候PingHackers需要做的事情就是：

  1. **对我的代码进行review**。github提供非常强大的代码review功能：
  ![review](https://raw.githubusercontent.com/livoras/blog-images/master/git/git-demo-review.png)

  2. **review没有问题**, 即可合并至 `master` 或 `develop` 分支

---

# merge和rebase的区别

### git pull

git pull 是　git fetch + git merge FETCH_HEAD 的缩写。所以，默认情况下，git pull就是先fetch，然后执行merge 操作，如果加–rebase 参数，就是使用git rebase 代替git merge。

### merge 和 rebase

merge 是合并的意思，rebase是复位基底的意思。

现在我们有这样的两个分支,test和master，提交如下：

```bash
      D---E test
     /
A---B---C---F master
```

在master执行git merge test,然后会得到如下结果：

```bash
      D--------E
     /          \
A---B---C---F----G   test, master
```

在master执行git rebase test，然后得到如下结果：

```bash
A---B---D---E---C'---F'   test, master
```

可以看到，merge操作会生成一个新的节点，之前的提交分开显示。而rebase操作不会生成新的节点，是将两个分支融合成一个线性的提交。

### 总结

通过上面可以看到，想要更好的提交树，使用rebase操作会更好一点。这样可以线性的看到每一次提交，并且没有增加提交节点。

在我们操作过程中。merge 操作遇到冲突的时候，当前merge不能继续进行下去。手动修改冲突内容后，add 修改，commit 就可以了。

而rebase 操作的话，会中断rebase,同时会提示去解决冲突。解决冲突后,将修改add后执行git rebase –continue继续操作，或者git rebase –skip忽略冲突。

---

# 定制化 git 全局配置

取自：[SRE 团队 git 配置参考](https://github.com/eleme/sre/blob/master/git.md)

```shell
[color]

    ui = auto

[alias]

    lg1 = log --graph --all --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(bold white)— %an%C(reset)%C(bold yellow)%d%C(reset)' --abbrev-commit --date=relative

    lg2 = log --graph --all --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(bold white)— %an%C(reset)' --abbrev-commit

[core]

    editor = vim

    safecrlf = true

    excludesfile = ~/.gitignore

[push]

    default = current

[rerere]

    enabled = 1

    autoupdate = 1

[user]

    name = your-name

    email = your-email

[merge]

    tool = vimdiff

[url "git@github.com:"]

    insteadOf = https://github.com/

[url "git@github.com:"]

    insteadOf = http://github.com/

[url "git@github.com:"]

    insteadOf = git://github.com/
```



# 基于 SSH 协议访问 git

```shell
vagrant@vagrant-ubuntu-trusty:~$ ll .ssh

total 16
drwx------ 2 vagrant vagrant 4096 Jun  6 09:30 ./
drwxr-xr-x 7 vagrant vagrant 4096 Jun  6 09:38 ../
-rw------- 1 vagrant vagrant  389 Jun  6 08:18 authorized_keys
-rw-r--r-- 1 vagrant vagrant  884 Jun  6 09:30 known_hosts
vagrant@vagrant-ubuntu-trusty:~$
```


创建 RSA 密钥对
```shell
vagrant@vagrant-ubuntu-trusty:~$ ssh-keygen -t rsa -b 4096 -C "aaa@bbb.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/vagrant/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):               -- 最好不使用密码
Enter same passphrase again:

Your identification has been saved in /home/vagrant/.ssh/id_rsa.
Your public key has been saved in /home/vagrant/.ssh/id_rsa.pub.

The key fingerprint is:
f1:a9:8a:a3:23:18:64:3e:5b:3a:e9:39:54:32:23:83 aaa@bbb.com

The key's randomart image is:
+--[ RSA 4096]----+
|                 |
|                 |
|.       .        |
|E* .     o .     |
|=.=     S o      |
|.+ .     .       |
|o.*     .        |
|o*o .. .         |
|.++o...          |
+-----------------+
vagrant@vagrant-ubuntu-trusty:~$
```

```shell
vagrant@vagrant-ubuntu-trusty:~$ ll .ssh

total 24
drwx------ 2 vagrant vagrant 4096 Jun  6 09:40 ./
drwxr-xr-x 7 vagrant vagrant 4096 Jun  6 09:38 ../
-rw------- 1 vagrant vagrant  389 Jun  6 08:18 authorized_keys
-rw------- 1 vagrant vagrant 3243 Jun  6 09:40 id_rsa
-rw-r--r-- 1 vagrant vagrant  745 Jun  6 09:40 id_rsa.pub
-rw-r--r-- 1 vagrant vagrant  884 Jun  6 09:30 known_hosts
vagrant@vagrant-ubuntu-trusty:~$
```

```shell
vagrant@vagrant-ubuntu-trusty:~/workspace/eleme_project$ eval "$(ssh-agent -s)"
Agent pid 1371
vagrant@vagrant-ubuntu-trusty:~/workspace/eleme_project$ ssh-add ~/.ssh/id_rsa
Identity added: /home/vagrant/.ssh/id_rsa (/home/vagrant/.ssh/id_rsa)
vagrant@vagrant-ubuntu-trusty:~/workspace/eleme_project$
```

最后将 id_rsa.pub 文件中的内容添加到 github 账户中


----------



# 如何在 git 中写出好的 commit 说明

> 原文地址：[这里](https://ruby-china.org/topics/15737)

## 为什幺要关注提交信息

- 加快 Reviewing Code 的过程；
- 帮助我们写好 release note ；
- 5 年后帮你快速想起来某个分支，`tag` 或者 `commit` 增加了什么功能，改变了哪些代码；
- 让其他的开发者在运行 `git blame` 的时候想跪谢；
- 总之一个好的提交信息，会帮助你提高项目的整体质量

## 基本要求

- 第一行应该少于 50 个字。随后是一个空行；第一行题目也可以写成：`Fix issue #8976` ；
- 喜欢用 `vim` 的哥们把下面这行代码加入 `.vimrc` 文件中，来检查拼写和自动折行 `autocmd Filetype gitcommit setlocal spell textwidth=72`
- 永远不在 `git commit` 上增加 `-m <msg>` 或 `--message=<msg>` 参数，而单独写提交信息；

一个不好的例子 `git commit -m "Fix login bug"`

一个推荐的 commit message 应该是这样：

```
Redirect user to the requested page after login

https://trello.com/path/to/relevant/card

Users were being redirected to the home page after login, which is less
useful than redirecting to the page they had originally requested before
being redirected to the login form.

* Store requested path in a session variable
* Redirect to the stored location after successfully logging in the user
```

- 注释最好包含一个链接指向你们项目的 **issue**/**story**/**card**。一个完整的链接比一个 issue numbers 更好；
- 提交信息中包含一个简短的故事，能让别人更容易理解你的项目；

## 注释要回答如下信息

### 为什么这次修改是必要的？

要告诉 Reviewers，你的提交包含什么改变。让他们更容易审核代码和忽略无关的改变。

### 如何解决的问题？

这可不是说技术细节。看下面的两个例子：

```
Introduce a red/black tree to increase search speed
```

```
Remove <troublesome gem X>, which was causing <specific description of issue introduced by gem>
```

如果你的修改特别明显，就可以忽略这个。

### 这些变化可能影响哪些地方？

这是你最需要回答的问题。因为它会帮你发现在某个 branch 或 commit 中的做了过多的改动。**一个提交尽量只做 1，2 个变化**。

你的团队应该有一个自己的行为规则，规定每个 commit 和 branch 最多能含有多少个功能修改。

## 小提示

- 使用 fix, add, change 而不是 fixed, added, changed ；
- 永远别忘了第 2 行是空行；
- 用 Line break 来分割提交信息，让它在某些软件里面更容易读；
- 请将每次提交限定于完成一次逻辑功能。并且可能的话，适当地分解为多次小更新，以便每次小型提交都更易于理解。

## 例子

```
Fix bug where user can't signup.

[Bug #2873942]

Users were unable to register if they hadn't visited the plans
and pricing page because we expected that tracking
information to exist for the logs we create after a user
signs up.  I fixed this by adding a check to the logger
to ensure that if that information was not available
we weren't trying to write it.
```

```
Redirect user to the requested page after login

https://trello.com/path/to/relevant/card

Users were being redirected to the home page after login, which is less
useful than redirecting to the page they had originally requested before
being redirected to the login form.

* Store requested path in a session variable
* Redirect to the stored location after successfully logging in the user
```

---

# 其他

- [GitHub秘籍](https://snowdream86.gitbooks.io/github-cheat-sheet/content/zh/index.html)

---

## 引用

- [moooofly blog](https://github.com/moooofly/MarkSomethingDown/blob/master/nonsense/git%20%E4%BD%BF%E7%94%A8%E5%A7%BF%E5%8A%BF.md)
- [livoras blog](https://github.com/livoras/blog/issues/7)
- [码农明明桑](http://blog.isming.me/2014/09/26/git-rebase-merge/)

## 参考

- [A Note About Git Commit Messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
- [Writing good commit messages](https://github.com/erlang/otp/wiki/Writing-good-commit-messages)
- [A Better Git Commit](https://web-design-weekly.com/2013/09/01/a-better-git-commit/)
- [5 Useful Tips For A Better Commit Message](https://robots.thoughtbot.com/5-useful-tips-for-a-better-commit-message)
- [stopwritingramblingcommitmessages](http://stopwritingramblingcommitmessages.com/)
- [Git Commit Good Practice](https://wiki.openstack.org/wiki/GitCommitMessages)
- [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w)
