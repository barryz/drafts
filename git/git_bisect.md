`#每日一命令系列` :muscle:


### git bisect

> git bisect - Use the binary search to find the commit that introduced bug.

通过二分查找法在commit历史中找到特定的bug提交.



### 用法

```bash

$git bisect [subcommand] options
$git bisect --help
```


### 应用场景

工作中有次提交触发了一个未知的bug， 但不知道是哪次提交造成的， 中间可能已经隔了几十个提交记录， 当时的做法是人工二分搜索法去排除有问题的commit...

其实这个问题，正是`bitsect`命令的应用场景：

首先， 运行 `git bisect start` 来开始二分搜索bug大法。

如果当前所在的commit已经有问题了， 那么就将当前的commit标记为**bad**。

然后你必须要告诉git， 最后一次正常的提交的（不确定的情况下，尽量把区间放大）commit ID, 使用 `git bisect good [good commit id]`

```bash
$git bisect start # enter bisect mode
$git bisect bad  # mark current commit is still bad
$git bisect good [good commit id] # set the good commit id you think
Bisecting: 60 revisions left to test after this
[ecb6e1bc347ccecc5f9350d878ce677feb13d3b2] error handling on repo
```
Git 发现在你标记为正常的提交commit ID 和当前错误版本之间大概有120个提交， 于是它checkout出中间的一个。 这个时候，你可以运行测试来检查是否是当前的commit出错，如果出错， 那么出错的commit就在这个中间提交中某次commit引入的。如果没有出错， 那么错误就是在这次中间提交之后引入的。

假设这里没有出现错误，则表明错误是在此次中间提交之后出现的， 那么就要标记此次中间提交是**good**状态：

```bash
$git bisect good
Bisecting: 30 revisions left to test after this
[b047b02ea83310a70fd603dc8cd7a6cd13d15c04] testing xxxx
```

以这样的二分查找方式，进行bug寻找，会比较搞笑。 等最终找bug所在的提交之后， 可以通过 **reset** 命令恢复到最初状态：

```bash
$git bisect reset
```

### 总结

[Referenced](http://iissnan.com/progit/html/zh/ch6_5.html)
