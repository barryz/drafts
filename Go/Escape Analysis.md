## Language Mechanics On Escape Analysis

Bolg 地址： [Language Mechanics On Escape Analysis](https://www.goinggo.net/2017/05/language-mechanics-on-escape-analysis.html)

### Summary

> The construction of a value doesn’t determine where it lives. Only how a value is shared will determine what the compiler will do with that value. Anytime you share a value up the call stack, it is going to escape. There are other reasons for a value to escape which you will explore in the next post.

变量值的构造并不能决定它的内存分配地点。 只有如何**共享**一个值才能确定编译器将如何处理这个值。 只要栈调用时**共享**一个值，那么它就会逃逸。当然， 这并不是逃逸的唯一理由。

> Value semantics keep values on the stack which reduces pressure on the GC. However, there are different copies of any given value that must be stored, tracked and maintained. Pointer semantics place values on the heap which can put pressure on the GC. However, they are efficient because there is only one value that needs to be stored, tracked and maintained. The key is using each semantic correctly, consistently and in balance.

**值**语义在堆栈上创建value，从而降低GC上的压力。 但是又需要存储，跟踪和维护任何给定值的不同副本 （成本很高）。 **指针**语义将值放在堆上，增加了GC的压力。 但是很高效，因为只有一个值需要存储，跟踪和维护。
如何正确是用 **值** 还是 **指针** ， 需要作出各种平衡。
