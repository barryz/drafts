// Array

// define a array in two ways
let arr = [];
let arr1 = new Array();

// assinement with index
arr[0] = 'hello';
arr[1] = 'world';
console.log(arr.length, arr);
arr[10] = 'haha';
// IMPORTANT: the length of the array is one more than the highest index.
console.log(arr.length, arr);

// use `for` statement to iterate array
for (let x = 0; x < arr.length; x++) {
    console.log(arr[x]); //  query a non-existent array index, will get a value of undefined returned
}

// use `forEach` statement to iterate array (in ECMAScript)
arr.forEach((v, i) => {
    console.log(v, i);
})

// arrary methods
console.log(arr.toString()); // Returns a string with the toString() of each element separated by commas.

console.log(arr.toLocaleString()); // Returns a string with the toLocaleString() of each element separated by commas.

let arr2 = arr.concat("hhaha")
console.log(arr, arr2); // Returns a new array with the items added on to it.

console.log(arr.join("|")); // Converts the array to a string — with values delimited by the sep param

console.log(arr2.pop()); // Removes and returns the last item.

console.log(arr.push('hahhaha')); // Appends items to the end of the array.

console.log(arr.reverse());  // Reverses the array. not generate a copy.

console.log(arr2.shift()); // Removes and returns the first item.

console.log(arr2.slice(1, 3)); // Returns a sub-array. 

let arr3 = [2, 4, 7, 8, 9, 11, 1]
console.log(arr3.sort((a, b) => { if (a < b) { return -1 }; return 1 })); // Takes an optional comparison function.

console.log(arr3.splice(0, 3)); // Lets you modify an array by deleting a section and replacing it with more items.
console.log(arr3) // output: 7, 8, 9, 11

arr3.unshift(19); // Prepends items to the start of the array.
console.log(arr3)