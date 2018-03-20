# 内存对齐（字节对齐）

## 概念

对齐跟数据在内存中的位置有关。如果一个变量的内存地址正好位于它长度的整数倍，他就被称做自然对齐。比如在32位cpu下，假设一个整型变量的地址为0×00000004，那它就是自然对齐的。再比如在64位的cpu下， 变量地址为0x00000008，那也是自然对齐的。

## 为什么要对齐

### CPU访问内存数据的效率问题

假设整型变量的地址不是自然对齐，比如为`0×00000002`，则CPU如果取它的值的话需要 访问两次内存，第一次取从`0×00000002`-`0×00000003`的一个short，第二次取从`0×00000004`-`0×00000005`的一个 short然后组合得到所要的数据，如果变量在`0×00000003`地址上的话则要访问三次内存，第一次为char，第二次为short，第三次为 char，然后组合得到整型数据。而如果变量在自然对齐位置上，则只要一次就可以取出数据。

---

## Go内存对齐

### 基础数据类型的数据大小

```go
var b bool
fmt.Println(unsafe.Sizeof(b)) // 1 byte
var i8 int8
fmt.Println(unsafe.Sizeof(i8)) // 1 byte
var i16 int16
fmt.Println(unsafe.Sizeof(i16)) // 2 bytes
var i32 int32
fmt.Println(unsafe.Sizeof(i32)) // 4 bytes
var i64 int64
fmt.Println(unsafe.Sizeof(i64)) // 8 bytes

var f32 float32
fmt.Println(unsafe.Sizeof(f32)) // 4 bytes
var f64 float64
fmt.Println(unsafe.Sizeof(f64)) // 8 bytes

var s string
fmt.Println(unsafe.Sizeof(s)) // 16 bytes: 指针字段占8个字节， Len字段占8字节
var sl []string
fmt.Println(unsafe.Sizeof(sl)) // 24 bytes: 指针字段占8个字节， Len字段占8字节, Cap字段占8字节
var m map[string]string
fmt.Println(unsafe.Sizeof(m)) // 8 bytes: 指针字段占8个字节
var em struct{}
fmt.Println(unsafe.Sizeof(em)) // 0 bytes
```

### struct 大小

```go
// size:
type user1 struct {
    i byte
    j int32
    k int64
}


type user2 struct {
    j int32
    i byte
    k int64
}

type user3 struct {
    j int32
    k int64
    i byte
}
```

**上述几个结构体的字段完全相同， 但是结构体大小却不一定相同**， 这主要是受下列几个因素影响：

- 内存对齐
- 字段排列顺序

### Go内存对齐的规则

1. 对于具体字段类型来说，对齐值=**min(编译器默认对齐值，字段类型大小Sizeof长度)**。也就是在默认设置的对齐值和字段的类型的内存占用大小之间，取最小值为该类型的对齐值，这里默认是8，所以最大值不会超过8.

2. struct在每个字段都内存对齐之后，其本身也要进行对齐，对齐值=**min(编译器默认对齐值，所有字段中最大类型的长度)**。这条也很好理解，struct的所有字段中，最大的那个类型的长度以及默认对齐值之间，取最小的那个。

注: **对齐值也叫对齐系数、对齐倍数，对齐模数。这就是说，每个字段在内存中的偏移量是对齐值的倍数即可**。


### 计算过程
```go
// 内存中可表示为
// ixxx|jjjj|kkkk|kkkk
type user1 struct {
    i byte
    j int32
    k int64
}
```

`user1`类型，第1个字段byte，对齐值1，大小1，所以放在内存布局中的第1位。 `i`

第2个字段int32，对齐值4，大小4，所以它的内存偏移值必须是4的倍数，在当前的`user1`中，就不能从第2位开始了，必须从第5位开始，也就是偏移量为4。第2，3，4位由编译器进行填充，一般为值0，也称之为内存空洞。所以第5位到第8位为第2个字段j。 `ixxx|jjjj`

第3字段，对齐值为8，大小也是8。因为user1前两个字段已经排到了第8位，所以下一位的偏移量正好是8，是第3个字段对齐值的倍数，不用填充，可以直接排列第3个字段，也就是从第9位到第16位为第3个字段k。 `ixxx|jjjj|kkkk|kkkk`

现在第一条内存对齐规则后，内存长度已经为16个字节，我们开始使用内存的第2条规则进行对齐。根据第二条规则，默认对齐值8，字段中最大类型长度也是8，所以求出结构体的对齐值位8，我们目前的内存长度为16，是8的倍数，已经实现了对齐。

所以到此为止，结构体`user1`的内存占用大小为16字节。 `ixxx|jjjj|kkkk|kkkk`


```go
// 内存中可表示为
// ixxx|xxxx|kkkk|kkkk|jjjj|xxxx
type user2 struct {
    i byte
    k int64
    j int32
}
```

`user2`类型，第1个字段byte，对齐值1，大小1，所以放在内存布局中的第1位。 `i`

第2个字段int64，对齐值8，大小8，所以它的内存偏移值必须是8的倍数，在当前的`user2`中，不能从第2位开始，必须从第9位开始，也就是偏移量为8。第2，3，4，5，6， 7， 8位由编译器进行填充，一般为值0，也称之为内存空洞。所以第5位到第8位为第2个字段k。 `ixxx|xxxx|kkkk|kkkk`

第3字段，对齐值为4，大小也是4。因为`user2`前两个字段已经排到了第16位，所以下一位的偏移量为是4，是第3个字段对齐值的倍数，不用填充，可以直接排列第3个字段，也就是从第17位到第20位为第3个字段j。 `ixxx|jjjj|kkkk|kkkk|jjjj`

现在第一条内存对齐规则后，内存长度已经为20个字节，我们开始使用内存的第2条规则进行对齐。根据第二条规则，默认对齐值8，字段中最大类型长度也是8，所以求出结构体的对齐值位8，我们目前的内存长度为20，不是8的倍数，没有实现了对齐，所以最后四位还需要补0， 补到24， 正好为8的倍数为止。

所以最终`user2`的内存布局为: `ixxx|jjjj|kkkk|kkkk|jjjj|xxxx`， 为24个字节。


# 总结

 有时候合理的字段顺序可以减少内存的开销 。

## 参考

- [Go实战指南](http://www.flysnow.org/2017/07/02/go-in-action-unsafe-memory-layout.html)

- [C字节对齐问题](https://segmentfault.com/a/1190000000474493)

- [Golang字节对齐](http://www.hatlonely.com/2018/03/17/golang-%E5%AD%97%E8%8A%82%E5%AF%B9%E9%BD%90/)
