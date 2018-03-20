package main

import (
	"fmt"
	"reflect"
)

type User struct {
	Name string
	Age  int
	Sex  string
}

func (u User) FullName() string {
	return u.Name + "base"
}

func main() {
	u := User{"bin.zhang02", 22, "M"}
	// if pass &User{} to info, will panic
	// info(&u)
	info(u)
}

func info(u interface{}) {
	t := reflect.TypeOf(u) // underlying type of interface
	fmt.Printf("type of u was %s\n", t)

	v := reflect.ValueOf(u) // values of all fields with this struct
	fmt.Printf("value of u were %v\n", v)
	fmt.Println(v.Kind()) // kind of values: struct

	for i := 0; i < t.NumField(); i++ { // field number
		f := t.Field(i)
		val := v.Field(i).Interface() // no need to asserttion
		fmt.Printf("field Name: %s field Type: %v, value is %v\n", f.Name, f.Type, val)
	}

	for i := 0; i < t.NumMethod(); i++ { // method number
		m := t.Method(i)
		fmt.Printf("method Name: %s, method Type: %v\n", m.Name, m.Type)
	}
}
