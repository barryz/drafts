package main

import (
	"bytes"
	"strings"
	"testing"
)

func BenchmarkStringBuilder(b *testing.B) {
	var bi strings.Builder
	b.ResetTimer()
	for i := 1; i < b.N; i++ {
		bi.WriteString("hello")
		bi.WriteString("world")
		bi.WriteString("-Go 1.10")
		_ = bi.String()
	}
	b.StopTimer()
}

func BenchmarkBytesBuffer(b *testing.B) {
	var bi bytes.Buffer
	b.ResetTimer()
	for i := 1; i < b.N; i++ {
		bi.WriteString("hello")
		bi.WriteString("world")
		bi.WriteString("-Go 1.10")
		_ = bi.String()
	}
	b.StopTimer()
}

func BenchmarkStringConcat(b *testing.B) {
	var a string
	b.ResetTimer()
	for i := 1; i < b.N; i++ {
		a += "helloworld-Go 1.10"
		_ = a
	}
	b.StopTimer()
}

func BenchmarkStringCopy(b *testing.B) {
	// need to know the capacity of slice in advance.
	bs := make([]byte, b.N)
	bl := 0

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		bl += copy(bs[bl:], "helloworld-Go 1.10")
		_ = string(bs)
	}
	b.StopTimer()
}

/*
$go test -bench=. -benchmem -v

BenchmarkStringBuilder-4        20000000                64.1 ns/op           101 B/op          0 allocs/op
BenchmarkBytesBuffer-4            200000            142734 ns/op         1804106 B/op          1 allocs/op
BenchmarkStringConcat-4           200000            193209 ns/op         1804059 B/op          1 allocs/op
BenchmarkStringCopy-4            1000000             97343 ns/op         1007616 B/op          1 allocs/op
*/
