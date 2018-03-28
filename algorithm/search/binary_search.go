package main

import "fmt"

func main() {
	x := []int{1, 3, 6, 7, 9, 11, 13}
	fmt.Println(binarySearch(x, 8))
	fmt.Println(binarySearch(x, 7))
}

func binarySearch(l []int, t int) int {
	start, end := 0, len(l)-1
	for start < end {
		median := start + (end-start)>>1
		if l[median] < t {
			start = median + 1
		} else if l[median] > t {
			end = median - 1
		} else {
			return median
		}
	}
	return -1
}
