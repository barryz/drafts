// Object

// define a object in two ways
let obj = new Object();
let obj1 = {};


// Initialize an object use literal syntax
let obj2 = {
    name: "barryz",
    age: 22,
    sex: "F",
    others: {
        onDuty: "today",
        holiday: false
    }
}
console.log(obj2);

// Attribute access can be chained together
console.log(obj2.others.holiday);
console.log(obj2['others']['onDuty']);

// Create a object person
function Person(name, age) {
    this.name = name;
    this.age = age;
}

let Ix = new Person("Barryz", 22); // use `new` key word
Ix.name = "liuliuliu"; // modify Ix attribute name
console.log(Ix)