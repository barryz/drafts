package main

import (
	"fmt"
	"testing"
)

type Tester interface {
	T() string
}

type TesterI struct {
	te string
}

func (t *TesterI) T() string {
	return t.te
}

var (
	ti map[string]Tester
	to map[string]*TesterI
)

func loadTiData() map[string]Tester {
	ti = make(map[string]Tester)
	for i := 0; i < 1000000; i++ {
		t := &TesterI{te: fmt.Sprintf("t-%d", i)}
		ti[t.te] = t
	}
	return ti
}

func loadToData() map[string]*TesterI {
	to = make(map[string]*TesterI)
	for i := 0; i < 1000000; i++ {
		t := &TesterI{te: fmt.Sprintf("t-%d", i)}
		to[t.te] = t
	}
	return to
}

func getTiCnt() int {
	count := 0
	for _, v := range ti {
		switch v.(type) {
		case *TesterI:
			count++
		}
	}
	return count
}

func getTiCnt2() int {
	return len(ti)
}

func getToCnt() int {
	count := 0
	for _ = range to {
		count++
	}
	return count
}

func getToCnt2() int {
	return len(to)
}

func BenchmarkTi(b *testing.B) {
	loadTiData()

	b.ResetTimer()
	b.SetBytes(20)
	for i := 0; i < b.N; i++ {
		getTiCnt()
	}
}

func BenchmarkTi2(b *testing.B) {
	loadTiData()

	b.ResetTimer()
	b.SetBytes(20)
	for i := 0; i < b.N; i++ {
		getTiCnt2()
	}
}

func BenchmarkTo(b *testing.B) {
	loadToData()

	b.ResetTimer()
	b.SetBytes(20)
	for i := 0; i < b.N; i++ {
		getToCnt()
	}
}

func BenchmarkTo2(b *testing.B) {
	loadToData()

	b.ResetTimer()
	b.SetBytes(20)
	for i := 0; i < b.N; i++ {
		getToCnt2()
	}
}

/*
goos: darwin
goarch: amd64
pkg: test
BenchmarkTi-4                100          19688482 ns/op           0.00 MB/s           0 B/op          0 allocs/op
BenchmarkTi2-4          2000000000               0.34 ns/op     58209.11 MB/s          0 B/op          0 allocs/op
BenchmarkTo-4                100          19319888 ns/op           0.00 MB/s           0 B/op          0 allocs/op
BenchmarkTo2-4          2000000000               0.35 ns/op     57598.29 MB/s          0 B/op          0 allocs/op
*/
