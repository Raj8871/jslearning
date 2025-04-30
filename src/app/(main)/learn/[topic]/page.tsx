'use client'

// src/app/(main)/learn/[topic]/page.tsx
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Play, Loader2, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { explainCode } from '@/ai/flows/explain-code'; // Use existing explain flow
import { useToast } from '@/hooks/use-toast';

// Mock data for topics - In a real app, this would come from a database or CMS
const topicData: Record<string, { title: string; description: string; initialCode: string; aiPromptContent: string }> = {
  variables: {
    title: 'Variables & Data Types',
    description: 'Learn how to declare variables using var, let, and const, and understand JavaScript\'s fundamental data types.',
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

- **\`var\`**: Used in older JavaScript versions. Variables declared with \`var\` have function scope or global scope, and they can be re-declared and updated. It's generally recommended to avoid \`var\` in modern JavaScript.
- **\`let\`**: Introduced in ES6 (ECMAScript 2015). Variables declared with \`let\` have block scope (scope limited to the \`{\`...\`}\` block they are defined in). They can be updated but not re-declared within the same scope.
- **\`const\`**: Also introduced in ES6. Variables declared with \`const\` also have block scope. They must be initialized with a value when declared, and they cannot be reassigned or re-declared. However, if the constant is an object or array, its properties or elements can be modified.

### Data Types
JavaScript has several primitive data types:
- **String**: Represents textual data (e.g., \`"hello"\`).
- **Number**: Represents numeric data, including integers and floating-point numbers (e.g., \`42\`, \`3.14\`). JavaScript has a special numeric value \`NaN\` (Not-a-Number).
- **Boolean**: Represents logical values: \`true\` or \`false\`.
- **Null**: Represents the intentional absence of any object value. It's a primitive value, but \`typeof null\` surprisingly returns \`"object"\`.
- **Undefined**: Represents a variable that has been declared but not assigned a value.
- **Symbol**: (ES6) Represents a unique and immutable identifier.
- **BigInt**: (ES2020) Represents integers with arbitrary precision, larger than the maximum safe integer for Numbers.

JavaScript also has a complex data type:
- **Object**: Represents collections of key-value pairs (properties) or more complex entities. Arrays, Functions, Dates, etc., are all types of objects in JavaScript.

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
  // Add more topics here (loops, objects, arrays, dom, es6) following the same structure
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
    - \`initialization\`: Executed once before the loop starts (e.g., \`let i = 0\`).
    - \`condition\`: Evaluated before each iteration. If \`true\`, the loop continues; if \`false\`, it stops.
    - \`final-expression\`: Executed at the end of each iteration (e.g., \`i++\`).

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
-   **\`forEach(callbackFn)\`**: Executes a provided function once for each array element.
-   **\`map(callbackFn)\`**: Creates a new array populated with the results of calling a provided function on every element.
-   **\`filter(callbackFn)\`**: Creates a new array with all elements that pass the test implemented by the provided function.
-   **\`reduce(callbackFn, initialValue)\`**: Executes a reducer function on each element, resulting in a single output value.
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
        initialCode: `<!-- You need HTML to interact with! -->
<!-- Imagine this HTML exists: -->
<!--
<div id="container">
  <h1 class="title">Hello World</h1>
  <p>This is a paragraph.</p>
  <button id="myButton">Click Me</button>
  <ul id="list">
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
-->

// --- Selecting Elements ---
console.log("--- Selecting ---");
const container = document.getElementById("container");
console.log("Container by ID:", container);

const title = document.querySelector(".title"); // Selects the first element with class 'title'
console.log("Title by querySelector:", title);

const listItems = document.querySelectorAll("#list li"); // Selects all <li> inside #list
console.log("List items by querySelectorAll:", listItems); // Returns a NodeList

const button = document.getElementById("myButton"); // Select button for later use

// --- Modifying Elements ---
console.log("\\n--- Modifying ---");
if (title) {
  title.textContent = "Hello JavaScript!"; // Change text content
  title.style.color = "blue"; // Change inline style
  title.classList.add("highlight"); // Add a CSS class (assuming 'highlight' class is defined in CSS)
  title.classList.remove("title"); // Remove a CSS class
}

// --- Creating and Appending Elements ---
console.log("\\n--- Creating & Appending ---");
const newItem = document.createElement("li"); // Create a new <li> element
newItem.textContent = "New Item 3"; // Set its text

const list = document.getElementById("list");
if (list) {
  list.appendChild(newItem); // Add the new item to the end of the list
}

const newParagraph = document.createElement("p");
newParagraph.textContent = "This paragraph was added by JS.";
if (container) {
    // Insert before the button
    container.insertBefore(newParagraph, button);
}


// --- Removing Elements ---
console.log("\\n--- Removing ---");
if (list && listItems.length > 0) {
   // Remove the first list item (index 0) if it exists
   // list.removeChild(listItems[0]);
   // console.log("Removed first list item.");
}


// --- Event Handling ---
console.log("\\n--- Event Handling ---");
if (button) {
  button.addEventListener("click", function() {
    alert("Button clicked!");
    // You can change element styles or content here too
    if(container) container.style.backgroundColor = "#e0f7fa";
  });

  // You can add multiple listeners
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "lightgreen";
  });
   button.addEventListener("mouseout", () => {
    button.style.backgroundColor = ""; // Reset style
  });
}

// NOTE: This code won't run correctly here as there's no HTML page.
// You'd run this in a browser's console on a page with the example HTML.
console.warn("NOTE: DOM manipulation examples require an HTML page to work correctly.");
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
    -   `eventName`: The type of event (e.g., \`'click'\`, \`'mouseover'\`, \`'keydown'\`).
    -   `function(event)`: The function to execute when the event occurs. The optional \`event\` object contains details about the event.
-   \`element.removeEventListener('eventName', functionReference)\`: Removes a previously added listener. Requires a reference to the *exact same function* used in \`addEventListener\`.

**Important Note:** The code editor here cannot directly interact with an HTML page. To see DOM manipulation work, you need to run the JavaScript code within an HTML file loaded in a web browser or use the browser's developer console on a webpage.
`,
  },
  es6: {
    title: 'ES6+ Features',
    description: 'Explore modern JavaScript enhancements like let/const, arrow functions, Promises, async/await, destructuring, and more.',
    initialCode: `// --- let and const (Block Scope) ---
// Already covered in 'Variables', but essential ES6
if (true) {
  let blockLet = "Visible only here";
  const blockConst = "Also only here";
  var blockVar = "Visible outside (function/global scope)";
}
// console.log(blockLet); // ReferenceError
// console.log(blockConst); // ReferenceError
console.log("blockVar:", blockVar); // Works

// --- Arrow Functions ---
// Already covered in 'Functions', concise syntax and lexical 'this'
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
const person = { firstName: "Bob", age: 35 };
const { firstName, age } = person;
console.log("Name:", firstName, "| Age:", age);

// Array Destructuring
const colors = ["red", "green", "blue"];
const [firstColor, secondColor] = colors;
console.log("Colors:", firstColor, secondColor);

// --- Default Parameters ---
// Covered in 'Functions'
function multiply(a, b = 1) { // b defaults to 1
  return a * b;
}
console.log("\\n--- Default Parameters ---");
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
const combined = [...arr1, 0, ...arr2]; // Combine arrays
console.log("Combined array:", combined);

const obj1 = { a: 1 };
const obj2 = { b: 2 };
const mergedObj = { ...obj1, ...obj2, c: 3 }; // Merge objects (ES2018)
console.log("Merged object:", mergedObj);

// --- Promises (Handling Asynchronous Operations) ---
console.log("\\n--- Promises ---");
const myPromise = new Promise((resolve, reject) => {
  const success = Math.random() > 0.3; // Simulate async success/failure
  setTimeout(() => {
    if (success) {
      resolve("Data fetched successfully!");
    } else {
      reject("Error fetching data.");
    }
  }, 500); // Simulate 0.5s delay
});

myPromise
  .then(data => { // Handle success
    console.log("Promise resolved:", data);
  })
  .catch(error => { // Handle failure
    console.log("Promise rejected:", error);
  })
  .finally(() => { // Runs regardless of success/failure (ES2018)
    console.log("Promise finished.");
  });

// --- async/await (Syntactic Sugar for Promises - ES2017) ---
console.log("\\n--- async/await ---");
async function fetchData() {
  console.log("Fetching data using async/await...");
  try {
    // 'await' pauses execution until the promise settles
    const data = await myPromise; // Re-using the promise from above
    console.log("Async/await success:", data);
    return data; // Async functions implicitly return a Promise
  } catch (error) {
    console.log("Async/await error:", error);
    // Handle error or re-throw
  }
}

fetchData(); // Call the async function

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
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak(); // Output: Rex barks.
console.log("Dog's breed:", dog.breed);

// Note: async/await requires the context (like this IIFE) to work top-level in older environments
// (async () => { await fetchData(); })();
`,
    aiPromptContent: `
### ES6+ Features (Modern JavaScript)
ECMAScript (ES) is the standard that JavaScript is based on. Starting with ES6 (ECMAScript 2015), new versions with significant features are released annually. These features make JavaScript more powerful, readable, and efficient.

**Key ES6 (2015) Features:**

-   **\`let\` and \`const\`**: Block-scoped variable declarations, replacing the need for \`var\` in most cases.
-   **Arrow Functions**: Concise syntax for functions, with lexical \`this\` binding. \`(params) => expression\` or \`(params) => { statements }\`.
-   **Template Literals**: String interpolation using backticks (\`), allowing embedded expressions (\`\${expression}\`) and multi-line strings.
-   **Destructuring Assignment**: Easily extract values from arrays or properties from objects into distinct variables.
    -   Object: \`const { name, age } = person;\`
    -   Array: \`const [first, second] = myArray;\`
-   **Default Parameters**: Define default values for function parameters: \`function greet(name = "Guest") { ... }\`.
-   **Rest Parameter**: Collects an indefinite number of arguments into an array within a function definition: \`function sum(...numbers) { ... }\`.
-   **Spread Operator**: Expands an iterable (like an array or string) into individual elements, useful for function calls, array literals, or object literals (ES2018+). \`const combined = [...arr1, ...arr2];\` \`myFunction(...args);\`.
-   **Classes**: Syntactic sugar over JavaScript's existing prototypal inheritance, providing a clearer syntax for creating constructor functions and handling inheritance (\`class MyClass { constructor() {} method() {} }\`, \`extends\`, \`super\`).
-   **Modules**: Native support for modular code using \`import\` and \`export\` statements, allowing better organization and code reuse (primarily used with build tools or in modern browsers/Node.js).
-   **Promises**: A standard way to handle asynchronous operations, representing a value that may be available now, or in the future, or never. They improve upon callback-based patterns (\`new Promise((resolve, reject) => { ... })\`, \`.then()\`, \`.catch()\`).
-   **Symbols**: A primitive data type creating unique identifiers, often used for object property keys to avoid naming collisions.
-   **Iterators and Generators**: Protocols for defining standard ways to produce sequences of values.

**Key Later Features (ES2016+):**

-   **Exponentiation Operator (\`**\`):** \`2 ** 3\` is 8 (ES2016).
-   **`Array.prototype.includes()`**: Checks if an array contains a value (ES2016).
-   **`async`/`await`**: Syntactic sugar built on top of Promises, making asynchronous code look and behave more like synchronous code, improving readability (ES2017).
    -   `async` keyword before a function declaration makes it return a Promise.
    -   `await` keyword can be used inside an `async` function to pause execution until a Promise settles.
-   **`Object.values()` / `Object.entries()`**: Get arrays of object values or [key, value] pairs (ES2017).
-   **Rest/Spread Properties for Objects**: Use \`...\` for gathering remaining object properties or spreading properties into new objects (ES2018).
-   **`Promise.prototype.finally()`**: Executes code when a Promise is settled (either resolved or rejected) (ES2018).
-   **Optional Chaining (`?.`)**: Safely access nested object properties without causing errors if an intermediate property is \`null\` or \`undefined\` (ES2020). \`user?.address?.street\`.
-   **Nullish Coalescing Operator (`??`)**: Provides a default value only when the left-hand operand is \`null\` or \`undefined\` (unlike \`||\` which triggers on any falsy value) (ES2020). \`value ?? defaultValue\`.
-   *...and many more ongoing improvements.*

Modern JavaScript relies heavily on these features. Run the examples to see them in action! Note that Promises and async/await handle operations that don't complete instantly.
`,
  },
};

// Basic security measure: Function constructor alternative (slightly safer context)
const safeEval = (code: string) => {
  try {
    let output = '';
    const customConsole = {
      log: (...args: any[]) => {
        output += args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') + '\n';
      },
       error: (...args: any[]) => { output += `ERROR: ${args.map(String).join(' ')}\n`; },
       warn: (...args: any[]) => { output += `WARN: ${args.map(String).join(' ')}\n`; }
    };
    const func = new Function('console', code);
    func(customConsole);
    return { output: output || 'Code executed successfully (no console output).', error: null };
  } catch (error: any) {
    console.error("Execution Error:", error);
    return { output: null, error: error.message || 'An unknown error occurred.' };
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
    }
    // Handle case where topic is not found? Maybe redirect or show 404
  }, [topicId, topic]);

  if (!topic && !isLoadingContent) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold text-destructive">Topic Not Found</h1>
        <p className="text-muted-foreground mt-4">The learning topic "{topicId}" does not exist.</p>
        <Button asChild variant="link" className="mt-6">
          <Link href="/learn">Back to Learning Topics</Link>
        </Button>
      </div>
    );
  }

   const handleRunCode = () => {
    setIsRunning(true);
    setRunOutput(null);
    setRunError(null);
    setTimeout(() => {
      const result = safeEval(code);
      setRunOutput(result.output);
      setRunError(result.error);
      setIsRunning(false);
    }, 300);
  };

   const handleExplainCode = async () => {
      if (!code.trim()) {
          toast({ title: "Code Required", description: "Editor is empty.", variant: "destructive" });
          return;
      }
      setIsExplaining(true);
      setExplanation(null);
      try {
          // Using explainCode flow for specific code explanation
          const result = await explainCode({ code: `Explain this specific code snippet:\n\n${code}` });
          setExplanation(result.explanation);
      } catch (err) {
          console.error("Error explaining code:", err);
          toast({ title: "Explanation Failed", variant: "destructive" });
           setExplanation("Sorry, could not generate explanation.");
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
      {isLoadingContent ? (
          <div className="flex justify-center items-center min-h-[60vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary"/>
          </div>
      ) : (
      <>
        <div className="mb-10">
            <Link href="/learn" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
                {/* Wrap text in a span */}
                <span>&larr; Back to Topics</span>
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
                         <BrainCircuit className={`mr-2 h-4 w-4 ${isExplaining ? 'animate-pulse text-accent' : ''}`} />
                        Explain Code
                    </Button>
                    <Button size="sm" onClick={handleRunCode} disabled={isRunning || isExplaining} className="bg-accent hover:bg-accent/90">
                        {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                        Run Code
                    </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{explanation ? "AI Explanation Output" : "Console Output"}</CardTitle>
                <CardDescription>{explanation ? "AI analysis of the code in the editor." : "Results or errors from running the code."}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[150px] w-full rounded-md border bg-secondary p-3">
                  <pre className="text-sm whitespace-pre-wrap break-words">
                     {isExplaining && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                     {explanation && !isExplaining && explanation}
                     {!explanation && isRunning && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                     {!explanation && !isRunning && runOutput && <code className="text-foreground">{runOutput}</code>}
                     {!explanation && !isRunning && runError && <code className="text-destructive">{`Error: ${runError}`}</code>}
                     {!explanation && !isRunning && !runOutput && !runError && !isExplaining && (
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
