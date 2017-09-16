// Operators


// Computational Operators

let x = 10, y = 3;
console.log(x + y);
console.log(x - y);
console.log(x * y);
console.log(x / y);
console.log(x % y);

// 如果运算符在变量的前面出现，则在计算表达式之前修改该值。
let j = 10, k = 3;
console.log(j++, k++) // output: 10 3 
console.log(j, k) // output: 11 4

// 如果运算符在变量的后面出现，则在计算表达式之后修改该值。
j = 10, k = 3;
console.log(++j, ++k) // output: 11 4 
console.log(j, k) // output: 11 4


// Logical Operators
let lp = false;
if (!lp) {
    console.log("not true");
}
if (10 <= 20) {
    console.log("10 <= 20");
}
if (10 >= 20) {
    console.log("10 >= 20");
}
if (10 != 20) { // not equal
    console.log("10 != 20");
}

// && ||
if ((10 <= 20) && 1 || false) {
    console.log("balabalba..."); // output expected
}

// 三目运算符
let xx = (10 <= 20) ? "big" : "small";
console.log(xx); // output: big

// 逗号 `,`  表示顺序执行 表达式
let c = 20, d = 30;
c++ , ++d
console.log(c, d) // output: 21 31

// 恒等运算符 严格模式
//行为与相等运算符的行为相同，只不过不会执行类型转换。  如果两个表达式的类型不相同，则这些表达式始终返回 false:w
let eq = 10;
let eqx = "10";
if (eq == eqx) { // true, type convert
    console.log("eq == eqx");
}
if (eq === eqx) { // false, not type convert
    console.log("eq === eqx");
}


// Bitwise operators
console.log(~5) // output: -6
/*
5:  00000000 00000000 00000000 00000101
~5: 11111111 11111111 11111111 11111010
*/

console.log(2<<1) // output: 4
console.log(2>>1) // output: 1
console.log(2>>>1) // output: 1  unsigned right shift
console.log(1&0)
console.log(1|0)
console.log(1^0)


// Assignment Operators
let xxxx = (10 < 20); // true
console.log(xxxx)
let xxx = 10
console.log(xxx+=0x11);
console.log(xxx-=2);
console.log(xxx%=1);
console.log(xxx/=1);


// Other operators
// ...
