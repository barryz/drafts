package main

import (
	"fmt"
	"time"
)

func main() {
	done := make(chan struct{})

	go func() {
		time.Sleep(3 * time.Second)
		fmt.Println("producer task done!")
		close(done) // 所有阻塞的goroutine都能收到done信号， 可以当做cond.Broadcast使用
		// done <- struct{}{} // 只有一个goroutine能收到done信号
	}()

	for i := 0; i < 4; i++ {
		go func(i int) {
			fmt.Printf("[%d] waiting for task done..\n", i)
			<-done
			fmt.Printf("[%d] task already done\n", i)
			return
		}(i)
	}

	<-done
	time.Sleep(time.Second)
	fmt.Println("main goroutine exit...")
}
