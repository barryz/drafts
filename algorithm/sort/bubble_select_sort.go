package main

import "fmt"

func main() {
	var d = []int{1, 6, 4, 9, 0, 44, 98, 91}
	bubbleSort(d)
	fmt.Println(d)
	//selectSort(d)
}

// 冒泡排序，最简单的排序
func bubbleSort(data []int) []int {
	for i := 0; i < len(data)-1; i++ {
		for j := 0; j < len(data)-i-1; j++ {
			if data[j] > data[j+1] {
				data[j], data[j+1] = data[j+1], data[j]
			}
		}
	}
	return data
}

// 选择排序，同样最简单的排序
func selectSort(data []int) []int {
	for i := 0; i < len(data); i++ {
		for j := i + 1; j < len(data); j++ {
			if data[j] < data[i] {
				data[j], data[i] = data[i], data[j]
			}
		}
	}
	return data
}
