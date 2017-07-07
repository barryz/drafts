/**
 * Created by barryz on 2017/7/6.
*/

const x1 = parseInt('0x10');
console.log(x1);

let x = 2 * Math.PI * 10;
console.log(x);

console.log(isNaN(9));


console.log('hello'.length);

let xx = 'hello, world'.replace('hello', 'goodbye');
console.log(xx);


console.log('hello'.toUpperCase());

console.log('hello'.charAt([1]));

let a;
let name = 'simon';
console.log(name);

for (let i = 0; i < 5; i++) {
  console.log(i);
};

console.log(i);


const PI = 3.1415;
console.log(PI);

let x = 10;
console.log(x +=5);
console.log(x = x + 5);

let x = 11
console.log(x--);
console.log(x++);


console.log('hello' + ',world');

console.log('3' + 4 + 4);

console.log('123' == 123);
// true

console.log('223' >= 123);

console.log('222' === 222);
// false

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* control structures */
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

/* if statement */

let name = 'bin.zhang02';

if (name === 'bin') {
 console.log('ok');
} else if (name === 'bin.zhang02') {
  console.log('not ok');
} else {
  console.log('ending...');
};


/* while statement */

while (true) {
  console.log('wahahah');
  // infinite loop!
}

while (1) {
  console.log('wahahah');
  // infinite loop!
}

/* do while statement */
let x = 100;
do {
  x--;
  console.log('x=', x);
} while (x !== 0);

/* for statement  js for loop is same as that in C and JAVA */
for (let i = 100; i > 0; i--) {
  console.log('i=', i);
}

const obj = {
  name: 'bin.zhang02',
  age: 22,
  _for: 'fuck your xxxx'
};

for (let p in obj) {
  console.log(p);
}

arr = ['dog', 'cat', 'hen'];
for (let i of arr) {
  console.log('animal is: ', i);
}

/* logic operators */
let x = 1;
let age = x || '12';
console.log(age);

let xx = (x > 10) ? 'yes' : 'no';
console.log(xx);


/* switch statement */
let x = 'liuliuliu';

switch (x) {
  case 'lll':
    console.log('lll');
    break;
  case 'liuliuliu':
    console.log('matched in liuliuliu');
    // no break means fallthrough
  default:
    console.log('default value');
}

// Expressions in switch and case statement
let xx = 111;
switch (xx === 111) {
  case xx === 111:
    console.log('waha, it is in here.');
    break;
  default:
    console.log('default value');
}


/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* js object */
//  Dictionaries in Python.
//  Hashes in Perl and Ruby.
//  Hash tables in C and C++.
//  HashMaps in Java.
//  Associative arrays in PHP.
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

/* declare object */
const obj = new Object();
const objx = {};
console.log(obj, objx);

/* 字面量声明object */
const obj = {
  name: 'bin.zhang02',
  age: 22,
  _for: 'fuck your xxxx'
};
console.log(obj);
console.log(obj.name, obj.age, obj._for);
console.log(obj['name'], obj['age']);


function Person(name, age) {
  this.name = name;
  this.age = age;
}

const obj = new Person('bin.zhang02', 22);
console.log(obj.age, obj.name, obj);
obj.name = 'barryz';
console.log(obj.age, obj.name);


/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* Arrays */
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

let arr = new Array();
console.log(arr.length);
console.log(arr[2]);

for (let i = 0; i < 10; i++) {
  arr[i] = i + 1;
}
console.log(arr.length);
console.log(arr);

arr = ['dog', 'cat', 'hen'];
// for...in not recommended
for (let i of arr) {
  console.log('animal is: ', i);
}

for (let i = 0; i < arr.length; i++) {
  console.log('another animal is: ', arr[i]);
}


arr[101] = 'what';
console.log(arr.length); // 102
arr.push('haha');
console.log(arr.length); // 103

// In ES5  use ForEach
arr.forEach(function (cv, i) {
  console.log('foreach iter: animail is: ' + cv + ' and idx is: ', i);
});

console.log(typeof arr[999]); // undefined
console.log(typeof 999);

console.log(arr.slice(0, 100));

/* !!! Remember — the length of the array is one more than the highest index. !!! */


/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* functions */
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

function add(x, y) {
  let total = x + y;
  return total;
}

console.log(add(1, 2));
console.log(add(1, 2, 3));
console.log(add());

function add1() {
  let sum = 0;
  // arguments is a object, not a array
  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }

  return sum;
}

console.log(add1(1, 2, 3));

function avg() {
  let sum = 0;
  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }

  return sum / arguments.length;
}

console.log(avg(1, 3, 5, 7, 9, 8.8));


function avg1(...args) {
  let sum = 0;
  // args is a array, not a object
  for (let i of args) {
    sum += i;
  }
  return sum / args.length;
}
console.log(avg1(1, 3, 5, 7, 9, 8.8));
// pass a array to avg function use .apply method
console.log(avg1.apply(null, [1, 3, 5, 7, 8.8]));


// 匿名函数
let avg = function (...args) {
  let sum = 0;
  for (let i of args) {
    sum += i;
  }
  return sum / args.length;
};

console.log(avg.apply(null, [1, 2, 3, 4]));


let a = 1;
let b = 1;
(function () {
  let b = 3;
  a += b;
})();
console.log(a);
console.log(b);

function fin(x) {
  if (x === 1 || x === 2) {
    return x;
  }

  return fin(x - 1) + fin(x - 2);
}

console.log(fin(10));

IIFEs (immediately invoked function expressions)
console.log(function fin(x) {
  return (x === 1 || x === 2) ? x : fin(x - 1) + fin(x - 2);
}(5));


/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* object oriented programming */
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

 function makePersion(first, last) {
 return {
 first: first,
 last: last
 };
 }

 function personFullName(person) {
 return person.first + ''  + person.last;

 }

 function personFullNameReversed(person) {
 return person.last + ''  + person.first;
 }

 let s = makePersion("bin", "zhang02");
 console.log(s);
 console.log(personFullName(s));
 console.log(personFullNameReversed(s));

 /*
 function makePerson(first, last) {
 return {
 first: first,
 last: last,
 fullName: function () {
 return this.first + ' ' + this.last;
 },
 fullNameReserved: function () {
 return this.last + ' ' + this.first;
 }
 };
 }

 let s = makePerson('barryz', 'zhang');
 console.log(s);
 console.log(s.fullName());
 console.log(s.fullNameReserved());
 */

/*
 function Person(first, last) {
 this.first = first;
 this.last = last;
 this.fullName = function () {
 return this.first + ' ' + this.last;
 };
 this.fullNameReversed = function () {
 return this.last + ' ' + this.first;
 };
 }

 let s = new Person('barryz', 'zhang');
 console.log(s);
 console.log(s.fullNameReversed());
 s.first = 'barryzzzz';
 console.log(s.fullNameReversed());
 */

/*
 function personFullName() {
 return this.first + ' ' + this.last;
 }


 function personFullNameReversed() {
 return this.last + ' ' + this.first;
 }

 function Person(first, last) {
 this.first = first;
 this.last = last;
 this.fullName = personFullName;
 this.fullNameReversed = personFullNameReversed;
 }

 let s = new Person('Simon', 'barryz');
 console.log(s.fullName());
 */

/* prototype  add extra methods to existing objects at runtime. */
/*
 function Person(first, last) {
 this.first = first;
 this.last = last;
 }

 Person.prototype.fullName = function () {
 return this.first + ' ' + this.last;
 };

 Person.prototype.fullNameReversed = function () {
 return this.last + ' ' + this.first;
 };

 Person.prototype.firstNameCaps  = function () {
 return this.first.toUpperCase();
 };

 Person.prototype.allNameCaps = function () {
 return this.first.toUpperCase() + ' ' + this.last.toUpperCase();
 };

 let s = new Person('Simon', 'Smith');
 console.log(s.fullNameReversed());
 console.log(s.firstNameCaps());
 console.log(s.allNameCaps());
 */

/* 修改内置object 对象原型 */

/*
 let s = "Simon";

 String.prototype.reversed = function reversed() {
 let r = '';
 for (let i = this.length - 1; i >= 0; i--) {
 r += this[i];
 }
 return r;
 };


 console.log('Our new method even works on string literals'.reversed());

 console.log(s.reversed());
 */

/*
function Person(first, last) {
  this.first = first;
  this.last = last;
}

Person.prototype.fullName = function () {
  return this.last + ' ' + this.first;
};

Person.prototype.toString = function () {
  return '<Person: ' + this.fullName() + '>';
};


let s = new Person('斌', '张');
console.log(s.toString());
*/

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* Closures */
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

function makeAdder(a) {
  return function (b) {
    return a+b;
  };
}

let x = makeAdder(5);
let y = x(6);
let z = x(7);

console.log(y);
console.log(z);
