package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	var wg sync.WaitGroup
	cv := sync.NewCond(&sync.Mutex{})
	done := false

	wg.Add(1)
	go func() {
		defer wg.Done()
		fmt.Println("[producer] doing task....")
		time.Sleep(3 * time.Second)
		fmt.Println("[producer] task done!")
		cv.L.Lock()
		defer cv.L.Unlock()
		done = true    // 更改done信号
		cv.Broadcast() // 通知给所有等待(阻塞)的goroutine
		// cv.Signal() // 通知给一个等待(阻塞)的gouroutine
	}()

	count := 10
	wg.Add(count)
	for i := 0; i < count; i++ {
		go func(i int) {
			defer wg.Done()
			fmt.Printf("[consumer:%d] waiting for task done....\n", i)
			cv.L.Lock()
			defer cv.L.Unlock()
			for !done {
				// 这里有个需要注意的点： 在这里当前goroutine已经拿到锁了， 为什么producer的goroutine还能拿到锁？
				// 原因：进入Wait()函数后， 会有解锁操作， 离开Wait()后会重新加锁
				cv.Wait() // 等待被broadcast goroutine唤醒
				fmt.Printf("[consumer:%d] task done!\n", i)
			}
		}(i)
	}

	wg.Wait()
	fmt.Println("[main] goroutine done!")
}
