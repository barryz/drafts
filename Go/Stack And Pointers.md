## Language Mechanics On Stacks And Pointers
Blog地址： [Language Mechanics On Stacks And Pointers](https://www.goinggo.net/2017/05/language-mechanics-on-stacks-and-pointers.html)

### Summary:
- Functions execute within the scope of frame boundaries that provide an individual memory space for each respective function.
   函数在为每个相应的函数提供单独的存储空间的**帧边界**范围内执行
- When a function is called, there is a transition that takes place between two frames.
   当一个函数被调用时，两个Frame之间会发生一个交换。
- The benefit of passing data “by value” is readability.
   **值传递** 的优点就是简单明了
- The stack is important because it provides the physical memory space for the frame boundaries that are given to each individual function.
   堆栈很重要，因为它为每个单独的函数提供了帧边界的物理内存空间。
- All stack memory below the active frame is invalid but memory from the active frame and above is valid.
  所有**active frame**以下的内存都是无效的， **active frame**以上的内存都是有效的

- Making a function call means the goroutine needs to frame a new section of memory on the stack.
  发生一个函数调用，即意味着goroutine需要在栈上构建一个新的内存块

- It’s during each function call, when the frame is taken, that the stack memory for that frame is wiped clean.
  在每个函数调用期间， 如果某个帧确定要被使用了， 则该帧上的栈内存会被清理干净

- Pointers serve one purpose, to share a value with a function so the function can read and write to that value even though the value does not exist directly inside its own frame.
  指针的目的在于，与调用函数共享一个值，使得该函数可以读写该值，即使该值不直接存在于其自身的帧内

- For every type that is declared, either by you or the language itself, you get for free a compliment pointer type you can use for sharing.
  对于任何被声明的类型，无论是由您或语言本身，您可以自由地获得一个指针类型，用于共享数据

- The pointer variable allows indirect memory access outside of the function’s frame that is using it.
  指针变量允许间接访问(其正在使用的函数帧外的)内存

- Pointer variables are not special because they are variables like any other variable. They have a memory allocation and they hold a value.
  指针变量和其他变量没有区别， 并不特殊。指针变量也需要内存分配， 也有一个值
