package main

import (
	"bufio"
	"encoding/hex"
	"log"
	"net"
)

func main() {
	addr := ":8188"
	log.Printf("listening on addr: %s\n", addr)

	ln, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("listen to %s error, %v\n", addr, err)
	}

	accepted := 1
	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Fatalf("accept error, %v\n", err)
		}
		accepted++

		go handleConn(conn)
		log.Printf("accepted data %d\n", accepted)
	}
}

func handleConn(conn net.Conn) {
	bufr := bufio.NewReader(conn)
	buf := make([]byte, 1024)

	for {
		readBytes, err := bufr.Read(buf)
		if err != nil {
			log.Printf("read data error %v\n", err)
			conn.Close()
			return
		}

		log.Printf("<-> %s", hex.Dump(buf[:readBytes]))
		conn.Write([]byte("The Walking Dead: " + string(buf[:readBytes])))
	}
}
