package main

import (
	"fmt"
	"math/rand"
)

func main() {
	var d = []int{1, 6, 4, 9, 0}
	quickSort(d)
	fmt.Println(d)
}

func quickSort(a []int) []int {
	sz := len(a)
	if sz < 2 {
		return a
	}

	left, right := 0, sz-1
	pivot := rand.Int() % sz
	a[pivot], a[right] = a[right], a[pivot] // 把基准数移动到队尾

	for i, _ := range a {
		if a[i] < a[right] {
			a[left], a[i] = a[i], a[left] // 交换
			left++
		}
	}
	a[left], a[right] = a[right], a[left]

	quickSort(a[:left])
	quickSort(a[left+1:])

	return a
}
