// Function

// Build in functions
// see: msdn.microsoft.com/zh-cn/library/c6hac83s(v=vs.94).aspx

// self definition function
// Normal function
let x = 10;

function testX(x) {
    if (x > 10) {
        console.log("x > 10");
        return true;
    }
    else {
        console.log("x <= 10");
        return false;
    }
}

console.log(testX(x));


// arrow function
let xx = (a, b) => {
    return a < b;
}

console.log(xx(10, 20));


// test array fucntion 
let nums = [1, 3, 5, 6, 7]
console.log(nums.map(function (v) { return v + 1; })) //Normal function
console.log(nums.map(v => v + 1)); //Arrow function
console.log(nums.map((v, i) => v + i)); //pass index to params


// Arguments
// default arguments
function add() {
    let sum = 0;
    /*
    arguments: an array-like object holding all of the values passed to the function. 
    */
    for (let i = 0; i < arguments.length; i++) {
        sum += arguments[i]
    }
    return sum;
}
console.log(add(1, 4, 6));

// rest parammeter syntax 
function add1(...args) {
    let sum = 0;
    for (let x of args) {
        sum += x;
    }
    return sum / args.length;
}
console.log(add1(1, 3, 2));