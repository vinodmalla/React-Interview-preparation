import { useState } from "react";

const questions = [
  // ═══════════════════════════════════════
  // JAVASCRIPT
  // ═══════════════════════════════════════
  {
    section: "JavaScript",
    topic: "Core JS",
    level: "Basic",
    q: "What is the difference between var, let, and const?",
    a: `Think of it like this:
• var   = old school, careless (avoid it)
• let   = modern, can change later
• const = modern, cannot reassign

var problems:
1. Function-scoped (not block-scoped)
2. Gets hoisted and set to undefined
3. Can be re-declared (confusing!)

if (true) {
  var x = 10;   // leaks outside the block!
  let y = 20;   // stays inside block ✅
  const z = 30; // stays inside block ✅
}
console.log(x); // 10 😱
console.log(y); // ReferenceError ✅

const rules:
const user = { name: "Vinod" };
user.name = "Kumar"; // ✅ object contents can change
user = {};           // ❌ can't reassign the variable itself

💬 Interview line: "I never use var — let for changeable values, const for everything else. const doesn't mean immutable for objects, just no reassignment."`,
  },
  {
    section: "JavaScript",
    topic: "Core JS",
    level: "Basic",
    q: "What is Hoisting in JavaScript?",
    a: `Hoisting = JavaScript moves declarations to the TOP of their scope before code runs.

Think of it like: JS reads your code twice.
First pass → collects all declarations.
Second pass → runs the code.

var hoisting:
console.log(name); // undefined (not error!)
var name = "Vinod";
// JS sees this as:
// var name;          ← hoisted
// console.log(name); // undefined
// name = "Vinod";

let/const hoisting (Temporal Dead Zone):
console.log(age); // ❌ ReferenceError
let age = 25;
// let IS hoisted but NOT initialized → TDZ

Function hoisting:
greet(); // ✅ works! entire function is hoisted
function greet() { console.log("Hello"); }

Arrow functions:
greet(); // ❌ TypeError
const greet = () => console.log("Hello");

💬 Interview line: "var hoists and initializes to undefined. let/const hoist but stay in Temporal Dead Zone — that's why accessing them before declaration throws an error."`,
  },
  {
    section: "JavaScript",
    topic: "Core JS",
    level: "Basic",
    q: "What is the difference between == and ===?",
    a: `== (Loose equality) → compares values AFTER type conversion
=== (Strict equality) → compares value AND type (no conversion)

Examples:
0 == false    // true  (false converts to 0)
0 === false   // false (different types)

"5" == 5      // true  (string converts to number)
"5" === 5     // false (different types)

null == undefined   // true  (special case)
null === undefined  // false

[] == false   // true  (weird JS coercion)
[] === false  // false

Simple rule: ALWAYS use ===
The only valid == use: checking null OR undefined together:
if (value == null) { } // catches both null and undefined

💬 Interview line: "I always use === to avoid JS type coercion surprises. The only time I use == is checking for null-or-undefined in one shot."`,
  },
  {
    section: "JavaScript",
    topic: "Closures & Scope",
    level: "Intermediate",
    q: "What is a Closure? Give a real-world example.",
    a: `Closure = a function that REMEMBERS the variables from its outer scope even after that outer function has finished running.

Simple analogy: 
A backpack 🎒 — when a function is created, it packs the variables around it and carries them wherever it goes.

Example:
function makeCounter() {
  let count = 0; // outer variable

  return function() { // inner function = closure
    count++;         // remembers 'count' from outer scope
    return count;
  };
}

const counter = makeCounter(); // outer function done
counter(); // 1  ← still remembers count!
counter(); // 2
counter(); // 3

Real-world use cases:
1. Data privacy (private variables)
2. Event handlers remembering data
3. setTimeout/setInterval callbacks
4. Memoization / caching
5. React's useState internally uses closures

function greet(greeting) {
  return (name) => \`\${greeting}, \${name}!\`; // closure
}
const sayHi = greet("Hello");
sayHi("Vinod"); // "Hello, Vinod!"

💬 Interview line: "Closures let inner functions access outer variables even after the outer function exits. I use them for data encapsulation and in React hooks — useState relies on closures."`,
  },
  {
    section: "JavaScript",
    topic: "Closures & Scope",
    level: "Intermediate",
    q: "Explain the Event Loop in JavaScript.",
    a: `JS is single-threaded = can do ONE thing at a time.

But it handles async tasks without blocking. HOW? The Event Loop.

The 3 key players:
1. Call Stack     — where code runs (LIFO)
2. Web APIs       — browser handles timers, fetch, DOM events
3. Callback Queue — completed async tasks wait here

How it works:
1. console.log("start")   → goes to Call Stack → runs
2. setTimeout(fn, 1000)   → goes to Web API → timer starts
3. console.log("end")     → goes to Call Stack → runs
4. Timer done             → fn moves to Callback Queue
5. Call Stack is EMPTY    → Event Loop picks fn → runs it

Output:
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("end");

Result: start → end → promise → timeout

WHY? Promises use Microtask Queue (higher priority than Callback Queue)
Microtask Queue empties BEFORE Callback Queue.

💬 Interview line: "JS is single-threaded but non-blocking because the Event Loop moves async callbacks to the call stack only when it's empty. Microtasks like Promises run before macrotasks like setTimeout."`,
  },
  {
    section: "JavaScript",
    topic: "Closures & Scope",
    level: "Intermediate",
    q: "What is 'this' keyword in JavaScript?",
    a: `'this' = refers to the object that is CALLING the function.
The value of 'this' depends on HOW the function is called, not where it's written.

1. Global context:
console.log(this); // window (browser) / global (Node)

2. Object method:
const user = {
  name: "Vinod",
  greet() { console.log(this.name); } // 'this' = user object
};
user.greet(); // "Vinod"

3. Regular function (not method):
function show() { console.log(this); } // window or undefined (strict mode)

4. Arrow function:
Arrow functions DON'T have their own 'this' — they inherit from parent scope.
const obj = {
  name: "Vinod",
  greet: () => console.log(this.name) // ❌ 'this' = window, not obj
};

5. Explicit binding:
greet.call(user);   // sets this = user
greet.apply(user);  // same, but args as array
const bound = greet.bind(user); // returns new function

💬 Interview line: "Arrow functions don't bind their own 'this' — that's why I use them inside class methods and React components to avoid losing context."`,
  },
  {
    section: "JavaScript",
    topic: "Async JS",
    level: "Intermediate",
    q: "What is a Promise? What are its states?",
    a: `A Promise = an object representing a value that will be available in the FUTURE.

Analogy: Restaurant order receipt 🧾
You order food → get a receipt (promise) → either food arrives (resolved) or kitchen says unavailable (rejected)

3 States:
• Pending   → waiting, not done yet
• Fulfilled → success, value is ready
• Rejected  → failed, error occurred

Creating a Promise:
const fetchData = new Promise((resolve, reject) => {
  if (success) resolve(data);   // fulfilled
  else reject(new Error("Fail")); // rejected
});

Using a Promise:
fetchData
  .then(data => console.log(data))    // success handler
  .catch(err => console.log(err))     // error handler
  .finally(() => setLoading(false));  // always runs

Promise methods:
Promise.all([p1, p2, p3])     // wait for ALL, fail if any fails
Promise.allSettled([p1, p2])  // wait for ALL, never fails
Promise.race([p1, p2])        // first one wins
Promise.any([p1, p2])         // first SUCCESS wins

💬 Interview line: "I prefer async/await over .then() chains for readability, but I use Promise.all when I need multiple API calls to run in parallel — like fetching user and their orders together."`,
  },
  {
    section: "JavaScript",
    topic: "Async JS",
    level: "Intermediate",
    q: "What is async/await? How is it different from Promises?",
    a: `async/await = syntactic sugar on top of Promises. Makes async code LOOK like synchronous code.

With Promises (.then chain):
fetch('/api/user')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));

Same thing with async/await:
async function getUser() {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

Rules:
• async function always returns a Promise
• await pauses execution until Promise resolves
• await only works INSIDE async function

Common mistake — sequential vs parallel:
// ❌ Sequential (slow — waits one by one)
const user = await fetchUser();
const posts = await fetchPosts();

// ✅ Parallel (fast — runs together)
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);

💬 Interview line: "async/await is just cleaner Promise syntax — same behavior. For multiple independent API calls I use Promise.all to run them in parallel and cut total wait time."`,
  },
  {
    section: "JavaScript",
    topic: "Core JS",
    level: "Intermediate",
    q: "What is Prototypal Inheritance in JavaScript?",
    a: `In JS, every object has a hidden link called __proto__ pointing to another object (its prototype). This chain is how JS looks up properties.

Analogy: Family inheritance 👨‍👩‍👦
Child looks for something → not found → looks at parent → not found → grandparent...

Example:
const animal = {
  breathe() { return "breathing..."; }
};

const dog = Object.create(animal); // dog's prototype = animal
dog.bark = () => "Woof!";

dog.bark();    // ✅ own method
dog.breathe(); // ✅ found on prototype (animal)

With classes (modern syntax — still uses prototypes under the hood):
class Animal {
  breathe() { return "breathing"; }
}
class Dog extends Animal {
  bark() { return "Woof!"; }
}

const d = new Dog();
d.bark();    // own
d.breathe(); // inherited

💬 Interview line: "JavaScript uses prototypal inheritance — class syntax is just cleaner syntax over the same prototype chain. When a property isn't found on an object, JS walks up the chain until it reaches null."`,
  },
  {
    section: "JavaScript",
    topic: "Core JS",
    level: "Intermediate",
    q: "What is the difference between call, apply, and bind?",
    a: `All 3 let you set 'this' manually for a function.

call → invoke immediately, args passed ONE BY ONE
apply → invoke immediately, args passed as ARRAY
bind → returns a NEW function with 'this' fixed (doesn't call immediately)

function greet(city, country) {
  console.log(\`\${this.name} from \${city}, \${country}\`);
}
const user = { name: "Vinod" };

greet.call(user, "Hyderabad", "India");
// "Vinod from Hyderabad, India"

greet.apply(user, ["Hyderabad", "India"]);
// "Vinod from Hyderabad, India"

const boundGreet = greet.bind(user, "Hyderabad");
boundGreet("India"); // call later with remaining args
// "Vinod from Hyderabad, India"

Memory trick:
• call  = Comma separated args
• apply = Array args
• bind  = Brings back a new function

💬 Interview line: "I mostly use bind for event handlers or React class methods where I need to fix 'this'. In modern code, arrow functions usually replace the need for bind."`,
  },
  {
    section: "JavaScript",
    topic: "ES6+",
    level: "Intermediate",
    q: "What is Destructuring? What is Spread vs Rest operator?",
    a: `Destructuring = unpack values from arrays/objects into variables.

Array destructuring:
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3,4,5]

Object destructuring:
const { name, age, city = "Hyderabad" } = user; // default value too
const { name: userName } = user; // rename while destructuring

Spread operator (...) = EXPAND
// Expand array:
const newArr = [...arr1, ...arr2];

// Expand object (shallow copy):
const updated = { ...user, age: 26 }; // override age

// Pass array as args:
Math.max(...[1, 2, 3]); // = Math.max(1, 2, 3)

Rest operator (...) = COLLECT remaining
function sum(first, ...others) { // collect remaining args
  return first + others.reduce((a, b) => a + b, 0);
}

Same symbol (...), different use:
• Spread → EXPANDS into individual items
• Rest → COLLECTS multiple items into one

💬 Interview line: "I use spread for shallow cloning objects and arrays — especially in Redux reducers to return new state objects without mutating the original."`,
  },
  {
    section: "JavaScript",
    topic: "ES6+",
    level: "Intermediate",
    q: "What are Arrow Functions? Key differences from regular functions?",
    a: `Arrow function = shorter function syntax introduced in ES6.

Regular function:
function add(a, b) { return a + b; }

Arrow function:
const add = (a, b) => a + b; // implicit return for single expression

Key differences:

1. 'this' binding:
Regular function → has its OWN 'this' (dynamic)
Arrow function   → inherits 'this' from PARENT scope (lexical)

class Timer {
  start() {
    setTimeout(function() {
      console.log(this); // ❌ undefined in strict mode
    }, 1000);

    setTimeout(() => {
      console.log(this); // ✅ Timer instance (arrow inherits)
    }, 1000);
  }
}

2. No 'arguments' object:
function fn() { console.log(arguments); } // works
const fn = () => { console.log(arguments); } // ❌ error

3. Cannot be used as constructor:
const Fn = () => {};
new Fn(); // ❌ TypeError

💬 Interview line: "I use arrow functions everywhere in React — callbacks, array methods, useEffect. Their lexical 'this' avoids context bugs without needing .bind()."`,
  },
  {
    section: "JavaScript",
    topic: "ES6+",
    level: "Intermediate",
    q: "What is Event Delegation?",
    a: `Event Delegation = attach ONE event listener to a PARENT instead of attaching many listeners to each child.

WHY: If you have 1000 list items, adding 1000 listeners is slow. Add ONE to the parent.

Works because of Event Bubbling:
When you click a child element → event bubbles UP through all parents.

// ❌ Bad — 1000 listeners for 1000 items
items.forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ Good — 1 listener on parent
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('Clicked:', e.target.textContent);
  }
});

e.target = the element that was ACTUALLY clicked
e.currentTarget = element the listener is attached to

Benefits:
✅ Better performance
✅ Works for dynamically added elements too (great for React lists)
✅ Less memory usage

💬 Interview line: "Event delegation is perfect for dynamic lists — I attach one handler to the parent and use e.target to check which child was clicked."`,
  },
  {
    section: "JavaScript",
    topic: "ES6+",
    level: "Advanced",
    q: "What is Debouncing and Throttling? When to use each?",
    a: `Both control HOW OFTEN a function runs for frequent events (scroll, resize, keypress).

Debouncing = wait until the user STOPS for X ms, THEN run.
Good for: search input (don't hit API on every keystroke)

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);          // cancel previous timer
    timer = setTimeout(() => fn(...args), delay); // restart timer
  };
}

const search = debounce((query) => fetchAPI(query), 500);
// Runs 500ms AFTER user stops typing

Throttling = run at most once every X ms, regardless of how many times triggered.
Good for: scroll handler, window resize, button spam

function throttle(fn, limit) {
  let lastRun = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn(...args);
    }
  };
}

const onScroll = throttle(handleScroll, 200);
// Runs at most once every 200ms while scrolling

Memory trick:
• Debounce = waits for SILENCE (search box)
• Throttle = allows ONE shot per interval (scroll/resize)

💬 Interview line: "In RideTogether I debounced the location search input — saved API calls from firing on every keystroke. For scroll-based map updates I used throttle."`,
  },
  {
    section: "JavaScript",
    topic: "ES6+",
    level: "Advanced",
    q: "What is Memoization?",
    a: `Memoization = cache the result of a function call and return cached result for same inputs next time.

Like a calculator that remembers past calculations.

Without memoization (slow for heavy calculations):
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // recalculates every time
}

With memoization:
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      console.log("Cache hit!");
      return cache[key]; // return cached result
    }
    cache[key] = fn(...args); // calculate and store
    return cache[key];
  };
}

const memoFactorial = memoize(factorial);
memoFactorial(10); // calculates
memoFactorial(10); // returns cached ✅

In React:
• useMemo   = memoizes a computed value
• useCallback = memoizes a function
• React.memo = memoizes a component's render

💬 Interview line: "Memoization trades memory for speed. In React, useMemo prevents expensive recalculations on every render — I use it for filtered/sorted lists with large datasets."`,
  },
  {
    section: "JavaScript",
    topic: "ES6+",
    level: "Advanced",
    q: "What is the difference between shallow copy and deep copy?",
    a: `Shallow copy = copies the top-level properties only.
Nested objects are still SHARED (same reference).

Deep copy = copies EVERYTHING, including nested objects.
Completely independent copy.

Shallow copy methods:
const copy1 = { ...original };       // spread
const copy2 = Object.assign({}, original);
const copy3 = [...arr];               // for arrays

Problem:
const original = { name: "Vinod", address: { city: "Hyderabad" } };
const shallow = { ...original };

shallow.name = "Kumar";        // ✅ doesn't affect original
shallow.address.city = "Delhi"; // ❌ affects original! (shared reference)

Deep copy methods:
// Method 1 — JSON (simple, but loses functions/dates/undefined)
const deep = JSON.parse(JSON.stringify(original));

// Method 2 — structuredClone (modern, handles more types)
const deep2 = structuredClone(original);

// Method 3 — lodash cloneDeep (most reliable)
import cloneDeep from 'lodash/cloneDeep';
const deep3 = cloneDeep(original);

💬 Interview line: "In Redux reducers I use spread for shallow copies of state. For deeply nested state I use structuredClone or Immer — which is what Redux Toolkit uses under the hood."`,
  },

  // ═══════════════════════════════════════
  // HTML5
  // ═══════════════════════════════════════
  {
    section: "HTML5",
    topic: "Semantics",
    level: "Basic",
    q: "What are Semantic HTML elements? Why do they matter?",
    a: `Semantic HTML = elements that clearly describe their meaning/purpose.

Non-semantic (meaningless):
<div id="header">...</div>
<div id="nav">...</div>
<div id="content">...</div>

Semantic (meaningful):
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<section>...</section>
<aside>...</aside>
<footer>...</footer>
<figure> + <figcaption>
<time datetime="2024-01-01">January 1</time>

Why it matters:
1. SEO → search engines understand page structure better
2. Accessibility → screen readers navigate by landmarks (header, nav, main)
3. Readability → devs understand code faster
4. Browser defaults → some semantics apply built-in styles/behaviors

In React: semantic HTML still applies inside JSX. Use <button> not <div onClick> for interactive elements.

💬 Interview line: "I always use semantic HTML — it's free SEO and accessibility. Using a div as a button is an anti-pattern because it breaks keyboard navigation and screen readers."`,
  },
  {
    section: "HTML5",
    topic: "APIs & Features",
    level: "Basic",
    q: "What are new HTML5 form input types and attributes?",
    a: `HTML5 added new input types with BUILT-IN validation (no JS needed).

New input types:
<input type="email" />    // validates email format
<input type="number" />   // number spinner
<input type="url" />      // validates URL
<input type="date" />     // date picker
<input type="time" />     // time picker
<input type="range" />    // slider
<input type="color" />    // color picker
<input type="search" />   // search box with X button
<input type="tel" />      // telephone number

New attributes:
placeholder="Enter name"   // hint text
required                   // can't submit if empty
autofocus                  // auto-focus on load
min="0" max="100"          // for number/range
pattern="[A-Za-z]{3}"     // regex validation
autocomplete="off"         // disable autocomplete
multiple                   // multiple values (file, email)

<datalist> for autocomplete suggestions:
<input list="cities" />
<datalist id="cities">
  <option value="Hyderabad" />
  <option value="Mumbai" />
</datalist>

💬 Interview line: "HTML5 input types handle basic validation natively — but for complex forms I still use validation libraries like Yup with React Hook Form."`,
  },
  {
    section: "HTML5",
    topic: "APIs & Features",
    level: "Intermediate",
    q: "What is the difference between localStorage, sessionStorage, and cookies?",
    a: `All 3 store data in browser. Key differences:

localStorage:
• Persists FOREVER until manually cleared
• 5-10MB storage
• Same origin only (not sent to server)
• Use for: theme preference, user settings

sessionStorage:
• Cleared when TAB is closed
• 5-10MB storage
• Not sent to server
• Use for: form data during a session, temp wizard steps

Cookies:
• Can have expiry date set
• ~4KB storage (tiny!)
• SENT to server with every request (via header)
• Can be HttpOnly (JS can't read) → more secure for auth
• Use for: session tokens, auth tokens

API comparison:
localStorage.setItem('key', 'value');
localStorage.getItem('key');
localStorage.removeItem('key');

sessionStorage.setItem('key', 'value'); // same API

document.cookie = "token=abc; expires=..."; // clunky

In MERN apps:
• JWT in HttpOnly Cookie = most secure (XSS-safe)
• JWT in localStorage = easy but vulnerable to XSS
• JWT in memory (React state) = most secure but lost on refresh

💬 Interview line: "For JWT tokens I prefer HttpOnly cookies over localStorage — localStorage is accessible to JS so it's vulnerable to XSS attacks."`,
  },
  {
    section: "HTML5",
    topic: "APIs & Features",
    level: "Intermediate",
    q: "What is the HTML5 Canvas and when would you use it?",
    a: `<canvas> = an HTML element that gives you a blank drawing surface where you can draw graphics USING JavaScript.

<canvas id="myCanvas" width="500" height="300"></canvas>

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw shapes:
ctx.fillStyle = '#60a5fa';
ctx.fillRect(10, 10, 100, 50); // rectangle

// Draw text:
ctx.font = '20px Arial';
ctx.fillText('Hello Vinod', 50, 100);

// Draw path/line:
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(200, 200);
ctx.stroke();

When to use Canvas:
✅ Games and animations
✅ Data visualizations (but libraries like Chart.js use it)
✅ Image manipulation/filters
✅ Drawing tools / whiteboards
✅ Signature pad

Canvas vs SVG:
Canvas = pixel-based (good for many objects/animations)
SVG = vector-based, DOM-based (good for interactive charts)

💬 Interview line: "Canvas is good for pixel-level graphics and games. For interactive charts I'd use Chart.js or D3 which abstract canvas/SVG — no need to draw manually."`,
  },
  {
    section: "HTML5",
    topic: "APIs & Features",
    level: "Intermediate",
    q: "What are Web Workers? What problem do they solve?",
    a: `Problem: JavaScript is single-threaded. Heavy computation BLOCKS the UI — page freezes.

Web Workers = run JS in a BACKGROUND thread, separate from main thread.
UI stays responsive while heavy work happens in background.

main.js:
const worker = new Worker('worker.js');

worker.postMessage({ data: bigArray }); // send data to worker

worker.onmessage = (e) => {
  console.log('Result:', e.data); // receive result
};

worker.js:
self.onmessage = (e) => {
  const result = heavyCalculation(e.data); // runs in background
  self.postMessage(result); // send back to main thread
};

Limitations:
❌ No DOM access (can't touch HTML elements)
❌ No window object
✅ Can use fetch, WebSockets, IndexedDB

Use cases:
• Sorting/filtering huge datasets
• Image processing
• Parsing large JSON/CSV files
• Crypto calculations

💬 Interview line: "Web Workers are the browser's way of true parallelism. I'd use them for heavy data processing like parsing 50,000 row CSVs — keeps the UI smooth."`,
  },
  {
    section: "HTML5",
    topic: "Accessibility",
    level: "Intermediate",
    q: "What is ARIA? What are key ARIA attributes?",
    a: `ARIA = Accessible Rich Internet Applications
A set of HTML attributes that make web content accessible to people using screen readers.

WHY: Custom components (custom dropdowns, modals, tabs) have no native accessibility.
ARIA bridges the gap.

Key attributes:

role = what the element IS
<div role="button">Click me</div>
<div role="dialog">Modal</div>
<div role="alert">Error message</div>

aria-label = text description (when no visible text)
<button aria-label="Close menu">✕</button>

aria-hidden = hide from screen readers
<span aria-hidden="true">🎉</span>

aria-expanded = toggle state (dropdown/accordion)
<button aria-expanded="false">Menu</button>

aria-required = form field required
<input aria-required="true" />

aria-live = announce dynamic content changes
<div aria-live="polite">Loading results...</div>

Golden rule: Use semantic HTML FIRST.
Only add ARIA when semantic HTML isn't enough.

"No ARIA is better than bad ARIA" — W3C

💬 Interview line: "I always add aria-label to icon buttons — a close button with just an × is meaningless to a screen reader without the label."`,
  },
  {
    section: "HTML5",
    topic: "Meta & SEO",
    level: "Basic",
    q: "What are meta tags? Which ones are important?",
    a: `Meta tags = HTML tags in <head> that give info ABOUT the page to browsers, search engines, and social media.

Essential meta tags:
<!-- Character encoding -->
<meta charset="UTF-8">

<!-- Responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Page description (shows in Google results) -->
<meta name="description" content="Track group rides in real-time">

<!-- Open Graph (Facebook, LinkedIn preview) -->
<meta property="og:title" content="RideTogether App">
<meta property="og:description" content="Real-time group ride tracking">
<meta property="og:image" content="https://example.com/preview.jpg">
<meta property="og:url" content="https://ridetogether.app">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="RideTogether">

<!-- Robots (control indexing) -->
<meta name="robots" content="index, follow">    // ✅ index
<meta name="robots" content="noindex, nofollow"> // ❌ don't index

💬 Interview line: "Viewport meta tag is critical for mobile — without it, mobile browsers render at desktop width. og: tags control how your link looks when shared on social media."`,
  },

  // ═══════════════════════════════════════
  // CSS3
  // ═══════════════════════════════════════
  {
    section: "CSS3",
    topic: "Box Model",
    level: "Basic",
    q: "What is the CSS Box Model? What is box-sizing?",
    a: `Every HTML element is a rectangular box made of 4 layers:

[  margin  ]
[  border  ]
[  padding ]
[  content ]

Content = actual text/image
Padding = space INSIDE the border (between content and border)
Border = line around the padding
Margin = space OUTSIDE the border (between elements)

The problem:
width: 200px means content is 200px.
But actual rendered width = 200 + padding + border (confusing!)

box-sizing fixes this:
/* Default — confusing */
box-sizing: content-box; /* width = content only */

/* Better — width includes padding + border */
box-sizing: border-box;  /* what you set is what you get */

Best practice (use globally):
*, *::before, *::after {
  box-sizing: border-box;
}

Example:
width: 200px + padding: 20px + border: 2px
content-box = 200 + 40 + 4 = 244px rendered
border-box  = 200px rendered (padding/border eat INTO the 200px)

💬 Interview line: "I set box-sizing: border-box globally in every project — it makes layouts predictable because the width you set is the actual rendered width."`,
  },
  {
    section: "CSS3",
    topic: "Flexbox",
    level: "Intermediate",
    q: "Explain Flexbox. What are the most important properties?",
    a: `Flexbox = one-dimensional layout system (row OR column).

Enable it:
display: flex; /* on the PARENT (flex container) */

Key container properties:
flex-direction: row | column | row-reverse | column-reverse
justify-content: flex-start | center | flex-end | space-between | space-around | space-evenly
align-items: flex-start | center | flex-end | stretch | baseline
flex-wrap: nowrap | wrap
gap: 16px; /* space between items */

Key item properties:
flex-grow: 1;   /* how much item grows to fill space */
flex-shrink: 1; /* how much item shrinks when overflow */
flex-basis: 200px; /* initial size before growing/shrinking */
flex: 1; /* shorthand = grow:1, shrink:1, basis:0 */
align-self: center; /* override align-items for ONE item */

Common patterns:
/* Center horizontally AND vertically */
display: flex;
justify-content: center;
align-items: center;

/* Navbar: logo left, links right */
display: flex;
justify-content: space-between;
align-items: center;

/* Equal width columns */
.col { flex: 1; }

💬 Interview line: "Flexbox is my go-to for 1D layouts — navbars, card rows, centering. For 2D layouts like dashboards I use Grid."`,
  },
  {
    section: "CSS3",
    topic: "Grid",
    level: "Intermediate",
    q: "What is CSS Grid? How is it different from Flexbox?",
    a: `CSS Grid = two-dimensional layout system (rows AND columns).

Enable it:
display: grid;

Key properties:
grid-template-columns: 1fr 1fr 1fr; /* 3 equal columns */
grid-template-columns: repeat(3, 1fr); /* same */
grid-template-columns: 200px 1fr 200px; /* sidebar + content + sidebar */
grid-template-rows: auto;
gap: 20px;

Place items:
grid-column: 1 / 3; /* span from column 1 to 3 */
grid-row: 1 / 2;

Auto-responsive grid (no media queries!):
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
/* Creates as many 250px+ columns as fit in the container */

Named areas:
grid-template-areas:
  "header header"
  "sidebar main"
  "footer footer";

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }

Flexbox vs Grid:
• Flexbox = 1D (one direction at a time)
• Grid    = 2D (rows AND columns simultaneously)

Use Flex for: navbars, button groups, card rows
Use Grid for: page layouts, dashboards, image galleries

💬 Interview line: "I use Grid for page-level layouts and Flexbox for component-level alignment. They complement each other — Grid for the skeleton, Flex for the muscles."`,
  },
  {
    section: "CSS3",
    topic: "Positioning",
    level: "Intermediate",
    q: "Explain CSS Position property — static, relative, absolute, fixed, sticky.",
    a: `position property controls how an element is placed.

static (default):
• Normal document flow
• top/left/right/bottom have NO effect

relative:
• Stays in normal flow
• Can be nudged with top/left/right/bottom from its ORIGINAL position
• Creates stacking context for absolute children

absolute:
• Removed from normal flow (other elements ignore it)
• Positioned relative to nearest NON-STATIC ancestor
• If no ancestor → relative to <body>

fixed:
• Removed from flow
• Positioned relative to VIEWPORT (stays fixed when scrolling)
• Use for: sticky navbars, chat widgets

sticky:
• Hybrid of relative + fixed
• Acts like relative UNTIL scroll reaches threshold → becomes fixed
• Use for: sticky table headers, sticky sidebars

position: sticky; top: 0;
/* stays at top of viewport when you scroll past it */

Common pattern (absolute inside relative):
.parent { position: relative; }
.child  { position: absolute; top: 0; right: 0; } /* top-right of parent */

💬 Interview line: "Sticky positioning replaced a lot of scroll-based JS hacks for sticky navbars. Absolute inside relative is a classic pattern for badges and tooltips."`,
  },
  {
    section: "CSS3",
    topic: "Responsive",
    level: "Intermediate",
    q: "What are CSS Media Queries? What is Mobile-First design?",
    a: `Media queries = apply CSS rules ONLY when certain conditions match (screen size, orientation, etc.)

Syntax:
@media (max-width: 768px) {
  /* styles for screens 768px and below */
}

Common breakpoints:
Mobile:  max-width: 480px
Tablet:  max-width: 768px
Laptop:  max-width: 1024px
Desktop: min-width: 1280px

Mobile-First approach (PREFERRED):
Write styles for mobile FIRST, then add media queries for bigger screens.

/* Mobile first (default — no query needed) */
.container { flex-direction: column; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { flex-direction: row; }
}

Why mobile-first is better:
✅ More users on mobile
✅ Loads less CSS on mobile (better performance)
✅ Forces simpler, cleaner design decisions first

Other media features:
@media (prefers-color-scheme: dark) { /* dark mode */ }
@media (orientation: landscape) { /* landscape */ }
@media print { /* print styles */ }

💬 Interview line: "I design mobile-first — it forces prioritization of content. I use min-width queries to progressively enhance for larger screens."`,
  },
  {
    section: "CSS3",
    topic: "Modern CSS",
    level: "Intermediate",
    q: "What are CSS Variables (Custom Properties)?",
    a: `CSS Variables = reusable values defined once, used everywhere.

Define (usually on :root for global):
:root {
  --primary-color: #60a5fa;
  --font-size-lg: 18px;
  --spacing-md: 16px;
  --border-radius: 8px;
}

Use with var():
button {
  background: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
}

With fallback value:
color: var(--text-color, #333); /* use #333 if variable not set */

Dynamic theme switching with JS:
document.documentElement.style.setProperty('--primary-color', '#f43f5e');

Dark mode with CSS variables:
:root { --bg: white; --text: black; }
[data-theme="dark"] { --bg: #0a0a0f; --text: white; }
body { background: var(--bg); color: var(--text); }

vs Sass variables ($color: blue):
CSS vars = dynamic (can change at runtime with JS)
Sass vars = static (compiled away, can't change at runtime)

💬 Interview line: "CSS variables are how I implement theming — one variable change cascades through the whole design system. They work at runtime unlike Sass variables."`,
  },
  {
    section: "CSS3",
    topic: "Modern CSS",
    level: "Intermediate",
    q: "What are CSS Pseudo-classes and Pseudo-elements?",
    a: `Pseudo-class = select element based on its STATE (colon :)
Pseudo-element = select a PART of an element (double colon ::)

Common Pseudo-classes:
:hover       → mouse over
:focus       → keyboard/click focused
:active      → being clicked
:first-child → first sibling
:last-child  → last sibling
:nth-child(2)→ specific position
:not(.active)→ elements WITHOUT that class
:disabled    → disabled form elements
:checked     → checked checkbox/radio

a:hover { color: blue; }
input:focus { outline: 2px solid #60a5fa; }
li:nth-child(odd) { background: #f1f5f9; }

Common Pseudo-elements:
::before  → insert content BEFORE element
::after   → insert content AFTER element
::placeholder → style input placeholder text
::selection   → style highlighted/selected text
::first-line  → style first line of text
::first-letter→ style first letter (drop cap)

.card::before {
  content: "";
  display: block;
  width: 4px;
  background: var(--primary-color);
}

/* Style placeholder */
input::placeholder { color: #94a3b8; font-style: italic; }

💬 Interview line: "I use ::before and ::after with content:'' for decorative elements — keeps HTML clean without extra DOM nodes. :focus-visible is important for keyboard accessibility."`,
  },
  {
    section: "CSS3",
    topic: "Modern CSS",
    level: "Advanced",
    q: "What is CSS Specificity? How does it work?",
    a: `Specificity = the rule that decides WHICH CSS wins when multiple rules target the same element.

Higher specificity wins. Think of it as a score:

Inline styles:      1-0-0-0  (1000 points) — highest
ID selectors:       0-1-0-0  (100 points)
Class/pseudo/attr:  0-0-1-0  (10 points)
Element/pseudo-el:  0-0-0-1  (1 point)
Universal (*):      0-0-0-0  (0 points)

Examples:
h1              → 0-0-0-1  (1 point)
.title          → 0-0-1-0  (10 points)
#header         → 0-1-0-0  (100 points)
#header .title  → 0-1-1-0  (110 points)
style=""        → 1-0-0-0  (1000 points)
!important      → overrides EVERYTHING (nuclear option)

When specificity is equal → last rule in CSS wins (cascade).

Best practices:
✅ Keep specificity low — use classes mostly
✅ Avoid IDs for styling (use for JS hooks)
✅ Never use !important (except to override 3rd-party CSS)
✅ Use BEM naming to avoid specificity wars

💬 Interview line: "Specificity wars happen when you mix IDs and classes carelessly. I use BEM and keep everything at class-level specificity — predictable and override-friendly."`,
  },
  {
    section: "CSS3",
    topic: "Animations",
    level: "Intermediate",
    q: "What is the difference between CSS Transitions and Animations?",
    a: `Both animate CSS property changes. Key difference:

Transitions = animate FROM one state TO another on trigger (hover, focus, class change)
Animations = run automatically, can loop, have keyframes

Transition syntax:
transition: property duration timing-function delay;

button {
  background: blue;
  transition: background 0.3s ease, transform 0.2s ease;
}
button:hover {
  background: darkblue;
  transform: scale(1.05);
}

Timing functions:
ease = slow start, fast middle, slow end (natural)
linear = constant speed
ease-in = slow start
ease-out = slow end (good for exits)
cubic-bezier(0.4, 0, 0.2, 1) = custom curve

CSS Animations with @keyframes:
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeIn 0.3s ease forwards;
}

Animation properties:
animation-duration: 1s
animation-delay: 0.2s
animation-iteration-count: infinite | 3
animation-direction: normal | reverse | alternate
animation-fill-mode: forwards (keep final state)

Performance tip:
✅ Animate: transform, opacity (GPU-accelerated)
❌ Avoid animating: width, height, top, left (cause reflow)

💬 Interview line: "I stick to animating transform and opacity — they're GPU-accelerated and don't cause layout reflow. For entrance animations I use @keyframes with animation-fill-mode: forwards."`,
  },
  {
    section: "CSS3",
    topic: "Modern CSS",
    level: "Advanced",
    q: "What is the difference between display:none, visibility:hidden, and opacity:0?",
    a: `All 3 make an element invisible — but very differently.

display: none
• Element is REMOVED from the layout completely
• Takes up NO space
• Not accessible to screen readers
• Cannot be transitioned/animated (disappears instantly)
• Child elements also hidden

visibility: hidden
• Element is invisible but STILL TAKES UP SPACE
• Layout is preserved (blank gap remains)
• Not accessible to screen readers
• CAN'T be transitioned smoothly

opacity: 0
• Element is invisible but STILL TAKES UP SPACE
• Layout is preserved
• Still accessible to screen readers (and pointer events!)
• CAN be transitioned/animated smoothly

.fade { opacity: 0; transition: opacity 0.3s; }
.fade:hover { opacity: 1; } // smooth fade in

Fix pointer events issue with opacity:
.hidden { opacity: 0; pointer-events: none; }

When to use which:
• Completely remove from flow → display: none
• Keep space, hide → visibility: hidden
• Animate fade in/out → opacity: 0

💬 Interview line: "For animated modals and dropdowns I use opacity + pointer-events instead of display:none — you can't CSS-transition display, but you can transition opacity."`,
  },
];

const levelColors = {
  Basic: { bg: "rgba(34,197,94,0.12)", border: "#22c55e", text: "#4ade80" },
  Intermediate: { bg: "rgba(234,179,8,0.12)", border: "#eab308", text: "#facc15" },
  Advanced: { bg: "rgba(239,68,68,0.12)", border: "#ef4444", text: "#f87171" },
};

const sectionMeta = {
  JavaScript: { color: "#facc15", icon: "JS" },
  HTML5:      { color: "#f97316", icon: "H5" },
  CSS3:       { color: "#60a5fa", icon: "C3" },
};

const topicColors = {
  "Core JS":      "#a78bfa",
  "Closures & Scope": "#f472b6",
  "Async JS":     "#34d399",
  "ES6+":         "#facc15",
  "Semantics":    "#f97316",
  "APIs & Features": "#38bdf8",
  "Accessibility":"#4ade80",
  "Meta & SEO":   "#fb923c",
  "Box Model":    "#60a5fa",
  "Flexbox":      "#a78bfa",
  "Grid":         "#f43f5e",
  "Positioning":  "#34d399",
  "Responsive":   "#e879f9",
  "Modern CSS":   "#38bdf8",
  "Animations":   "#fb923c",
};

const allSections = ["All", "JavaScript", "HTML5", "CSS3"];

export default function Jscsshtml() {
  const [filter, setFilter] = useState("All");
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(new Set());

  const filtered = filter === "All" ? questions : questions.filter(q => q.section === filter);
  const q = filtered[current];
  const lc = q ? levelColors[q.level] : levelColors.Basic;
  const sm = q ? sectionMeta[q.section] : sectionMeta.JavaScript;

  const goTo = (i) => { setCurrent(i); setFlipped(false); };
  const globalIdx = q ? questions.indexOf(q) : -1;
  const isDone = answered.has(globalIdx);
  const markDone = () => setAnswered(prev => new Set([...prev, globalIdx]));

  const jsCount  = questions.filter(q => q.section === "JavaScript").length;
  const htmlCount= questions.filter(q => q.section === "HTML5").length;
  const cssCount = questions.filter(q => q.section === "CSS3").length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "#0d0d1f",
        borderBottom: "1px solid #1e293b",
        padding: "16px 20px 12px",
      }}>
        <div style={{ fontSize: 10, color: "#475569", letterSpacing: 3, marginBottom: 4 }}>MERN STACK INTERVIEW PREP</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          <span style={{ color: "#facc15" }}>JS</span>
          <span style={{ color: "#475569" }}> · </span>
          <span style={{ color: "#f97316" }}>HTML5</span>
          <span style={{ color: "#475569" }}> · </span>
          <span style={{ color: "#60a5fa" }}>CSS3</span>
          <span style={{ color: "#475569", fontSize: 13 }}> — 2.6 YRS</span>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "JS", count: jsCount, color: "#facc15" },
            { label: "HTML5", count: htmlCount, color: "#f97316" },
            { label: "CSS3", count: cssCount, color: "#60a5fa" },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: "#111827", borderRadius: 8,
              padding: "7px 10px", border: `1px solid ${s.color}22`,
            }}>
              <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.count} Qs</div>
            </div>
          ))}
          <div style={{
            flex: 1, background: "#111827", borderRadius: 8,
            padding: "7px 10px", border: "1px solid #4ade8022",
          }}>
            <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>DONE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#4ade80" }}>
              {answered.size}/{questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Section Filter */}
      <div style={{
        display: "flex", gap: 6, padding: "10px 20px",
        background: "#0d0d1f", borderBottom: "1px solid #1e293b",
      }}>
        {allSections.map(s => {
          const active = filter === s;
          const col = s === "All" ? "#94a3b8" : sectionMeta[s]?.color || "#94a3b8";
          return (
            <button key={s} onClick={() => { setFilter(s); goTo(0); }}
              style={{
                flex: 1, padding: "7px 4px", borderRadius: 8, fontSize: 11,
                border: active ? `1px solid ${col}` : "1px solid #1e293b",
                background: active ? `${col}18` : "transparent",
                color: active ? col : "#475569",
                cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 700 : 400,
              }}>
              {s}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#1e293b" }}>
        <div style={{
          height: "100%",
          width: `${filtered.length ? ((current + 1) / filtered.length) * 100 : 0}%`,
          background: sm?.color || "#60a5fa",
          transition: "width 0.3s",
        }} />
      </div>

      {/* Card Area */}
      {q && (
        <div style={{ flex: 1, padding: "14px 20px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Top meta */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                background: `${sm.color}22`, border: `1px solid ${sm.color}`,
                color: sm.color, fontSize: 10, fontWeight: 700,
                padding: "2px 8px", borderRadius: 6,
              }}>{q.section}</span>
              <span style={{
                color: topicColors[q.topic] || "#94a3b8",
                fontSize: 10,
              }}>{q.topic}</span>
              {isDone && <span style={{ color: "#4ade80", fontSize: 10 }}>✓ DONE</span>}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700,
              padding: "2px 8px", borderRadius: 6,
              background: lc.bg, border: `1px solid ${lc.border}`, color: lc.text,
            }}>{q.level}</span>
          </div>

          {/* Question number */}
          <div style={{ fontSize: 10, color: "#334155" }}>
            {current + 1} / {filtered.length}
          </div>

          {/* Question box */}
          <div style={{
            background: "#111827", border: "1px solid #1e293b",
            borderRadius: 12, padding: "16px 18px",
            borderLeft: `3px solid ${sm.color}`,
          }}>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: 2, marginBottom: 8 }}>QUESTION</div>
            <div style={{ fontSize: 15, lineHeight: 1.65, color: "#f1f5f9", fontWeight: 600 }}>
              {q.q}
            </div>
          </div>

          {/* Answer */}
          {!flipped ? (
            <button onClick={() => setFlipped(true)} style={{
              background: `linear-gradient(135deg, ${sm.color}12, ${sm.color}06)`,
              border: `1px solid ${sm.color}44`,
              borderRadius: 12, padding: "15px",
              cursor: "pointer", color: sm.color,
              fontSize: 13, fontFamily: "inherit",
              textAlign: "center",
            }}>
              👁 Show Answer
            </button>
          ) : (
            <div style={{
              background: "#0a1a0a", border: "1px solid #166534",
              borderRadius: 12, padding: "16px 18px",
              flex: 1,
            }}>
              <div style={{ fontSize: 9, color: "#4ade80", letterSpacing: 2, marginBottom: 10 }}>ANSWER</div>
              <pre style={{
                fontSize: 12, lineHeight: 1.8, color: "#d1fae5",
                whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit",
              }}>{q.a}</pre>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13,
                border: "1px solid #1e293b", background: "#111827",
                color: current === 0 ? "#334155" : "#94a3b8",
                cursor: current === 0 ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>← Prev</button>

            {flipped && !isDone && (
              <button onClick={markDone} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13,
                border: "1px solid #166534", background: "#14532d22",
                color: "#4ade80", cursor: "pointer", fontFamily: "inherit",
              }}>✓ Got it</button>
            )}

            <button onClick={() => goTo(Math.min(filtered.length - 1, current + 1))}
              disabled={current === filtered.length - 1}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13,
                border: "1px solid #1e293b", background: "#111827",
                color: current === filtered.length - 1 ? "#334155" : "#94a3b8",
                cursor: current === filtered.length - 1 ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>Next →</button>
          </div>

          {/* Dot navigation */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", paddingBottom: 6 }}>
            {filtered.map((fq, i) => {
              const gi = questions.indexOf(fq);
              const done = answered.has(gi);
              const secColor = sectionMeta[fq.section]?.color || "#60a5fa";
              return (
                <button key={i} onClick={() => goTo(i)} style={{
                  width: 24, height: 24, borderRadius: 6, border: "none",
                  fontSize: 9, cursor: "pointer", fontFamily: "inherit",
                  background: i === current ? secColor : done ? "#166534" : "#1e293b",
                  color: i === current ? "#000" : done ? "#4ade80" : "#475569",
                  fontWeight: i === current ? 700 : 400,
                }}>{i + 1}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: "8px 20px 16px",
        borderTop: "1px solid #1e293b",
        background: "#0d0d1f",
        fontSize: 9, color: "#1e293b", lineHeight: 2,
        textAlign: "center",
      }}>
        JS: var/let/const · Hoisting · Closures · Event Loop · Promises · async/await · Prototypes · Spread/Rest · Debounce/Throttle
        HTML5: Semantic · Forms · Storage · Canvas · Workers · ARIA · Meta
        CSS3: Box Model · Flexbox · Grid · Position · Media Queries · Variables · Specificity · Animations
      </div>
    </div>
  );
}