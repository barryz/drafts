> 译自： [Strings in Go](https://go101.org/article/string.html)

# Go字符串

和其他编程语言类似， 字符串在Go语言里也是一个非常重要的类型。 本文将会列举关于Go字符串的相关内容。

## 字符串类型的内部结构

对于标准的Go编译器来说， 字符串类型的内部结构声明如下：

```go
type _string struct {
	elements *byte // 底层字节数组
	len      int   // 长度
}
```

通过如上的声明， 我们知道一个字符串实际上是一个字节序列的封装。

需要知道的是， 在Go里， `byte` 是内建类型 `uin8` 的别名。

## 关于字符串一些简单的事实

  - 字符串值可以被用作常量（以及布尔值和所有类型的数字值）。

  - Go支持两种[字符串的字面量声明](https://go101.org/article/basic-types-and-value-literals.html#string-literals)方式， 双引号形式和反引号形式。

  - 字符串的零值是空字符串， 可以用 **""** 和 **``** 表示。

  - 可以通过 **+** 或者 **+=** 来拼接字符串。

  - 字符串类型都是可比较的（使用`==` 或 `!=` 操作符）。 而且和整型和浮点型类型一样， 两个相同类型的字符串可以使用操作符 `>` `<` `>=` `<=` 进行比较。 比较两个字符串时，事实上是比较这两个字符串的底层字节序列， 逐个字节的比较。 如果一个字符串时另一个字符串的前缀且另一个字符串长度较长，则另一个字符串则被视为较大的字符串。

例子：

```go
package main

import "fmt"

func main() {
	const World = "world"
	var hello = "hello"

	// Concat strings.
	var helloWorld = hello + " " + World
	helloWorld += "!"
	fmt.Println(helloWorld) // hello world!

	// Compare strings.
	fmt.Println(hello == "hello")   // true
	fmt.Println(hello > helloWorld) // false
}
```

更多关于Go中字符串类型和值的细节：

  - 和Java一样， 字符串的内容是不可变的。一旦被创建， 他们的值就不能被修改。 字符串值得长度也是不可变的。 只能通过为其指定另一个字符串的值来覆盖整个字符串的值。

  - 字符串类型没有任何方法（和Go里其他内建的类型一样）， 但是：

    - 标准库 `strings` 包含了很多字符串实用方法。

    - 内建函数 `len` 可以用来获取字符串的长度。

    - 和array、slice、map访问元素方法一样， `aString[i]` 表达式可以用来访问存储在字符串中的某个字符。`aString[i]` 表达式是不可寻址的， 换句话说， `aString[i]` 的值是不可变的。

    - 和array、slice，map的[子切片语法](https://go101.org/article/container.html#subslice)一样，`aString[start:end]` 语法可用来获取字符串的子字符串， 这里的 `start` 和 `end` 是字符串底层字节数的索引。

  - 对于标准的Go编译器来说， 字符串赋值操作中的目标字符串变量和源字符串值在内存中共享同一个底层字节序列。 子字符串表达式 `aString[start:end]` 同样也和原始的 `aString` 贡献同一个底层字节序列。

```go
package main

import (
	"fmt"
	"strings"
)

func main() {
	var helloWorld = "hello world!"

	var hello = helloWorld[:5] // substring
	// 104 is the ascii code (and Unicode) of char 'h'
	fmt.Println(hello[0])         // 104
	fmt.Printf("%T \n", hello[0]) // uint8
	// hello[0] = 'H'             // error: hello[0] is immutable
	// fmt.Println(&hello[0])     // error: hello[0] is not addressable

	fmt.Println(len(hello), len(helloWorld))          // 5 12
	fmt.Println(strings.HasPrefix(helloWorld, hello)) // true
```

## 字符串的编码和符文(rune)

在Go里， 所有的字符串都是采用UTF-8编码。 UTF-8编码字符串中的基本单元被称为代码点。大多数的代码点可以被视为我们日常生活中的字符。但是对于某些字符，都是有好几个代码点组成的。

代码点在Go中使用符文（rune）值表示。内建类型 `rune` 是类型 `int32` 的别名。

在编译期间，字符串字面量里非法的UFT-8符文值会导致编译错误。 在运行期间， Go的运行时不能阻止存储在字符串中的某些字节是UTF-8非法的。换言之， 在运行时， 一个字符串可能是非法的UTF-8编码的。

如上文所提及的， 每个字符串实际上一个字节序列的封装。 所以字符串中的每个符文（rune）将会存储一个或多个字节（最多四个）。 例如， 每个英文代码点会以一个字节存储在Go的字符串里， 中文代码点存储在Go字符串则需要3个字节。

## 字符串相关的类型转换

在之前的文章： [常量和变量](https://go101.org/article/constants-and-variables.html#explicit-conversion)中， 我们了解到整型类型可以显式地转换成字符串类型，（反过来则无法转换）。下面将介绍更多关于字符串转换的相关规则：
