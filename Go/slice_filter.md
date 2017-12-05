# Slice 过滤元素

github上有篇文章写了一个 [golang slice tricks](https://github.com/golang/go/wiki/SliceTricks)
里面有个关于过滤元素的trick:

> This trick uses the fact that a slice shares the same backing array and capacity as the original, so the storage is reused for the filtered slice. Of course, the original contents are modified.

```go
b := a[:0]
for _, x := range a {
    if f(x) {
        b = append(b, x)
    }
}
```

---

工作中经常使用的是以下这种方式：

```go
for i := 0; i < len(a); i++ {
        if f(a[i]) {
           a = append(a[:i], a[i+1:]...)
            i--
        }
}
```

这两种方式哪种更好？ 下面做个性能测试：
测试代码：

```go
package main

import (
        "testing"
)

const (
        judge = 10
)

func generateNewSlice() []int {
        max := 300
        intNum := make([]int, max, max)
        for i := 0; i < max; i++ {
                intNum[i] = i
        }
        return intNum
}

func filterOriginal() {
        intNum := generateNewSlice()
        for i := 0; i < len(intNum); i++ {
                if intNum[i] > judge {
                        intNum = append(intNum[:i], intNum[i+1:]...)
                        i--
                }
        }

        _ = intNum
}

func filterZeroAllocate() {
        intNum := generateNewSlice()
        newIntNum := intNum[:0]
        for _, i := range intNum {
                if i > judge {
                        continue
                }
                newIntNum = append(newIntNum, i)
        }

        _ = newIntNum
}
func filterZeroAllocateAlter() {
        intNum := generateNewSlice()
        newIntNum := make([]int, 0, len(intNum))
        for _, i := range intNum {
                if i > judge {
                        continue
                }
                newIntNum = append(newIntNum, i)
        }

        _ = newIntNum
}

func BenchmarkOriginal(b *testing.B) {
        b.ResetTimer()
        b.SetBytes(20)
        for i := 0; i < b.N; i++ {
                filterOriginal()
        }
}

func BenchmarkZeroAllocate(b *testing.B) {
        b.ResetTimer()
        b.SetBytes(20)
        b.SetBytes(20)
        for i := 0; i < b.N; i++ {
                filterZeroAllocate()
        }
}

func BenchmarkZeroAllocateAlter(b *testing.B) {
        b.ResetTimer()
        b.SetBytes(20)
        for i := 0; i < b.N; i++ {
                filterZeroAllocateAlter()
        }
}
```
测试命令：
```bash
go test -bench=. -benchmem -v
```
测试结果：
```bash
BenchmarkOriginal-4              200000              6755 ns/op          2.96 MB/s        2688 B/op          1 allocs/op
BenchmarkZeroAllocate-4          2000000              627 ns/op          31.89 MB/s        2688 B/op          1 allocs/op
BenchmarkZeroAllocateAlter-4    2000000              985 ns/op          20.29 MB/s        5376 B/op          2 allocs/op
```
col 1 表示： 测试函数
col 2 表示： 迭代次数
col 3 表示： 每次迭代耗时 (nanosecond)
col 4 表示： 字节传输速度
col 5 表示： 每次操作消耗字节数
col 6 表示： 每次操作的内存分配次数

结果显示是ZeroAllocate更加合适。
