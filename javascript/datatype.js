// Data Type


// String
let x = "helloworld";
let y = 'helloworld1';// you can use either single quote or dobule quote
console.log(x);
console.log(y);


// Number
let nx = 10;
let hexx = 0xee; // hex starts with `0x`
let eg1 = 0378; // is not octal, output is 378
let eg2 = 0377; // is octal, output is 255
console.log(nx, hexx, eg1, eg2);

let fx = 0.101; // float
let sx = 1e-2;
// let fx = 0x0.101; // error
console.log(fx, sx);


// Boolean
// 0, null, undefined will be parsed to false
let bx = (x === y);
console.log(bx) // false
if (bxx = x + y) {
    console.log("got it"); // always true
}

let bxy = "";
if (bxy == x + y) {
    console.log("got it too") // false
}


// null 
let xxxx = null; //null is `null` not number string or other types
console.log(xxxx); // output: null


// undefined
// The undefined value is returned when you use an object property that does not exist, or a variable that has been declared, but has never had a value assigned to it.
let xu;
if (xu == undefined) {
    console.log("x is undefined type"); // will print
}
if (typeof (xu) == "undefined") { // `typeof` can get the type of variable `xu`
    console.log("x is undefined type"); // also print
}










