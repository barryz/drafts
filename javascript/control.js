// Control


// Selection structure
// single selection: if
let x = 10;
if (x >= 10) {
    console.log("x >= 10");
}

// double selection: if ... else
let y = "javascript";
if (y.toString().includes("java")) {
    console.log("y includes word: java");
}
else {
    console.log("y not includes word: java");
}

// inline ternary operator: ?:
console.log(x = (true || false) ? "x is human" : "x not human");

// multiple selection: switch
let xy = "helloworld";
switch (true) {
    case xy.toString().includes("hello"):
        console.log("contains hello");
        break
    case xy.toString().includes("hello"):
        console.log("contains world");
        break
    default:
        console.log("has nothing");
}


// Repetition structure
// while loop
let xx = 10000;
while (xx > 1) {
    xx-- , --xx;
    if (xx === 666) {
        console.log("catch you, 666");
        break
    }
}

// do ... while loop
let xxx = 1;
do {
    xxx++;
    if (xxx === 666) {
        console.log("xxx is " + xxx + ", i catch you.");
        break
    }
} while (xxx < 9999);

// for ... in loop , used for iter an object
let myObject = new Object();
myObject.age = 10;
myObject.sex = "F";
myObject.name = "barryz";
for (let x in myObject) {
    console.log("myobject: " + x + ": " + myObject[x]);
}

// for ... of  loop, used for iter an array
myArray = ['cat', 'dog', 'ear', 'eye'];
for (let i of myArray) {
    console.log("array element: " + i);
}
