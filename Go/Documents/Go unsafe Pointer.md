# Go unsafe Pointer


Go在设计之初， 为了效率和降低复杂度， 被设计成一门强类型静态语言。 强类型意味着类型一旦定义， 就不可再改变； 静态意味着在编译期间就会做类型检查。

但是出于安全的考虑， Go又允许两个指针类型进行类型转换， 这里两个指针类型的转换，就需要用到 `unsafe.Pointer`。

## 指针类型转换

### Demo 0x01
```go
func main() {
        var i float64
        i = 10.0
        x := &i

        var xx int32 = (*int32)(x)
        fmt.Println(xx)
        // cannot convert x (type *float64) to type *int32
}
```
直接进行指针的类型转换会panic， 无法转换成功。


### Demo 0x02
```go
func main() {
        x := 10                             // &x is *int
        y := (*float32)(unsafe.Pointer(&x)) // y is *float32
        *y *= 3
        fmt.Println(x) // 30
}
```
以上示例， 我们可以把`*int`转换成`*float32`， 然后对新的`*float32`的y进行操作， 同时也改变了x的值。

> Pointer represents a pointer to an arbitrary type. There are four special operations available for type Pointer that are not available for other types
>
- A pointer value of any type can be converted to a Pointer.
- A Pointer can be converted to a pointer value of any type.
- A uintptr can be converted to a Pointer.
- A Pointer can be converted to a uintptr.

来看下`unsafe.Pointer`的类型定义：

```go
type ArbitraryType int
type Pointer *ArbitraryType
```
可以看到`unsafe.Pointer`实际上是一个`*int`，一个通用的指针。

`unsafe.Pointer`的四个规则：
- 任何指针都可以转换为`unsafe.Pointer`
- `unsafe.Pointer`可以转换成任何指针
- `uintptr`可以转换成`unsafe.Pointer`
- `unsafe.Pointer`可以转换成`uintptr`

前两个规则在之前的demo中已经演示， 后两个规则请看下面的demo演示：

### Demo 0x03
```go
type dog struct {
        age    int8
        height float32
        weight float32
        color  string
}

func main() {
        p := new(dog) // p := &dog{}

        // set color
        pColor := (*string)(unsafe.Pointer(uintptr(unsafe.Pointer(p)) + unsafe.Offsetof(p.color)))
        *pColor = "yellow"

        // set age
        pAge := (*int8)(unsafe.Pointer(p))
        *pAge = 10

        // set weight
        pWeight := (*float32)(unsafe.Pointer(uintptr(unsafe.Pointer(p)) + unsafe.Offsetof(p.weight)))
        *pWeight = 10.2

        // set height
        pHeight := (*float32)(unsafe.Pointer(uintptr(unsafe.Pointer(p)) + unsafe.Offsetof(p.height)))
        *pHeight = 20.3

        fmt.Println(*p) // {10 20.3 10.2 yellow}
}
```
以上的demo通过内存偏移的方式，定位到需要操作的字段，然后更改它们的值。

刚开始修改的字段是color， color是第四个字段， 所以需要偏移内存，内存偏移牵涉到的计算不能直接使用指针， 必须使用`uintptr`， 因此需要先把dog的指针转换成`uintptr`，然后再通过`unsafe.Offsetof(p.color)`获取到该字段的偏移量，进行地址运算即可。

第二、三个字段的处理与第一个字段相同。

第一个字段age不需要偏移，所以可以直接获取dog的指针，然后通过`unsafe.Pointer`转成`*int8`直接赋值即可。

可以看到在做内存偏移和转换的时候，表达式非常的长。 但是**千万不能把他们分段去写**，不能像下面这样：

```go
temp := uintptr(unsafe.Pointer(p)) + unsafe.Offsetof(p.height)
pHeight := (*float32)(unsafe.Pointer(temp))
```
这是因为这些临时变量可能会被GC回收掉， 被回收掉之后，内存操作就会出错， 我们最终操作的就不知道是哪块内存了。

# 总结
 - `unsafe.Pointer` 用来做指针类型转换
 - `unsafe.Pointer` 是不安全的， 应尽量少使用它， 除非你自己知道为什么使用。
 - `unsafe` 是在编译期间处理的， 而不是在运行时。

## 参(chao)考(xi) :wave::wave::wave:

[Go语言实战笔记](http://www.flysnow.org/2017/07/06/go-in-action-unsafe-pointer.html)

[golang.org](https://golang.org/pkg/unsafe/#Pointer)
