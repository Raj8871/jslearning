
'use client'

// src/app/(main)/learn/[topic]/page.tsx
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Play, Loader2, BookOpen } from 'lucide-react';
import React, { useEffect, useState } from 'react'; // Ensure React is imported
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { explainCode } from '@/ai/flows/explain-code'; // Use existing explain flow
import { useToast } from '@/hooks/use-toast';

// Mock data for topics - In a real app, this would come from a database or CMS
const topicData: Record<string, { title: string; description: string; initialCode: string; aiPromptContent: string }> = {
  variables: {
    title: 'Variables & Data Types',
    description: "Learn how to declare variables using var, let, and const, and understand JavaScript's fundamental data types.",
    initialCode: `// Declare variables using var, let, and const
var legacyVar = "I'm old school";
let modernLet = 10;
const constantValue = true;

console.log(legacyVar);
console.log(modernLet);
console.log(constantValue);

// Try reassigning them!
// modernLet = 20; // This is okay
// constantValue = false; // This will cause an error!

// Data Types
let aString = "Hello";
let aNumber = 42;
let aBoolean = false;
let aNull = null;
let anUndefined;
let aSymbol = Symbol('unique');
let aBigInt = 9007199254740991n;
let anObject = { key: "value" };
let anArray = [1, 2, 3];

console.log(typeof aString);
console.log(typeof aNumber);
console.log(typeof aBoolean);
console.log(typeof aNull); // Note: typeof null is 'object' (a known quirk)
console.log(typeof anUndefined);
console.log(typeof aSymbol);
console.log(typeof aBigInt);
console.log(typeof anObject);
console.log(typeof anArray); // Note: typeof array is 'object'`,
    aiPromptContent: `
### Variables
Variables are containers for storing data values. In JavaScript, you can declare variables using \`var\`, \`let\`, or \`const\`.

-   **\`var\`**: Used in older JavaScript versions. Variables declared with \`var\` have function scope or global scope, and they can be re-declared and updated. It's generally recommended to avoid \`var\` in modern JavaScript.
-   **\`let\`**: Introduced in ES6 (ECMAScript 2015). Variables declared with \`let\` have block scope (scope limited to the \`{\`...\`}\` block they are defined in). They can be updated but not re-declared within the same scope.
-   **\`const\`**: Also introduced in ES6. Variables declared with \`const\` also have block scope. They must be initialized with a value when declared, and they cannot be reassigned or re-declared. However, if the constant is an object or array, its properties or elements can be modified.

### Data Types
JavaScript has several primitive data types:
-   **String**: Represents textual data (e.g., \`"hello"\`).
-   **Number**: Represents numeric data, including integers and floating-point numbers (e.g., \`42\`, \`3.14\`). JavaScript has a special numeric value \`NaN\` (Not-a-Number).
-   **Boolean**: Represents logical values: \`true\` or \`false\`.
-   **Null**: Represents the intentional absence of any object value. It's a primitive value, but \`typeof null\` surprisingly returns \`"object"\`.
-   **Undefined**: Represents a variable that has been declared but not assigned a value.
-   **Symbol**: (ES6) Represents a unique and immutable identifier.
-   **BigInt**: (ES2020) Represents integers with arbitrary precision, larger than the maximum safe integer for Numbers.

JavaScript also has a complex data type:
-   **Object**: Represents collections of key-value pairs (properties) or more complex entities. Arrays, Functions, Dates, etc., are all types of objects in JavaScript.

Try running the code in the editor to see variable declaration and \`typeof\` outputs! Modify the code to experiment.
`,
  },
  functions: {
    title: 'Functions',
    description: 'Understand function declarations, expressions, arrow functions, parameters, and return values.',
    initialCode: `// Function Declaration
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Alice")); // Output: Hello, Alice!

// Function Expression
const add = function(a, b) {
  return a + b;
};
console.log(add(5, 3)); // Output: 8

// Arrow Function (ES6)
const multiply = (a, b) => {
  return a * b;
};
console.log(multiply(4, 5)); // Output: 20

// Arrow Function (concise body)
const subtract = (a, b) => a - b;
console.log(subtract(10, 4)); // Output: 6

// Function with default parameters (ES6)
function welcome(name = "Guest") {
  console.log("Welcome, " + name + "!");
}
welcome(); // Output: Welcome, Guest!
welcome("Bob"); // Output: Welcome, Bob!

// Function returning another function (Higher-Order Function)
function createGreeter(greeting) {
  return function(name) {
    console.log(greeting + ", " + name + "!");
  };
}
const sayHi = createGreeter("Hi");
sayHi("Charlie"); // Output: Hi, Charlie!
`,
    aiPromptContent: `
### Functions
Functions are blocks of reusable code that perform a specific task. They are fundamental building blocks in JavaScript.

**Ways to Define Functions:**

1.  **Function Declaration:**
    \`\`\`javascript
    function functionName(parameters) {
      // code to be executed
      return value; // optional return statement
    }
    \`\`\`
    Declarations are "hoisted," meaning they can be called before they are defined in the code.

2.  **Function Expression:**
    \`\`\`javascript
    const variableName = function(parameters) {
      // code to be executed
      return value;
    };
    \`\`\`
    Expressions are not hoisted. The function can only be called after the variable assignment.

3.  **Arrow Functions (ES6):**
    Provide a more concise syntax, especially for simple functions.
    \`\`\`javascript
    const variableName = (parameters) => {
      // code to be executed
      return value;
    };

    // Concise body for single expression return
    const add = (a, b) => a + b;
    \`\`\`
    Arrow functions have lexical \`this\` binding, meaning \`this\` refers to the context where the function was *defined*, not where it's *called*.

**Key Concepts:**

-   **Parameters:** Variables listed inside the parentheses \`()\` in the function definition.
-   **Arguments:** The actual values passed to the function when it is called.
-   **Return Value:** Functions can optionally return a value using the \`return\` keyword. If omitted, the function returns \`undefined\`.
-   **Scope:** Functions create their own scope. Variables declared inside a function are typically not accessible from outside.
-   **Default Parameters (ES6):** Allow you to specify default values for parameters if no argument is provided.

Experiment with the different function types in the editor!
`,
  },
  loops: {
      title: 'Loops & Iteration',
      description: 'Master control flow with for, while, and do...while loops, plus modern iteration methods.',
      initialCode: `// for loop
console.log("--- For Loop ---");
for (let i = 0; i < 5; i++) {
  console.log("Iteration number:", i);
}

// while loop
console.log("\\n--- While Loop ---");
let count = 0;
while (count < 3) {
  console.log("Count is:", count);
  count++;
}

// do...while loop
console.log("\\n--- Do...While Loop ---");
let j = 0;
do {
  console.log("j is:", j); // This runs at least once
  j++;
} while (j < 0); // Condition is false, but loop ran once

// for...in loop (for object properties)
console.log("\\n--- For...in Loop (Object) ---");
const person = { name: "Alice", age: 30, city: "New York" };
for (const key in person) {
  console.log(key + ": " + person[key]);
}

// for...of loop (for iterable objects like arrays, strings)
console.log("\\n--- For...of Loop (Array) ---");
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log("Color:", color);
}

console.log("\\n--- For...of Loop (String) ---");
const message = "Hello";
for (const char of message) {
  console.log("Character:", char);
}

// Array.forEach method
console.log("\\n--- Array.forEach ---");
const numbers = [1, 2, 3];
numbers.forEach(function(number, index) {
  console.log("Index " + index + ": " + number);
});
`,
      aiPromptContent: `
### Loops & Iteration
Loops are used to execute a block of code repeatedly based on a condition.

**Common Loop Types:**

1.  **\`for\` loop:**
    Best when you know the number of iterations beforehand.
    \`\`\`javascript
    for (initialization; condition; final-expression) {
      // code to execute
    }
    \`\`\`
    -   \`initialization\`: Executed once before the loop starts (e.g., \`let i = 0\`).
    -   \`condition\`: Evaluated before each iteration. If \`true\`, the loop continues; if \`false\`, it stops.
    -   \`final-expression\`: Executed at the end of each iteration (e.g., \`i++\`).

2.  **\`while\` loop:**
    Executes code as long as a specified condition is true. The condition is checked *before* each iteration.
    \`\`\`javascript
    while (condition) {
      // code to execute
      // IMPORTANT: Make sure the condition eventually becomes false!
    }
    \`\`\`

3.  **\`do...while\` loop:**
    Similar to \`while\`, but the code block is executed *at least once* before the condition is checked.
    \`\`\`javascript
    do {
      // code to execute
    } while (condition);
    \`\`\`

**Iteration Protocols & Loops (ES6+):**

4.  **\`for...in\` loop:**
    Iterates over the *enumerable property keys* of an object. Order is not guaranteed. Generally not recommended for arrays.
    \`\`\`javascript
    for (const key in object) {
      // access property using object[key]
    }
    \`\`\`

5.  **\`for...of\` loop:**
    Iterates over the *values* of iterable objects (like Arrays, Strings, Maps, Sets, etc.). This is the preferred way to loop over array elements in modern JavaScript.
    \`\`\`javascript
    for (const value of iterable) {
      // use value directly
    }
    \`\`\`

**Array Iteration Methods:**

JavaScript arrays have built-in methods for iteration, often preferred over traditional loops for clarity:
-   \`forEach(callbackFn)\`: Executes a provided function once for each array element.
-   \`map(callbackFn)\`: Creates a new array populated with the results of calling a provided function on every element.
-   \`filter(callbackFn)\`: Creates a new array with all elements that pass the test implemented by the provided function.
-   \`reduce(callbackFn, initialValue)\`: Executes a reducer function on each element, resulting in a single output value.
-   *...and many more (\`find\`, \`some\`, \`every\`, etc.)*

Run the code examples to see each loop type in action!
`,
  },
  objects: {
      title: 'Objects',
      description: 'Explore object literals, properties, methods, prototypes, and object manipulation.',
      initialCode: `// Object Literal
const car = {
  make: "Toyota",
  model: "Camry",
  year: 2022,
  isRunning: false,

  // Method (a function property)
  start: function() {
    this.isRunning = true;
    console.log(this.model + " started.");
  },

  // ES6 Method Syntax
  stop() {
    this.isRunning = false;
    console.log(this.model + " stopped.");
  },

  // Property with space (requires quotes)
  "fuel type": "Gasoline"
};

// Accessing Properties
console.log("Make:", car.make); // Dot notation
console.log("Model:", car["model"]); // Bracket notation (useful for dynamic keys or keys with spaces)
console.log("Fuel:", car["fuel type"]);

// Calling Methods
car.start(); // Output: Camry started.
console.log("Is running:", car.isRunning); // Output: true
car.stop(); // Output: Camry stopped.
console.log("Is running:", car.isRunning); // Output: false

// Adding a new property
car.color = "Blue";
console.log("Color:", car.color);

// Deleting a property
delete car.year;
console.log("Year exists:", car.hasOwnProperty("year")); // Output: false

// Checking for property existence
console.log("Make exists:", "make" in car); // Output: true

// Object.keys, Object.values, Object.entries (ES8)
console.log("\\n--- Object Methods ---");
console.log("Keys:", Object.keys(car));
console.log("Values:", Object.values(car));
console.log("Entries:", Object.entries(car));

// Basic Prototypal Inheritance Example
const vehicle = {
  hasEngine: true
};

// Set vehicle as the prototype of electricCar
const electricCar = Object.create(vehicle);
electricCar.make = "Tesla";
electricCar.hasBattery = true;

console.log("\\n--- Prototypal Inheritance ---");
console.log("Electric car make:", electricCar.make); // Own property
console.log("Electric car has engine?", electricCar.hasEngine); // Inherited property
`,
      aiPromptContent: `
### Objects
Objects are fundamental data structures in JavaScript used to store collections of data and more complex entities. They consist of key-value pairs called properties.

**Creating Objects:**

1.  **Object Literal:** The most common way.
    \`\`\`javascript
    const myObject = {
      key1: "value1",
      key2: 123,
      "property with space": true, // Keys with spaces need quotes
      methodName: function() { /* ... */ }, // Method
      es6Method() { /* ... */ } // ES6 shorthand method syntax
    };
    \`\`\`

2.  **\`new Object()\`:** Less common.
    \`\`\`javascript
    const myObject = new Object();
    myObject.key1 = "value1";
    \`\`\`

3.  **\`Object.create(prototype)\`:** Creates a new object with a specified prototype object. Used for implementing inheritance.

**Accessing Properties:**

-   **Dot Notation:** \`objectName.propertyName\`
    -   Easy to read and write.
    -   Cannot be used if the property key is not a valid identifier (e.g., contains spaces or starts with a number) or if the key is stored in a variable.
-   **Bracket Notation:** \`objectName["propertyName"]\`
    -   Required for keys that are not valid identifiers.
    -   Required when the property key is dynamic (stored in a variable). \`let key = "name"; console.log(person[key]);\`

**Methods:**
Properties whose values are functions are called methods. Methods operate on the data contained within the object. The \`this\` keyword inside a method typically refers to the object the method was called on.

**Object Manipulation:**

-   **Adding/Updating Properties:** \`object.newKey = value;\` or \`object["newKey"] = value;\`
-   **Deleting Properties:** \`delete object.propertyName;\`
-   **Checking Property Existence:** Use the \`in\` operator (\`"key" in object\`) or \`object.hasOwnProperty("key")\`. \`hasOwnProperty\` only checks the object's own properties, not inherited ones.

**Built-in Object Methods (Static Methods):**
-   \`Object.keys(obj)\`: Returns an array of an object's own enumerable property names (keys).
-   \`Object.values(obj)\`: Returns an array of an object's own enumerable property values.
-   \`Object.entries(obj)\`: Returns an array of an object's own enumerable [key, value] pairs.
-   \`Object.assign(target, ...sources)\`: Copies enumerable own properties from source objects to a target object.
-   \`Object.freeze(obj)\`: Prevents modification of existing properties and addition/deletion of properties.

**Prototypal Inheritance:**
JavaScript uses prototypal inheritance. Every object has an internal link to another object called its *prototype*. When trying to access a property, if the object itself doesn't have it, JavaScript looks up the prototype chain until it finds the property or reaches the end (\`null\`).

Experiment with creating, accessing, and modifying object properties in the editor.
`,
  },
  arrays: {
      title: 'Arrays',
      description: 'Learn to create, manipulate, and iterate over arrays using various methods.',
      initialCode: `// Creating Arrays
const emptyArray = [];
const fruits = ["Apple", "Banana", "Cherry"];
const mixedArray = [1, "two", true, null, { id: 3 }];
const numbers = new Array(1, 2, 3, 4, 5); // Less common

console.log("Fruits:", fruits);
console.log("Third fruit:", fruits[2]); // Accessing elements (0-based index)
console.log("Array length:", fruits.length); // Getting length

// Modifying Elements
fruits[1] = "Blueberry";
console.log("Modified fruits:", fruits);

// Adding/Removing Elements
fruits.push("Date"); // Add to end
console.log("After push:", fruits);
const lastFruit = fruits.pop(); // Remove from end
console.log("Removed last:", lastFruit, "| Array now:", fruits);

fruits.unshift("Apricot"); // Add to beginning
console.log("After unshift:", fruits);
const firstFruit = fruits.shift(); // Remove from beginning
console.log("Removed first:", firstFruit, "| Array now:", fruits);

// Finding Elements
const cherryIndex = fruits.indexOf("Cherry");
console.log("Index of Cherry:", cherryIndex); // Output: 1
console.log("Index of Grape:", fruits.indexOf("Grape")); // Output: -1 (not found)
console.log("Includes Blueberry?", fruits.includes("Blueberry")); // Output: true (ES7)

// Iterating with forEach
console.log("\\n--- forEach ---");
fruits.forEach((fruit, index) => {
  console.log(\`Index \${index}: \${fruit}\`);
});

// Creating new arrays with map
console.log("\\n--- map ---");
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log("Uppercase fruits:", upperFruits);

// Filtering arrays
console.log("\\n--- filter ---");
const shortFruits = fruits.filter(fruit => fruit.length < 6);
console.log("Short fruits:", shortFruits);

// Combining elements with reduce
console.log("\\n--- reduce ---");
const numberList = [1, 2, 3, 4];
const sum = numberList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log("Sum:", sum); // Output: 10

// Slicing and Splicing
console.log("\\n--- slice & splice ---");
const middleFruits = fruits.slice(1, 3); // Extracts elements from index 1 up to (but not including) 3
console.log("Sliced (non-destructive):", middleFruits, "| Original:", fruits);

// Splice: Remove 1 element at index 1, and insert "Kiwi"
const removed = fruits.splice(1, 1, "Kiwi");
console.log("Spliced (destructive): Removed:", removed, "| Array now:", fruits);

// Joining and Splitting
console.log("\\n--- join & split ---");
const fruitString = fruits.join(", "); // Join array elements into a string
console.log("Joined string:", fruitString);

const csv = "apple,banana,cherry";
const fruitArrayFromString = csv.split(","); // Split string into an array
console.log("Split array:", fruitArrayFromString);
`,
      aiPromptContent: `
### Arrays
Arrays are ordered lists of values in JavaScript. They can hold values of any data type, including other arrays or objects.

**Creating Arrays:**

1.  **Array Literal:** The most common and preferred way.
    \`\`\`javascript
    const myArray = [value1, value2, value3];
    const emptyArray = [];
    \`\`\`

2.  **\`new Array()\`:**
    \`\`\`javascript
    const myArray = new Array(element1, element2);
    const sizedArray = new Array(5); // Creates an array with 5 empty slots
    \`\`\`

**Accessing & Modifying Elements:**
-   Elements are accessed using zero-based numerical indices in square brackets: \`myArray[0]\`, \`myArray[1]\`, etc.
-   The length of an array can be found using the \`length\` property: \`myArray.length\`.
-   Elements can be modified by assigning a new value to a specific index: \`myArray[1] = newValue;\`.

**Common Array Methods:**

**Mutating Methods (Modify the original array):**
-   \`push(element1, ...)\`: Adds one or more elements to the end. Returns the new length.
-   \`pop()\`: Removes the last element. Returns the removed element.
-   \`shift()\`: Removes the first element. Returns the removed element.
-   \`unshift(element1, ...)\`: Adds one or more elements to the beginning. Returns the new length.
-   \`splice(start, deleteCount, item1, ...)\`: Changes the contents by removing or replacing existing elements and/or adding new elements *in place*. Returns an array containing the deleted elements.
-   \`sort(compareFunction)\`: Sorts the elements *in place*. Default sort is based on string conversion. Provide a compare function for numbers or custom sorting.
-   \`reverse()\`: Reverses the order of elements *in place*.

**Non-Mutating Methods (Return a new array or value):**
-   \`slice(start, end)\`: Returns a shallow copy of a portion of an array into a new array. \`end\` index is not included.
-   \`concat(array2, ...)\`: Merges two or more arrays. Returns a new array.
-   \`join(separator)\`: Joins all elements into a string, separated by the specified separator (default is comma).
-   \`indexOf(searchElement, fromIndex)\`: Returns the first index at which a given element can be found, or -1 if not present.
-   \`includes(valueToFind, fromIndex)\`: (ES7) Checks if an array includes a certain value. Returns \`true\` or \`false\`.
-   \`map(callbackFn)\`: Creates a new array with the results of calling a provided function on every element.
-   \`filter(callbackFn)\`: Creates a new array with all elements that pass the test implemented by the provided function.
-   \`reduce(callbackFn, initialValue)\`: Executes a reducer function on each element, resulting in a single output value (e.g., sum, accumulated object).
-   \`find(callbackFn)\`: Returns the *value* of the first element that satisfies the provided testing function.
-   \`findIndex(callbackFn)\`: Returns the *index* of the first element that satisfies the provided testing function.
-   \`some(callbackFn)\`: Tests whether at least one element passes the test.
-   \`every(callbackFn)\`: Tests whether all elements pass the test.

**Iteration:**
Besides \`forEach\`, \`map\`, \`filter\`, etc., you can use \`for...of\` loops to iterate over array values.

Try the examples in the code editor to see how these methods work!
`,
  },
  dom: {
        title: 'DOM Manipulation',
        description: 'Learn how to select, modify, create, and delete HTML elements using JavaScript.',
        initialCode: `// --- You need HTML to interact with! ---
// Create a simple structure dynamically
const container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container); // Add to the actual page body

const title = document.createElement('h1');
title.className = 'title';
title.textContent = 'Hello World';
container.appendChild(title);

const paragraph = document.createElement('p');
paragraph.textContent = 'This is a paragraph.';
container.appendChild(paragraph);

const button = document.createElement('button');
button.id = 'myButton';
button.textContent = 'Click Me';
container.appendChild(button);

const list = document.createElement('ul');
list.id = 'list';
const item1 = document.createElement('li');
item1.textContent = 'Item 1';
list.appendChild(item1);
const item2 = document.createElement('li');
item2.textContent = 'Item 2';
list.appendChild(item2);
container.appendChild(list);

// Clear previous outputs if any from other runs
console.clear();
console.log("--- HTML structure created dynamically ---");


// --- Selecting Elements ---
console.log("--- Selecting ---");
const selectedContainer = document.getElementById("container");
console.log("Container by ID:", selectedContainer ? 'Found' : 'Not Found');

const selectedTitle = document.querySelector(".title"); // Selects the first element with class 'title'
console.log("Title by querySelector:", selectedTitle ? selectedTitle.tagName : 'Not Found');

const listItems = document.querySelectorAll("#list li"); // Selects all <li> inside #list
console.log("List items by querySelectorAll:", listItems.length); // Returns a NodeList

const selectedButton = document.getElementById("myButton"); // Select button for later use
console.log("Button by ID:", selectedButton ? 'Found' : 'Not Found');


// --- Modifying Elements ---
console.log("\\n--- Modifying ---");
if (selectedTitle) {
  selectedTitle.textContent = "Hello JavaScript!"; // Change text content
  selectedTitle.style.color = "blue"; // Change inline style
  selectedTitle.classList.add("highlight"); // Add a CSS class
  selectedTitle.classList.remove("title"); // Remove a CSS class
  console.log("Modified Title:", selectedTitle.textContent, selectedTitle.className);
}

// --- Creating and Appending Elements ---
console.log("\\n--- Creating & Appending ---");
const newItem = document.createElement("li"); // Create a new <li> element
newItem.textContent = "New Item 3"; // Set its text

const selectedList = document.getElementById("list");
if (selectedList) {
  selectedList.appendChild(newItem); // Add the new item to the end of the list
  console.log("Appended new list item. List length:", selectedList.children.length);
}

const newParagraph = document.createElement("p");
newParagraph.textContent = "This paragraph was added by JS.";
if (selectedContainer && selectedButton) {
    // Insert before the button
    selectedContainer.insertBefore(newParagraph, selectedButton);
    console.log("Inserted paragraph before button.");
}


// --- Removing Elements ---
console.log("\\n--- Removing ---");
const firstListItem = document.querySelector("#list li"); // Get the first li again
if (selectedList && firstListItem) {
   selectedList.removeChild(firstListItem);
   console.log("Removed first list item. List length:", selectedList.children.length);
}


// --- Event Handling ---
console.log("\\n--- Event Handling ---");
// Store listener function to remove it later if needed
const clickHandler = () => {
    console.log("Button clicked! Changing container background.");
    if(selectedContainer) selectedContainer.style.backgroundColor = "#e0f7fa"; // Example change
    // Clean up listener to avoid duplicates on re-runs in editor
    selectedButton?.removeEventListener("click", clickHandler);
};

if (selectedButton) {
  // Add the event listener
  selectedButton.addEventListener("click", clickHandler);
  console.log("Click event listener added to button. Try clicking it!");

  // Example: Mouseover (will only log in browser console, not here)
  selectedButton.addEventListener("mouseover", () => {
     // console.log("Button mouseover"); // Won't show in safeEval output
     selectedButton.style.backgroundColor = "lightgreen";
  });
   selectedButton.addEventListener("mouseout", () => {
     // console.log("Button mouseout"); // Won't show in safeEval output
     selectedButton.style.backgroundColor = ""; // Reset style
  });
   console.log("Mouseover/out listeners added (effects visible in browser).")
}

// --- Cleanup ---
// Remove the dynamically added container after a delay to allow viewing changes
// In a real scenario, you wouldn't typically remove everything like this
// setTimeout(() => {
//   if (document.body.contains(container)) {
//      document.body.removeChild(container);
//      console.log("\\n--- Cleanup: Removed dynamic container ---");
//    }
// }, 5000); // Remove after 5 seconds


console.warn("\\nNOTE: DOM manipulation output is limited in this environment. Effects are best observed in a browser.");
`,
        aiPromptContent: `
### DOM Manipulation
The Document Object Model (DOM) is a programming interface for HTML and XML documents. It represents the page structure as a tree of objects, where each object corresponds to a part of the document (like elements, attributes, and text). JavaScript can interact with the DOM to dynamically change the content, structure, and style of a web page.

**1. Selecting Elements:**
How you grab the HTML elements you want to work with.

-   \`document.getElementById('elementId')\`: Selects a single element by its unique ID. Fast and common.
-   \`document.querySelector('cssSelector')\`: Selects the *first* element matching a specified CSS selector (e.g., \`.className\`, \`#id\`, \`tagname\`, \`[attribute=value]\`). Very versatile.
-   \`document.querySelectorAll('cssSelector')\`: Selects *all* elements matching a CSS selector. Returns a static \`NodeList\` (which is like an array but not exactly the same).
-   \`document.getElementsByClassName('className')\`: Selects all elements with a specific class name. Returns an \`HTMLCollection\` (live collection).
-   \`document.getElementsByTagName('tagName')\`: Selects all elements with a specific tag name (e.g., \`'p'\`, \`'div'\`). Returns an \`HTMLCollection\`.

**2. Modifying Elements:**
Changing the selected elements.

-   \`element.textContent = 'new text'\`: Changes the text content of an element (ignores HTML tags).
-   \`element.innerHTML = '<span>new HTML</span>'\`: Changes the HTML content inside an element. Use with caution due to potential security risks (Cross-Site Scripting - XSS) if using untrusted content.
-   \`element.style.property = 'value'\`: Changes inline CSS styles (e.g., \`element.style.color = 'red'; element.style.backgroundColor = '#f0f0f0';\`). Property names are camelCased (e.g., \`background-color\` becomes \`backgroundColor\`).
-   \`element.setAttribute('attributeName', 'value')\`: Sets the value of an attribute (e.g., \`imgElement.setAttribute('src', 'new_image.jpg');\`).
-   \`element.removeAttribute('attributeName')\`: Removes an attribute.
-   \`element.classList.add('className')\`: Adds a CSS class.
-   \`element.classList.remove('className')\`: Removes a CSS class.
-   \`element.classList.toggle('className')\`: Adds the class if it's not present, removes it if it is.
-   \`element.classList.contains('className')\`: Checks if the element has a specific class.

**3. Creating Elements:**
Making new HTML elements from scratch.

-   \`document.createElement('tagName')\`: Creates a new element (e.g., \`document.createElement('p')\`). The element is created in memory but not yet added to the page.

**4. Adding & Removing Elements:**
Placing created elements onto the page or removing existing ones.

-   \`parentElement.appendChild(childElement)\`: Adds \`childElement\` as the last child of \`parentElement\`.
-   \`parentElement.insertBefore(newElement, referenceElement)\`: Inserts \`newElement\` into \`parentElement\` right before \`referenceElement\`.
-   \`parentElement.removeChild(childElement)\`: Removes \`childElement\` from \`parentElement\`.
-   \`element.remove()\`: (Modern) Removes the element itself from the DOM.

**5. Event Handling:**
Making elements react to user interactions (clicks, mouse movements, key presses, etc.).

-   \`element.addEventListener('eventName', function(event) { /* code to run */ })\`: The standard and recommended way. Attaches an event listener function to an element.
    -   \`eventName\`: The type of event (e.g., \`'click'\`, \`'mouseover'\`, \`'keydown'\`).
    -   \`function(event)\`: The function to execute when the event occurs. The optional \`event\` object contains details about the event.
-   \`element.removeEventListener('eventName', functionReference)\`: Removes a previously added listener. Requires a reference to the *exact same function* used in \`addEventListener\`.

**Important Note:** The code editor environment here simulates DOM manipulation by actually adding/modifying elements on *this* page. The \`console.log\` outputs show the results of selection and modification steps. Event handlers (like button clicks) will log messages to the output console when triggered. For full visual effects and interaction, running similar code in a browser's developer console is ideal.
`,
  },
  es6: {
    title: 'ES6+ Features',
    description: 'Explore modern JavaScript enhancements like let/const, arrow functions, Promises, async/await, destructuring, and more.',
    initialCode: `// --- let and const (Block Scope) ---
console.log("--- Block Scope ---");
if (true) {
  let blockLet = "Visible only here";
  const blockConst = "Also only here";
  var blockVar = "Visible outside (function/global scope)";
  console.log("Inside block:", blockLet, blockConst);
}
// console.log(blockLet); // ReferenceError if uncommented
// console.log(blockConst); // ReferenceError if uncommented
console.log("Outside block (var):", blockVar); // Works

// --- Arrow Functions ---
console.log("\\n--- Arrow Functions ---");
const squares = [1, 2, 3].map(x => x * x);
console.log("Squares:", squares); // Output: [1, 4, 9]

// --- Template Literals ---
const name = "Alice";
const greeting = \`Hello, \${name}!
You can write multi-line strings easily.\`;
console.log("\\n--- Template Literals ---");
console.log(greeting);

// --- Destructuring Assignment ---
console.log("\\n--- Destructuring ---");
// Object Destructuring
const person = { firstName: "Bob", age: 35, city: "London" };
const { firstName, age } = person;
console.log("Name:", firstName, "| Age:", age);

// Array Destructuring
const colors = ["red", "green", "blue"];
const [firstColor, , thirdColor] = colors; // Skip second element
console.log("Colors (1st, 3rd):", firstColor, thirdColor);

// --- Default Parameters ---
console.log("\\n--- Default Parameters ---");
function multiply(a, b = 1) { // b defaults to 1
  return a * b;
}
console.log("multiply(5):", multiply(5)); // Output: 5
console.log("multiply(5, 2):", multiply(5, 2)); // Output: 10

// --- Rest Parameter & Spread Operator (...) ---
console.log("\\n--- Rest & Spread ---");
// Rest Parameter (gathers remaining arguments into an array)
function sum(...numbers) {
  return numbers.reduce((acc, current) => acc + current, 0);
}
console.log("Sum(1, 2, 3, 4):", sum(1, 2, 3, 4)); // Output: 10

// Spread Operator (expands iterables into arguments or elements)
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, 0, ...arr2, 5]; // Combine arrays
console.log("Combined array:", combined);

const obj1 = { a: 1, b: 0 };
const obj2 = { b: 2, c: 3 };
const mergedObj = { ...obj1, ...obj2, d: 4 }; // Merge objects (later props overwrite earlier)
console.log("Merged object:", mergedObj); // Output: { a: 1, b: 2, c: 3, d: 4 }

// --- Promises (Handling Asynchronous Operations) ---
console.log("\\n--- Promises (Example - see Async JS topic) ---");
// Promises are covered in detail in the 'Async JS' topic.
// This is just a placeholder reminder.
const myPromise = new Promise((resolve) => setTimeout(() => resolve("Promise Resolved!"), 100));
myPromise.then(console.log);


// --- async/await (Syntactic Sugar for Promises - ES2017) ---
console.log("\\n--- async/await (Example - see Async JS topic) ---");
// async/await is covered in detail in the 'Async JS' topic.
async function exampleAsync() {
  console.log("Async function started...");
  const result = await myPromise; // Wait for the promise above
  console.log("Async function result:", result);
  console.log("Async function finished.");
}
exampleAsync();


// --- Classes (Syntactic Sugar over Prototypal Inheritance) ---
console.log("\\n--- Classes ---");
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(\`\${this.name} makes a noise.\`);
  }
}

class Dog extends Animal { // Inheritance
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() { // Override parent method
    console.log(\`\${this.name} barks.\`);
  }

  fetch() {
    console.log(\`\${this.name} fetches the ball!\`)
  }
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak(); // Output: Rex barks.
dog.fetch(); // Output: Rex fetches the ball!
console.log("Dog's breed:", dog.breed);

console.log("\\nNote: Promise/async outputs might appear after other logs due to delays.");
`,
    aiPromptContent: `
### ES6+ Features (Modern JavaScript)
ECMAScript (ES) is the standard that JavaScript is based on. Starting with ES6 (ECMAScript 2015), new versions with significant features are released annually. These features make JavaScript more powerful, readable, and efficient.

**Key ES6 (2015) Features:**

-   **\`let\` and \`const\`**: Block-scoped variable declarations, replacing the need for \`var\` in most cases. See *Variables & Data Types*.
-   **Arrow Functions**: Concise syntax for functions, with lexical \`this\` binding. \`(params) => expression\` or \`(params) => { statements }\`. See *Functions*.
-   **Template Literals**: String interpolation using backticks (\`), allowing embedded expressions (\`\${expression}\`) and multi-line strings.
-   **Destructuring Assignment**: Easily extract values from arrays or properties from objects into distinct variables.
    -   Object: \`const { name, age } = person;\`
    -   Array: \`const [first, second] = myArray;\`
-   **Default Parameters**: Define default values for function parameters: \`function greet(name = "Guest") { ... }\`. See *Functions*.
-   **Rest Parameter**: Collects an indefinite number of arguments into an array within a function definition: \`function sum(...numbers) { ... }\`.
-   **Spread Operator**: Expands an iterable (like an array or string) into individual elements, useful for function calls, array literals, or object literals (ES2018+). \`const combined = [...arr1, ...arr2];\` \`myFunction(...args);\`.
-   **Classes**: Syntactic sugar over JavaScript's existing prototypal inheritance, providing a clearer syntax for creating constructor functions and handling inheritance (\`class MyClass { constructor() {} method() {} }\`, \`extends\`, \`super\`).
-   **Modules**: Native support for modular code using \`import\` and \`export\` statements, allowing better organization and code reuse (primarily used with build tools or in modern browsers/Node.js). *(Not easily demonstrable in this editor)*.
-   **Promises**: A standard way to handle asynchronous operations, representing a value that may be available now, or in the future, or never. They improve upon callback-based patterns (\`new Promise((resolve, reject) => { ... })\`, \`.then()\`, \`.catch()\`). See *Async JS*.
-   **Symbols**: A primitive data type creating unique identifiers, often used for object property keys to avoid naming collisions. See *Variables & Data Types*.
-   **Iterators and Generators**: Protocols for defining standard ways to produce sequences of values. *(Advanced topic)*.

**Key Later Features (ES2016+):**

-   **Exponentiation Operator (\`**\`):** \`2 ** 3\` is 8 (ES2016).
-   **\`Array.prototype.includes()\`**: Checks if an array contains a value (ES2016). See *Arrays*.
-   **\`async\`/\`await\`**: Syntactic sugar built on top of Promises, making asynchronous code look and behave more like synchronous code, improving readability (ES2017). See *Async JS*.
-   **\`Object.values()\` / \`Object.entries()\`**: Get arrays of object values or [key, value] pairs (ES2017). See *Objects*.
-   **Rest/Spread Properties for Objects**: Use \`...\` for gathering remaining object properties or spreading properties into new objects (ES2018).
-   **\`Promise.prototype.finally()\`**: Executes code when a Promise is settled (either resolved or rejected) (ES2018). See *Async JS*.
-   **Optional Chaining (\`?.`)\`**: Safely access nested object properties without causing errors if an intermediate property is \`null\` or \`undefined\` (ES2020). \`user?.address?.street\`.
-   **Nullish Coalescing Operator (\`??\`)\`**: Provides a default value only when the left-hand operand is \`null\` or \`undefined\` (unlike \`||\` which triggers on any falsy value) (ES2020). \`value ?? defaultValue\`.
-   *...and many more ongoing improvements.*

Modern JavaScript relies heavily on these features. Run the examples to see them in action! Note that Promises and async/await handle operations that don't complete instantly, so their console output might appear after later synchronous code.
`,
  },
   async: {
    title: 'Async JavaScript',
    description: 'Handle asynchronous operations with callbacks, Promises, and async/await.',
    initialCode: `console.log("--- Asynchronous JavaScript ---");

// 1. Callbacks (Older approach)
console.log("\\n1. Callbacks Example:");
function fetchDataWithCallback(callback) {
  console.log("Fetching data (callback)...");
  // Simulate network request
  setTimeout(() => {
    const data = { message: "Data received via callback!" };
    const error = null; // Simulate success
    // const error = new Error("Failed to fetch!"); // Simulate error
    if (error) {
      callback(error, null);
    } else {
      callback(null, data);
    }
  }, 500); // 0.5 second delay
}

fetchDataWithCallback((error, data) => {
  if (error) {
    console.error("Callback Error:", error.message);
  } else {
    console.log("Callback Success:", data.message);
  }
});
console.log("Callback initiated..."); // This logs before the callback finishes


// 2. Promises (ES6+)
console.log("\\n2. Promises Example:");
function fetchDataWithPromise() {
  console.log("Fetching data (promise)...");
  return new Promise((resolve, reject) => {
    // Simulate network request
    setTimeout(() => {
      const success = Math.random() > 0.3; // Simulate success/failure
      if (success) {
        const data = { message: "Data received via Promise!" };
        resolve(data); // Fulfill the promise
      } else {
        reject(new Error("Failed to fetch via Promise!")); // Reject the promise
      }
    }, 1000); // 1 second delay
  });
}

fetchDataWithPromise()
  .then(data => { // Handle successful resolution
    console.log("Promise Success:", data.message);
    // You can chain .then() calls
    return "Processed: " + data.message;
  })
  .then(processedData => {
    console.log("Promise Chained:", processedData);
  })
  .catch(error => { // Handle rejection
    console.error("Promise Error:", error.message);
  })
  .finally(() => { // Executes regardless of success or failure (ES2018)
    console.log("Promise finished (finally).");
  });
console.log("Promise initiated..."); // Logs before the promise settles


// 3. async/await (ES2017 - Syntactic sugar for Promises)
console.log("\\n3. async/await Example:");
async function processData() {
  console.log("Async function starting...");
  try {
    // 'await' pauses execution until the promise settles
    const data = await fetchDataWithPromise(); // Re-use the promise function
    console.log("Async/await Success:", data.message);
    // You can await multiple promises sequentially
    console.log("Fetching again with await...");
    const data2 = await fetchDataWithPromise();
    console.log("Async/await Success (2nd fetch):", data2.message);
    return "Async function complete!";
  } catch (error) {
    console.error("Async/await Error:", error.message);
    return "Async function failed.";
  } finally {
     console.log("Async function finished (finally).");
  }
}

// Call the async function
processData().then(result => console.log("Async function returned:", result));
console.log("Async function called..."); // Logs before the async function completes

console.log("\\n--- End of synchronous code ---");
// Note: Outputs from async operations will appear after this line, potentially out of order.
`,
    aiPromptContent: `
### Asynchronous JavaScript
JavaScript is single-threaded, meaning it can only do one thing at a time. Asynchronous operations allow your program to start a long-running task (like fetching data from a server, reading a file, or waiting for a timer) and continue executing other code without waiting for that task to complete. When the task finishes, a mechanism is used to handle its result (or error).

**1. Callbacks:**
The original way to handle async operations. You pass a function (the callback) as an argument to another function. The outer function performs the async task, and when it's done, it calls the callback function, often passing the result or an error as arguments.

-   **Pros:** Simple concept for basic cases.
-   **Cons:** Can lead to "Callback Hell" (deeply nested callbacks) when dealing with multiple dependent async operations, making code hard to read and maintain. Error handling can be inconsistent.

**2. Promises (ES6/ES2015):**
A Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It provides a cleaner way to handle async results than callbacks.

-   **States:**
    -   *Pending:* Initial state, neither fulfilled nor rejected.
    -   *Fulfilled:* The operation completed successfully.
    -   *Rejected:* The operation failed.
-   **Methods:**
    -   \`.then(onFulfilled, onRejected)\`: Attaches callbacks to handle the fulfilled or rejected states. Returns a new Promise, allowing chaining.
    -   \`.catch(onRejected)\`: Syntactic sugar for \`.then(null, onRejected)\`. Handles errors (rejections).
    -   \`.finally(onFinally)\`: (ES2018) Executes a callback when the Promise is settled (either fulfilled or rejected). Useful for cleanup tasks.
-   **Static Methods:** \`Promise.all()\`, \`Promise.race()\`, \`Promise.resolve()\`, \`Promise.reject()\`, \`Promise.allSettled()\` (ES2020).

-   **Pros:** Avoids Callback Hell, provides better error handling, enables chaining of async operations. Standardized.
-   **Cons:** Syntax can still be a bit verbose compared to async/await.

**3. \`async\`/\`await\` (ES2017):**
Built on top of Promises, \`async\`/\`await\` provides syntactic sugar that makes asynchronous code look and behave more like synchronous code, making it easier to read and write.

-   **\`async\` Keyword:** Placed before a function declaration (\`async function myFunction() { ... }\`) makes the function implicitly return a Promise. Any value returned from an \`async\` function is wrapped in a resolved Promise. If an error is thrown, it's wrapped in a rejected Promise.
-   **\`await\` Keyword:** Can *only* be used inside an \`async\` function. It pauses the execution of the \`async\` function until the Promise it's waiting for is settled (fulfilled or rejected).
    -   If the Promise fulfills, \`await\` returns the fulfilled value.
    -   If the Promise rejects, \`await\` throws the rejected reason (error).
-   **Error Handling:** Use standard synchronous \`try...catch...finally\` blocks to handle rejected Promises awaited within an \`async\` function.

-   **Pros:** Greatly improves readability and maintainability of asynchronous code. Simplifies error handling with familiar \`try...catch\`.
-   **Cons:** Still relies on Promises underneath. \`await\` can only be used inside \`async\` functions (though top-level await is now available in modules).

Run the code examples to see how callbacks, Promises, and async/await work. Notice how the console logs appear – synchronous logs appear first, while asynchronous results appear later.
`,
  },
  'error-handling': {
    title: 'Error Handling',
    description: 'Learn how to gracefully handle errors using try...catch, throw, and Promise rejections.',
    initialCode: `console.log("--- Error Handling ---");

// 1. try...catch block (for synchronous errors)
console.log("\\n1. try...catch Example:");
try {
  console.log("Entering try block...");
  // const result = riskyOperation(); // Assume this might throw an error
  // Simulate an error:
  throw new Error("Something went wrong in the try block!");
  // console.log("This line won't execute if an error occurs above.");
} catch (error) {
  console.error("Caught an error:", error.message);
  // You can inspect the error object: error.name, error.stack, etc.
  // console.error("Error stack:", error.stack);
} finally {
  // This block executes regardless of whether an error occurred or not.
  // Useful for cleanup tasks (e.g., closing files, releasing resources).
  console.log("Finally block executed.");
}
console.log("Code continues after try...catch.");


// 2. throw statement (Creating custom errors)
console.log("\\n2. throw Example:");
function checkAge(age) {
  if (typeof age !== 'number') {
    throw new TypeError("Age must be a number."); // Throw specific error type
  }
  if (age < 0) {
    throw new RangeError("Age cannot be negative."); // Another specific type
  }
  if (age < 18) {
    throw new Error("User must be 18 or older."); // Generic error
  }
  console.log("Age is valid:", age);
}

try {
  // checkAge("twenty"); // Uncomment to test TypeError
  // checkAge(-5);      // Uncomment to test RangeError
  checkAge(16);      // Uncomment to test generic Error
  // checkAge(25);      // This one is valid
} catch (error) {
  console.error(\`Caught validation error (\${error.name}):\`, error.message);
}


// 3. Error Handling with Promises
console.log("\\n3. Promise Error Handling:");
function promiseThatMightFail(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Promise rejected deliberately!"));
      } else {
        resolve("Promise resolved successfully!");
      }
    }, 300);
  });
}

// Using .catch()
promiseThatMightFail(true)
  .then(result => {
    console.log("Promise success (using .catch):", result); // This won't run
  })
  .catch(error => {
    console.error("Promise error caught with .catch():", error.message);
  });

// Using try...catch with async/await
console.log("\\n4. async/await Error Handling:");
async function handlePromiseWithAsync() {
  try {
    console.log("Async: Trying to resolve promise...");
    const resultSuccess = await promiseThatMightFail(false);
    console.log("Async success:", resultSuccess);

    console.log("Async: Trying to reject promise...");
    const resultFailure = await promiseThatMightFail(true); // This will throw
    console.log("Async failure result (won't be reached):", resultFailure);
  } catch (error) {
    console.error("Async error caught with try...catch:", error.message);
  } finally {
    console.log("Async finally block.");
  }
}

handlePromiseWithAsync();

console.log("\\n--- End of synchronous code ---");
// Note: Promise/async outputs may appear later.
`,
    aiPromptContent: `
### Error Handling
Errors are inevitable in programming. Proper error handling ensures your application can gracefully manage unexpected situations, preventing crashes and providing helpful feedback.

**1. \`try...catch...finally\` Statement:**
Used to handle synchronous errors (errors that occur during the immediate execution flow).

\`\`\`javascript
try {
  // Code that might throw an error
  let result = potentiallyRiskyOperation();
  console.log("Operation succeeded:", result);
} catch (error) {
  // Code to execute if an error is thrown in the try block
  console.error("An error occurred:", error.message);
  // 'error' is the object representing the error (e.g., Error, TypeError, RangeError)
  // You can log it, display a message to the user, etc.
} finally {
  // Optional block: Code that executes *always*,
  // whether an error occurred or not.
  // Useful for cleanup (e.g., closing connections, releasing resources).
  console.log("Cleanup tasks executed.");
}
\`\`\`

-   The \`try\` block contains the code you want to monitor for errors.
-   If an error occurs within the \`try\` block, execution immediately jumps to the \`catch\` block.
-   The \`catch\` block receives the error object as an argument.
-   The \`finally\` block (if present) always runs after the \`try\` (and potentially \`catch\`) block finishes, regardless of errors.

**2. \`throw\` Statement:**
Used to explicitly create and throw your own errors. You can throw any value, but it's best practice to throw an \`Error\` object or an instance of one of its subclasses (\`TypeError\`, \`RangeError\`, \`ReferenceError\`, etc.), or even create custom error classes.

\`\`\`javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed.");
  }
  return a / b;
}

try {
  let result = divide(10, 0);
} catch (error) {
  console.error(error.message); // Output: Division by zero is not allowed.
}
\`\`\`
Throwing errors allows you to signal exceptional conditions that calling functions can then catch and handle appropriately.

**3. Error Handling with Promises:**
Asynchronous operations using Promises have their own error handling mechanisms.

-   **\`.catch(onRejected)\`:** The primary way to handle Promise rejections. Attach a \`.catch()\` block at the end of a Promise chain. It will catch any rejection that occurs in the preceding \`.then()\` blocks or the initial Promise.
    \`\`\`javascript
    fetchData()
      .then(processData)
      .then(displayData)
      .catch(error => {
        console.error("An error occurred in the promise chain:", error);
      });
    \`\`\`
-   **Second Argument to \`.then()\:** You can provide a second function argument to \`.then(onFulfilled, onRejected)\` to handle rejection specifically for that step, but using \`.catch()\` is generally preferred for overall chain error handling.

**4. Error Handling with \`async\`/\`await\`:**
Since \`async\`/\`await\` is built on Promises, you use the standard \`try...catch...finally\` statement to handle errors from awaited Promises. If an awaited Promise rejects, the \`await\` expression throws that rejection reason, which can then be caught by a surrounding \`catch\` block.

\`\`\`javascript
async function performAsyncOperation() {
  try {
    let data = await fetchData(); // If fetchData() rejects, it throws
    let processed = await processData(data); // If processData() rejects...
    console.log("Success:", processed);
  } catch (error) {
    console.error("Async operation failed:", error);
  } finally {
    console.log("Async cleanup.");
  }
}
\`\`\`
This makes asynchronous error handling look very similar to synchronous error handling.

Experiment with the code examples to see different error types and how they are caught.
`,
  },
    'this-keyword': {
    title: 'The `this` Keyword',
    description: "Understand how the value of `this` is determined in different JavaScript contexts.",
    initialCode: `console.log("--- Understanding 'this' ---");

// 1. Global Context
// In non-strict mode, 'this' refers to the global object (window in browsers).
// In strict mode ('use strict';), 'this' is undefined in the global context.
console.log("1. Global context 'this':", this); // In browser dev tools, this might show Window

// 2. Function Context (Simple Call)
function showThisSimple() {
  // 'use strict'; // Uncomment this to see 'this' become undefined
  console.log("2. Simple function call 'this':", this);
}
showThisSimple(); // In non-strict mode, 'this' is the global object (or undefined in strict mode)

// 3. Method Context (Called on an Object)
const myObject = {
  name: "My Object",
  showThisMethod: function() {
    // 'this' refers to the object the method was called on (myObject)
    console.log("3. Method call 'this':", this);
    console.log("   Name:", this.name);
  },
   showThisArrow: () => {
    // Arrow functions DO NOT have their own 'this'.
    // They inherit 'this' from the surrounding (lexical) scope where they were DEFINED.
    // In this case, it inherits 'this' from the global scope (or wherever myObject was defined).
    console.log("3a. Arrow function method 'this':", this); // Likely Window or undefined
    // console.log("    Name (arrow):", this.name); // This might cause an error or show undefined
   }
};
myObject.showThisMethod();
myObject.showThisArrow();

// 4. Constructor Context (with 'new')
function Person(name) {
  // When called with 'new', 'this' refers to the newly created object instance.
  this.name = name;
  console.log("4. Constructor call 'this':", this);
}
const alice = new Person("Alice");
console.log("   Instance name:", alice.name);

// 5. Explicit Binding (.call(), .apply(), .bind())
function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}

const bob = { name: "Bob" };
const charlie = { name: "Charlie" };

console.log("\\n5. Explicit Binding:");
// .call(thisArg, arg1, arg2, ...)
greet.call(bob, "Hello", "!"); // 'this' inside greet is set to bob

// .apply(thisArg, [arg1, arg2, ...])
greet.apply(charlie, ["Hi", "?"]); // 'this' inside greet is set to charlie

// .bind(thisArg) returns a NEW function with 'this' permanently bound.
const greetBob = greet.bind(bob, "Good morning"); // Bind 'this' and the first argument
greetBob("!!"); // Call the bound function with remaining arguments

const greetCharlieLater = greet.bind(charlie); // Only bind 'this'
greetCharlieLater("Hey", ".");

// 6. Event Handlers (DOM - Example, won't fully run here)
// In DOM event handlers (added via addEventListener), 'this' usually refers
// to the element the listener was attached to. Arrow functions behave differently.

// const button = document.createElement('button');
// button.textContent = 'Click Me';
// button.addEventListener('click', function() {
//   console.log("6. Event listener 'this':", this); // 'this' is the button element
//   this.textContent = 'Clicked!';
// });
// button.addEventListener('click', () => {
//   console.log("6a. Arrow listener 'this':", this); // 'this' is inherited (likely Window)
// });
// // document.body.appendChild(button); // Add to page to test
console.log("\\n6. Event Handlers: 'this' typically refers to the element (except arrow funcs). See comments.");

console.log("\\n--- End of 'this' examples ---");
`,
    aiPromptContent: `
### The \`this\` Keyword
The value of the \`this\` keyword in JavaScript is determined by *how* a function is called (its execution context). It's a common source of confusion for developers. Here's how \`this\` behaves in different scenarios:

**1. Global Context:**
-   Outside any function, \`this\` refers to the global object.
-   In web browsers, the global object is \`window\`.
-   In **strict mode** (\`'use strict';\`), \`this\` is \`undefined\` in the global context and inside simple function calls.

**2. Simple Function Call:**
-   When a function is called directly (e.g., \`myFunction()\`), not as a method of an object.
-   In **non-strict mode**, \`this\` defaults to the global object (\`window\` in browsers).
-   In **strict mode**, \`this\` is \`undefined\`.

**3. Method Call:**
-   When a function is called *as a property of an object* (e.g., \`myObject.myMethod()\`).
-   \`this\` is set to the **object that the method was called on** (the object *before* the dot).

**4. Arrow Functions (\`=>\`):**
-   Arrow functions are special: **they do not have their own \`this\` binding.**
-   Instead, they **inherit \`this\` from their surrounding (lexical) scope** at the time they are *defined*.
-   This means the value of \`this\` inside an arrow function is the same as the value of \`this\` outside of it.
-   This behavior is often useful in callbacks or methods where you want to retain the \`this\` value from the containing context (like a class instance).

**5. Constructor Call (\`new\` keyword):**
-   When a function is used as a constructor with the \`new\` keyword (e.g., \`new Person('Alice')\`).
-   \`this\` is bound to the **newly created object instance**.

**6. Explicit Binding:**
-   You can explicitly set the value of \`this\` for a function call using specific methods:
    -   **\`function.call(thisArg, arg1, arg2, ...)\`**: Calls the function immediately with \`this\` set to \`thisArg\`, passing arguments individually.
    -   **\`function.apply(thisArg, [arg1, arg2, ...])\`**: Calls the function immediately with \`this\` set to \`thisArg\`, passing arguments as an array.
    -   **\`function.bind(thisArg)\`**: Creates a **new function** where \`this\` is *permanently* bound to \`thisArg\`. It doesn't call the function immediately. You can also pre-set arguments (\`bind(thisArg, arg1, arg2)\`).

**7. DOM Event Handlers:**
-   When a regular function (not an arrow function) is used as an event handler attached via \`element.addEventListener('click', function() { ... })\`.
-   \`this\` is usually set to the **DOM element that the event listener is attached to**.
-   If you use an *arrow function* as the event handler, \`this\` will be inherited from the surrounding scope where \`addEventListener\` was called, *not* the element.

Understanding these rules is crucial for writing correct object-oriented and event-driven JavaScript. Experiment with the code examples and try uncommenting the strict mode lines to see the difference!
`,
  },
   json: {
    title: 'JSON',
    description: 'Learn about JavaScript Object Notation (JSON) syntax and how to parse and stringify JSON data.',
    initialCode: `console.log("--- JSON (JavaScript Object Notation) ---");

// 1. JSON Syntax Rules:
// - Data is in name/value pairs (like JS object properties).
// - Keys (names) MUST be double-quoted strings.
// - Values must be one of the following types:
//   - string (in double quotes)
//   - number
//   - object (JSON object)
//   - array
//   - boolean (true/false)
//   - null
// - NO functions, NO undefined, NO comments, NO trailing commas.

// Example JSON String
const jsonString = \`
{
  "name": "Example Product",
  "id": 12345,
  "available": true,
  "tags": ["electronics", "gadget"],
  "dimensions": {
    "width": 10.5,
    "height": 5.0,
    "unit": "cm"
  },
  "relatedProduct": null
}
\`;

console.log("1. Example JSON String:");
console.log(jsonString);


// 2. Parsing JSON: JSON.parse()
// Converts a JSON string into a JavaScript object or value.
console.log("\\n2. Parsing JSON (JSON.parse):");
try {
  const jsObject = JSON.parse(jsonString);
  console.log("   Parsed JS Object:", jsObject);
  console.log("   Accessing data:", jsObject.name, "| Tag:", jsObject.tags[0]);
  console.log("   Nested data:", jsObject.dimensions.width);

  // Example of invalid JSON (missing quotes on key)
  const invalidJsonString = '{ name: "Invalid" }';
  // JSON.parse(invalidJsonString); // This would throw a SyntaxError

} catch (error) {
  // Catch potential SyntaxErrors if the JSON string is malformed.
  console.error("   Error parsing JSON:", error.message);
}

// 3. Stringifying JavaScript: JSON.stringify()
// Converts a JavaScript object or value into a JSON string.
console.log("\\n3. Stringifying JavaScript (JSON.stringify):");

const dataToConvert = {
  productName: "Another Gadget",
  price: 99.99,
  isActive: true,
  components: ["cpu", "ram", "storage"],
  specs: { speed: "fast", color: "black" },
  releaseDate: new Date(), // Dates are converted to ISO string format
  onSale: undefined,      // undefined properties are OMITTED
  calculateTax: function() { return this.price * 0.1; } // Functions are OMITTED
};

console.log("   Original JS Object:", dataToConvert);

const simpleJsonOutput = JSON.stringify(dataToConvert);
console.log("   Simple JSON Output:", simpleJsonOutput);

// Using 'replacer' and 'space' arguments:
// replacer: A function or an array to filter/transform properties.
// space: Adds indentation (number of spaces or a string) for readability.

// Replacer function example (only include string values)
function stringReplacer(key, value) {
  if (typeof value === 'string') {
    return value;
  }
  // Returning undefined omits the key/value pair
  // Returning the value includes it (if it's a valid JSON type)
  if (key === "price" || key === "isActive" || key === "components" || key === "specs") {
    return value; // Keep price, isActive, components, specs
  }
  return undefined; // Omit others
}
// const filteredJsonOutput = JSON.stringify(dataToConvert, stringReplacer, 2);
// console.log("\\n   Filtered JSON Output (strings only):", filteredJsonOutput);

// Replacer array example (only include specified keys)
const keysToInclude = ["productName", "price", "components"];
const filteredByKeyJson = JSON.stringify(dataToConvert, keysToInclude, 2);
console.log("\\n   Filtered JSON Output (specific keys):", filteredByKeyJson);


// Using 'space' for pretty-printing
const prettyJsonOutput = JSON.stringify(dataToConvert, null, 2); // Use 2 spaces for indentation
console.log("\\n   Pretty JSON Output (2 spaces):");
console.log(prettyJsonOutput);

const prettyJsonTabs = JSON.stringify(dataToConvert, null, '\\t'); // Use tabs for indentation
console.log("\\n   Pretty JSON Output (tabs):");
console.log(prettyJsonTabs);


console.log("\\n--- End of JSON examples ---");
`,
    aiPromptContent: `
### JSON (JavaScript Object Notation)
JSON is a lightweight data-interchange format. It's easy for humans to read and write and easy for machines to parse and generate. Although derived from JavaScript object literal syntax, it is **language-independent**, with parsers available for nearly all programming languages. It's commonly used for transmitting data between a server and web application (e.g., in APIs).

**JSON Syntax Rules:**

-   Data is represented in **key/value pairs**.
-   Keys **must** be **strings enclosed in double quotes** (\`"key"\`).
-   Values **must** be one of the following valid JSON data types:
    -   A **string** (in double quotes: \`"value"\`).
    -   A **number** (integer or float: \`123\`, \`45.67\`).
    -   An **object** (another valid JSON object enclosed in curly braces \`{...}\`).
    -   An **array** (an ordered list of valid JSON values enclosed in square brackets \`[...] \`).
    -   A **boolean** (\`true\` or \`false\` - lowercase, no quotes).
    -   The value \`null\` (lowercase, no quotes).
-   **Invalid in JSON:** Functions, \`undefined\`, comments (\`//\`, \`/* */\`), trailing commas after the last element in an object or array.

**Example JSON Structure:**
\`\`\`json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "age": 30,
  "isStudent": false,
  "courses": [
    { "title": "History 101", "credits": 3 },
    { "title": "CompSci 200", "credits": 4 }
  ],
  "address": null
}
\`\`\`

**Working with JSON in JavaScript:**

JavaScript provides a built-in global \`JSON\` object with two main methods:

**1. \`JSON.parse(jsonString)\`:**
-   Takes a valid **JSON string** as input.
-   Parses the string and returns the corresponding **JavaScript object or value**.
-   **Throws a \`SyntaxError\`** if the input string is not valid JSON. It's crucial to wrap \`JSON.parse()\` in a \`try...catch\` block when dealing with potentially invalid external data.

\`\`\`javascript
const jsonStr = '{"name": "Alice", "age": 25}';
try {
  const user = JSON.parse(jsonStr);
  console.log(user.name); // Output: Alice
} catch (e) {
  console.error("Invalid JSON:", e);
}
\`\`\`

**2. \`JSON.stringify(value, replacer, space)\`:**
-   Takes a **JavaScript value** (usually an object or array) as input.
-   Converts it into a **JSON string**.
-   **Omits** properties with \`undefined\`, function, or Symbol values.
-   Converts \`Date\` objects to their ISO 8601 string representation.
-   Handles circular references by throwing a \`TypeError\`.
-   **Optional arguments:**
    -   \`replacer\`: A function (\`(key, value) => newValue\`) or an array of strings/numbers used to filter or transform the properties included in the output string. If it's a function, it's called for each key/value pair; return \`undefined\` to exclude, or the desired value to include/transform. If it's an array, only properties whose keys are in the array are included.
    -   \`space\`: Adds indentation, whitespace, and line breaks to the output string for readability. Can be a number (0-10) specifying the number of spaces per indentation level, or a string (up to 10 characters) used for indentation (e.g., \`'\\t'\`).

\`\`\`javascript
const user = { name: "Bob", id: 101, loggedIn: true, lastLogin: new Date() };

// Simple stringification
const jsonStr = JSON.stringify(user);
// '{"name":"Bob","id":101,"loggedIn":true,"lastLogin":"..."}'

// Pretty-printed stringification
const prettyJsonStr = JSON.stringify(user, null, 2); // 2 spaces indentation
/* Output:
{
  "name": "Bob",
  "id": 101,
  "loggedIn": true,
  "lastLogin": "..."
}
*/
\`\`\`

JSON is essential for web development, especially when working with APIs. Practice parsing and stringifying data in the editor!
`,
  },
    'fetch-api': {
    title: 'Fetch API',
    description: 'Learn how to make asynchronous network requests to fetch resources using the modern Fetch API.',
    initialCode: `console.log("--- Fetch API ---");

// The Fetch API provides a modern way to make network requests (e.g., to APIs).
// It's Promise-based, making it integrate well with async/await.

// Public API for testing: JSONPlaceholder
const API_URL = 'https://jsonplaceholder.typicode.com';

// 1. Basic GET Request with Promises
console.log("\\n1. Basic GET request (.then/.catch):");
fetch(\`\${API_URL}/posts/1\`) // Fetch returns a Promise resolving to the Response object
  .then(response => {
    console.log("   Initial Response:", response.status, response.statusText);
    // Check if the request was successful (status code 200-299)
    if (!response.ok) {
      // If not ok, throw an error to be caught by .catch()
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    // The response body needs to be read. .json() also returns a Promise.
    return response.json(); // Parses the response body as JSON
  })
  .then(data => {
    // 'data' is the parsed JSON object
    console.log("   GET Data:", data);
  })
  .catch(error => {
    // Catches errors from the fetch call itself (network error) OR
    // from the .then() blocks (like the thrown error for bad status)
    console.error("   Fetch Error:", error.message);
  });

console.log("   GET Request initiated..."); // Logs before fetch completes


// 2. GET Request with async/await
console.log("\\n2. GET request (async/await):");
async function fetchPost() {
  console.log("   Async Fetch: Getting post 2...");
  try {
    const response = await fetch(\`\${API_URL}/posts/2\`);
    console.log("   Async Response:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }

    const data = await response.json(); // Await the parsing of JSON
    console.log("   Async GET Data:", data);
  } catch (error) {
    console.error("   Async Fetch Error:", error.message);
  }
}

fetchPost(); // Call the async function
console.log("   Async GET initiated...");


// 3. POST Request (Creating data)
console.log("\\n3. POST request (async/await):");
async function createPost() {
   console.log("   Async Fetch: Creating a new post...");
  const newPostData = {
    title: 'My New Post Title',
    body: 'This is the content of my new post.',
    userId: 1,
  };

  try {
    const response = await fetch(\`\${API_URL}/posts\`, {
      method: 'POST', // Specify the HTTP method
      headers: {
        // Tell the server we are sending JSON data
        'Content-Type': 'application/json; charset=UTF-8',
      },
      // The data to send, converted to a JSON string
      body: JSON.stringify(newPostData),
    });

    console.log("   Async POST Response:", response.status, response.statusText);

    if (!response.ok) {
      // Note: JSONPlaceholder might return 201 Created for POST
      // Often check for status >= 200 && status < 300
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }

    const createdPost = await response.json();
    console.log("   Async POST Response Data (Created Post):", createdPost);
    // JSONPlaceholder simulates creation and returns the object with a new ID (e.g., 101)

  } catch (error) {
    console.error("   Async POST Error:", error.message);
  }
}

createPost();
console.log("   Async POST initiated...");

// 4. Handling Different Response Types (e.g., Text)
console.log("\\n4. Fetching Text (async/await):");
async function fetchText() {
   console.log("   Async Fetch: Getting text data...");
   try {
      // Example: Fetching plain text (robots.txt often exists)
      const response = await fetch('/robots.txt'); // Requesting a local resource (may or may not exist)

      console.log("   Async Text Response:", response.status, response.statusText);

      if (!response.ok) {
         throw new Error(\`HTTP error! Status: \${response.status}\`);
      }

      const textData = await response.text(); // Use .text() for plain text
      console.log("   Async Text Data (first 100 chars):\\n", textData.substring(0, 100) + "...");

   } catch (error) {
      console.error("   Async Text Fetch Error:", error.message);
      console.warn("   (Note: /robots.txt might not exist in this environment, causing a 404 error)");
   }
}

// fetchText(); // Calling this might result in 404 in some environments
console.log("   (Skipping text fetch example in this run)");


console.log("\\n--- End of Fetch API examples ---");
// Note: Network requests are asynchronous, results will appear later.
`,
    aiPromptContent: `
### Fetch API
The Fetch API is the modern, standard way for web browsers (and Node.js environments with libraries like \`node-fetch\`) to make network requests. It replaces the older \`XMLHttpRequest\` object. Fetch is Promise-based, making it easy to use with \`.then()/.catch()\` or \`async/await\`.

**Basic Usage (\`fetch(url, options)\`)**

-   **\`url\`**: The URL of the resource you want to fetch.
-   **\`options\`** (optional): An object to configure the request. Common options include:
    -   \`method\`: The HTTP method (e.g., \`'GET'\` (default), \`'POST'\`, \`'PUT'\`, \`'DELETE'\`, \`'PATCH'\`).
    -   \`headers\`: An object containing request headers (e.g., \`{'Content-Type': 'application/json'}\`).
    -   \`body\`: The request body (e.g., for \`POST\` or \`PUT\`). Must be a string (often JSON.stringified data), \`FormData\`, \`URLSearchParams\`, etc.
    -   \`mode\`: Controls handling of cross-origin requests (e.g., \`'cors'\` (default), \`'no-cors'\`, \`'same-origin'\`).
    -   \`credentials\`: Controls whether cookies are sent (\`'include'\`, \`'same-origin'\` (default), \`'omit'\`).
    -   \`signal\`: An \`AbortSignal\` to allow aborting the request.

**The \`Response\` Object**

The \`fetch()\` function returns a Promise that resolves to a \`Response\` object. This object represents the *response* to the request, but **not** the actual data yet.

Key properties and methods of the \`Response\` object:

-   **`response.ok`**: A boolean indicating if the request was successful (HTTP status code 200-299). **Important:** Fetch *only* rejects its promise on network errors, not on HTTP error statuses (like 404 Not Found or 500 Internal Server Error). You *must* check \`response.ok\` or \`response.status\` manually.
-   **`response.status`**: The HTTP status code (e.g., 200, 404, 500).
-   **`response.statusText`**: The status message (e.g., "OK", "Not Found").
-   **`response.headers`**: A \`Headers\` object to access response headers.
-   **Methods to read the response body (these return Promises):**
    -   **`response.json()`**: Parses the body as JSON.
    -   **`response.text()`**: Reads the body as plain text.
    -   **`response.blob()`**: Reads the body as a \`Blob\` (binary data).
    -   **`response.formData()`**: Reads the body as \`FormData\`.
    -   **`response.arrayBuffer()`**: Reads the body as an \`ArrayBuffer\`.
    **You can only read the response body *once* per \`Response\` object.**

**Common Patterns:**

**1. GET Request with Promises:**
\`\`\`javascript
fetch('https://api.example.com/users/1')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json(); // Returns a promise
  })
  .then(data => {
    console.log('User data:', data);
  })
  .catch(error => {
    console.error('Fetch failed:', error);
  });
\`\`\`

**2. GET Request with \`async/await\`:**
\`\`\`javascript
async function getUser() {
  try {
    const response = await fetch('https://api.example.com/users/1');
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const data = await response.json(); // Wait for JSON parsing
    console.log('User data:', data);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
getUser();
\`\`\`

**3. POST Request with \`async/await\`:**
\`\`\`javascript
async function createUser(userData) {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData) // Convert JS object to JSON string
    });
    if (!response.ok) { // Check for 2xx status codes
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const createdUser = await response.json();
    console.log('User created:', createdUser);
  } catch (error) {
    console.error('POST request failed:', error);
  }
}
createUser({ name: 'New User', email: 'new@example.com' });
\`\`\`

The Fetch API is fundamental for interacting with web services and APIs in modern web development.
`,
  },
};

// Basic security measure: Function constructor alternative (slightly safer context)
// Wrap code execution in a try-catch to handle potential runtime errors within the evaluated code
const safeEval = (code: string) => {
    let output = '';
    const customConsole = {
        log: (...args: any[]) => {
            output += args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') + '\n';
        },
        clear: () => { output = '--- Console Cleared ---\n'; },
        error: (...args: any[]) => { output += `ERROR: ${args.map(String).join(' ')}\n`; },
        warn: (...args: any[]) => { output += `WARN: ${args.map(String).join(' ')}\n`; }
    };

    // Mock basic DOM structure for safety and functionality within eval
    const mockDocument = {
        body: {
            appendChild: (el: any) => {
                 // Simulate appending to body, maybe log it
                 customConsole.log(`[DOM] Appended <${el?.tagName || 'element'}> to body.`);
                 return el;
             },
             removeChild: (el: any) => {
                 customConsole.log(`[DOM] Removed <${el?.tagName || 'element'}> from body.`);
                 return el;
             },
             contains: () => true, // Assume it contains elements for cleanup simulation
        },
        getElementById: (id: string) => {
             customConsole.log(`[DOM] getElementById('${id}')`);
             // Return a mock element structure
             return {
                 id: id,
                 tagName: 'DIV', // Example tag name
                 style: {},
                 classList: { add: ()=>{}, remove: ()=>{} },
                 textContent: '',
                 appendChild: (el: any) => customConsole.log(`[DOM] Appended <${el?.tagName || 'element'}> to #${id}`),
                 removeChild: (el: any) => customConsole.log(`[DOM] Removed <${el?.tagName || 'element'}> from #${id}`),
                 insertBefore: (newEl: any, refEl: any) => customConsole.log(`[DOM] Inserted <${newEl?.tagName || 'element'}> before <${refEl?.tagName || 'element'}> in #${id}`),
                 addEventListener: (type: string, handler: Function) => {
                     customConsole.log(`[DOM] Added '${type}' listener to #${id}`);
                     // You could store handlers and simulate triggering them later if needed
                 },
                 removeEventListener: (type: string, handler: Function) => {
                     customConsole.log(`[DOM] Removed '${type}' listener from #${id}`);
                 },
                 // Add other common properties/methods as needed
             };
        },
        querySelector: (selector: string) => {
             customConsole.log(`[DOM] querySelector('${selector}')`);
             // Return a mock element similar to getElementById
             return {
                 // ... mock element properties ...
                 tagName: 'DIV', // Example
                 style: {},
                 classList: { add: ()=>{}, remove: ()=>{} },
                 textContent: '',
                 addEventListener: (type: string) => customConsole.log(`[DOM] Added '${type}' listener via querySelector`),
                 removeEventListener: (type: string) => customConsole.log(`[DOM] Removed '${type}' listener via querySelector`),
             };
        },
        querySelectorAll: (selector: string) => {
            customConsole.log(`[DOM] querySelectorAll('${selector}')`);
            return [{ /* mock element 1 */ }, { /* mock element 2 */ }]; // Return a mock NodeList (array-like)
        },
        createElement: (tagName: string) => {
            customConsole.log(`[DOM] createElement('${tagName}')`);
            return {
                tagName: tagName.toUpperCase(),
                id: '',
                className: '',
                textContent: '',
                style: {},
                classList: { add: (cls: string)=>{ customConsole.log(`[DOM] Added class ${cls}`); }, remove: (cls: string)=>{ customConsole.log(`[DOM] Removed class ${cls}`); } },
                appendChild: (el: any) => customConsole.log(`[DOM] Appended child to <${tagName}>`),
                setAttribute: (name: string, value: string) => customConsole.log(`[DOM] Set attribute ${name}="${value}" on <${tagName}>`),
                // ... other methods/properties
            };
        },
    };

      // Mock Fetch API
    const mockFetch = async (url: string, options?: RequestInit) => {
        customConsole.log(`[Fetch] Request to: ${url} | Method: ${options?.method || 'GET'}`);
        if (options?.body) {
            // Limit logged body length
            const bodySample = String(options.body).substring(0, 100);
            customConsole.log(`[Fetch] Body (sample): ${bodySample}${String(options.body).length > 100 ? '...' : ''}`);
        }

        // Simulate a generic successful JSON response for JSONPlaceholder POST
        if (url.includes('jsonplaceholder.typicode.com/posts') && options?.method === 'POST') {
             try {
                const requestBody = options.body ? JSON.parse(String(options.body)) : {};
                 return {
                    ok: true,
                    status: 201, // Created
                    statusText: 'Created',
                    headers: new Headers({'Content-Type': 'application/json'}),
                    json: async () => ({ id: 101, ...requestBody }), // Simulate adding an ID
                    text: async () => JSON.stringify({ id: 101, ...requestBody }),
                };
            } catch (e) {
                 // If parsing request body fails, simulate a client error
                 return {
                    ok: false,
                    status: 400,
                    statusText: 'Bad Request',
                    headers: new Headers({'Content-Type': 'application/json'}),
                    json: async () => ({ error: "Invalid JSON in request body" }),
                    text: async () => JSON.stringify({ error: "Invalid JSON in request body" }),
                 }
            }
        }

         // Simulate a successful JSON response for JSONPlaceholder GET /posts/1 or /posts/2
        if (url.match(/jsonplaceholder\.typicode\.com\/posts\/[12]$/) && (!options?.method || options.method === 'GET')) {
            const postId = url.endsWith('/1') ? 1 : 2;
            const fakePost = {
                userId: 1,
                id: postId,
                title: `Fake Title ${postId}`,
                body: `Fake body content for post ${postId}.`
            };
             return {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({'Content-Type': 'application/json'}),
                json: async () => fakePost,
                text: async () => JSON.stringify(fakePost),
            };
        }

        // Simulate a 404 for robots.txt (as it might not exist)
        if (url.endsWith('/robots.txt')) {
            return {
                 ok: false,
                 status: 404,
                 statusText: 'Not Found',
                 headers: new Headers({'Content-Type': 'text/plain'}),
                 json: async () => { throw new Error("Cannot parse Not Found as JSON"); }, // Correctly throw
                 text: async () => 'Resource not found.',
             };
        }


        // Default: Simulate a generic successful text response
        return {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Headers({'Content-Type': 'text/plain'}),
            json: async () => { throw new Error("Cannot parse text as JSON"); }, // Correctly throw
            text: async () => 'Mock response text.',
        };
    };


    const mockWindow = {
        document: mockDocument,
        fetch: mockFetch, // Add mocked fetch
        // Add other window properties if needed, e.g., setTimeout, localStorage (mocked)
        setTimeout: (fn: Function, ms: number) => setTimeout(fn, ms), // Use real setTimeout
        addEventListener: (type: string) => customConsole.log(`[Window] Added '${type}' listener`),
        removeEventListener: (type: string) => customConsole.log(`[Window] Removed '${type}' listener`),
    };


    try {
        // Inject mocks into the execution scope
        // Use 'async function' to allow top-level await within the evaluated code if needed.
        // Pass mocks as arguments to the Function constructor.
        const wrappedCode = `
            // Ensure 'use strict' if present in original code doesn't cause issues
            // (though Function constructor usually runs in non-strict unless specified)
            (async () => {
                try {
                   ${code}
                } catch(innerError) {
                    // Catch errors specifically from the user's code
                    console.error('User code error:', innerError.message);
                     // Optionally re-throw or handle differently
                    // throw innerError; // Re-throwing might be better for outer catch
                }
            })(); // Immediately invoke the async function
        `;

        // Pass mocks explicitly. Globals like 'window' or 'document' won't be
        // automatically available unless explicitly passed or defined within the code string.
        const func = new Function('console', 'document', 'window', 'fetch', wrappedCode);
        // Call the function, passing the mocked environment
        func(customConsole, mockDocument, mockWindow, mockFetch);

        // Since the wrapped code is now async, safeEval itself doesn't immediately
        // capture the final output if there are awaits.
        // For this basic sandbox, we return the synchronously captured output.
        // A more complex sandbox might need to await the inner async function.
        return { output: output || 'Code execution started (async operations may follow).', error: null };

    } catch (error: any) {
        // Catch errors during Function creation or synchronous parts of execution
        console.error("Error during safeEval setup or sync execution:", error);
        // Ensure any captured output is included along with the error message
        return { output: output, error: error.message || 'An unknown error occurred during execution setup.' };
    }
};


export default function LearnTopicPage() {
  const params = useParams();
  const topicId = params.topic as string;
  const topic = topicData[topicId];
  const { toast } = useToast();

  const [code, setCode] = useState<string>('');
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  useEffect(() => {
    if (topic) {
       setCode(topic.initialCode);
       setIsLoadingContent(true);
       // Simulate loading AI content or fetch it
       setTimeout(() => {
           setAiContent(topic.aiPromptContent);
           setIsLoadingContent(false);
       }, 300); // Simulate delay
       setRunOutput(null);
       setRunError(null);
       setExplanation(null);
    } else {
        setIsLoadingContent(false); // Ensure loading stops if topic not found
    }
    // Handle case where topic is not found? Maybe redirect or show 404
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]); // Rerun effect only when topicId changes

  if (!topic && !isLoadingContent) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold text-destructive">Topic Not Found</h1>
        <p className="text-muted-foreground mt-4">The learning topic "{topicId}" does not exist.</p>
        <Button asChild variant="link" className="mt-6">
          <Link href="/learn">
            <span className='inline-block'>&larr; Back to Learning Topics</span>
          </Link>
        </Button>
      </div>
    );
  }

   const handleRunCode = () => {
    setIsRunning(true);
    setRunOutput(null);
    setRunError(null);
    setExplanation(null); // Clear explanation when running code

    // Use setTimeout to allow UI update before blocking eval
    setTimeout(() => {
      // Clear previous async outputs immediately
      setRunOutput("Running code...");
      setRunError(null);

      const result = safeEval(code);

       // Update with synchronous results/errors first
      setRunOutput(result.output); // Display captured logs immediately
      setRunError(result.error);   // Display any synchronous error

      // We might need a more sophisticated way to capture async logs/errors
      // from the sandbox in the future. For now, rely on the injected console.log
      // and the initial synchronous return.

      setIsRunning(false); // Set running false after sync execution attempt

    }, 50); // Short delay is usually sufficient
  };


   const handleExplainCode = async () => {
      if (!code.trim()) {
          toast({ title: "Code Required", description: "Editor is empty.", variant: "destructive" });
          return;
      }
      setIsExplaining(true);
      setExplanation(null);
      setRunOutput(null); // Also clear run output
      setRunError(null);  // Also clear run error
      try {
          // Using explainCode flow for specific code explanation
          const result = await explainCode({ code: `Explain this specific JavaScript code snippet:\n\n${code}` });
          setExplanation(result.explanation);
      } catch (err: any) { // Catch specific error types if possible
          console.error("Error explaining code:", err);
          let description = "Could not get explanation from AI. Please try again.";
         // Check if the error message indicates a specific, potentially temporary issue
          if (err.message && (err.message.includes('503') || err.message.includes('overloaded') || err.message.includes('Service Unavailable'))) {
              description = "The AI model is temporarily unavailable or overloaded. Please try again in a few moments.";
          } else if (err.message && err.message.includes('API key not valid')) {
               description = "AI configuration error. Please check the API key.";
          }
          toast({ title: "Explanation Failed", description: description, variant: "destructive" });
           setExplanation(`Sorry, could not generate explanation: ${description}`); // Provide feedback in the explanation area too
      } finally {
          setIsExplaining(false);
      }
  };

    // Basic tab handling for the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      e.currentTarget.value = e.currentTarget.value.substring(0, start) + '  ' + e.currentTarget.value.substring(end);
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
    }
  };


  return (
    <div className="container py-12 md:py-16">
      {isLoadingContent || !topic ? ( // Show loader if loading or if topic is still null after loading attempt
          <div className="flex justify-center items-center min-h-[60vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary"/>
          </div>
      ) : (
      <>
        <div className="mb-10">
            <Link href="/learn" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
                <span className='inline-block'>&larr; Back to Topics</span>
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{topic.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{topic.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Content */}
          <Card className="lg:order-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> Explanation</CardTitle>
               {/* Potentially add AI query input here later */}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] lg:h-[600px] w-full rounded-md border p-4 bg-secondary/50">
                {/* Render markdown or formatted text here */}
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {aiContent || "Loading explanation..."}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Code Editor and Output */}
          <div className="lg:order-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Code Editor</CardTitle>
                <CardDescription>Try the code yourself! Modify and run it.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="// Your JavaScript code here..."
                  className="min-h-[250px] font-mono text-sm bg-secondary border rounded-md focus-visible:ring-accent resize-none"
                  spellCheck="false"
                />
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" onClick={handleExplainCode} disabled={isRunning || isExplaining}>
                         <span className="flex items-center">
                             <BrainCircuit className={`mr-2 h-4 w-4 ${isExplaining ? 'animate-pulse text-accent' : ''}`} />
                            Explain Code
                         </span>
                    </Button>
                    <Button size="sm" onClick={handleRunCode} disabled={isRunning || isExplaining} className="bg-accent hover:bg-accent/90">
                        <span className="flex items-center">
                            {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                            Run Code
                        </span>
                    </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 {/* Dynamically change title based on content */}
                <CardTitle>{explanation ? "AI Explanation Output" : "Console Output"}</CardTitle>
                <CardDescription>{explanation ? "AI analysis of the code in the editor." : "Results or errors from running the code."}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[150px] w-full rounded-md border bg-secondary p-3">
                  <pre className="text-sm whitespace-pre-wrap break-words">
                     {/* Loading States */}
                     {(isExplaining || isRunning) && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}

                     {/* Explanation Output */}
                     {explanation && !isExplaining && !isRunning && explanation}

                      {/* Code Run Output (only if not explaining and not running) */}
                     {!explanation && !isExplaining && !isRunning && runOutput && <code className="text-foreground">{runOutput}</code>}

                     {/* Code Run Error (only if not explaining and not running) */}
                     {!explanation && !isExplaining && !isRunning && runError && <code className="text-destructive">{`Error: ${runError}`}</code>}

                      {/* Initial/Empty State */}
                     {!explanation && !isExplaining && !isRunning && !runOutput && !runError && (
                        <span className="text-muted-foreground">Run code or ask for explanation to see output.</span>
                     )}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
      )}
    </div>
  );
}

    