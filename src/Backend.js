import { useState } from "react";

const questions = [

  // ════════════════════════════════════════════════════════
  // NODE.JS
  // ════════════════════════════════════════════════════════

  {
    section: "Node.js", topic: "Core Concepts", level: "Basic",
    q: "What is Node.js? Why is it used for backend?",
    a: `What I say in interview:

"Node.js is a JavaScript runtime built on Chrome's V8 engine. It lets us run JavaScript outside the browser — on the server side.

The key reason we use it for backend is its non-blocking, event-driven architecture. Traditional servers like Java or PHP block the thread while waiting for database queries or file reads. Node.js doesn't block — it registers a callback and moves on to handle other requests.

This makes Node.js extremely efficient for I/O-heavy applications like REST APIs, real-time apps, and microservices.

In my current project at ERS — a device management system — we chose Node.js because we have many concurrent API calls for device tracking. Node handles all of them without needing multiple threads."

Key points to always mention:
• Built on V8 engine (Google Chrome's JS engine)
• Single-threaded + Event Loop = handles thousands of concurrent connections
• Best for: APIs, real-time apps, microservices
• Not best for: CPU-heavy tasks like image processing, ML (blocks the thread)
• NPM ecosystem — largest package registry in the world`,
  },

  {
    section: "Node.js", topic: "Core Concepts", level: "Basic",
    q: "What is the Event Loop? Explain its phases.",
    a: `What I say in interview:

"The Event Loop is the heart of Node.js. It's what makes Node non-blocking even though it's single-threaded.

When Node starts, it runs your synchronous code first. Then the Event Loop takes over and continuously checks queues for pending callbacks.

The Event Loop has phases — each phase has a specific queue it processes:

Phase 1 — Timers: Runs callbacks from setTimeout and setInterval whose time has expired.

Phase 2 — I/O Callbacks: Handles completed I/O operations — like a file read finishing or DB query returning.

Phase 3 — Idle/Prepare: Internal use only.

Phase 4 — Poll: Waits for new I/O events. If nothing is pending, it blocks here briefly.

Phase 5 — Check: Runs setImmediate() callbacks.

Phase 6 — Close Callbacks: Handles close events like socket.on('close').

Between each phase, Node checks the Microtask Queue — this is where Promises (.then) and process.nextTick run. These have the HIGHEST priority."

Interview example:
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

Output order: nextTick → promise → timeout → immediate

Key rule: process.nextTick > Promises > setTimeout > setImmediate`,
  },

  {
    section: "Node.js", topic: "Core Concepts", level: "Intermediate",
    q: "What is the difference between process.nextTick() and setImmediate()?",
    a: `What I say in interview:

"Both are ways to defer code execution, but they run at different points in the Event Loop.

process.nextTick() runs BEFORE the Event Loop continues to the next phase. It's added to the Microtask Queue and has the highest priority — even higher than Promises.

setImmediate() runs in the Check phase of the Event Loop — after I/O callbacks are processed.

Simple example:
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
// Output: nextTick → setImmediate

When do I use each?
- process.nextTick: when I need something to run after current operation but before any I/O — like emitting an event after a constructor
- setImmediate: when I want to run after I/O events — to not block the I/O phase

Warning: If you call process.nextTick recursively (nextTick inside nextTick), it can STARVE the Event Loop — I/O callbacks will never run. That's a bug I've seen in production."`,
  },

  {
    section: "Node.js", topic: "Core Concepts", level: "Intermediate",
    q: "What are Streams in Node.js? What types exist?",
    a: `What I say in interview:

"Streams are one of Node's most powerful features. Instead of loading an entire file or data into memory at once, streams process it piece by piece — chunk by chunk.

Analogy: Watching Netflix. You don't wait for the whole movie to download — it streams in chunks. That's exactly what Node Streams do with data.

4 Types of Streams:

1. Readable — read data from source
   Example: fs.createReadStream('file.txt')

2. Writable — write data to destination
   Example: fs.createWriteStream('output.txt')

3. Duplex — both readable AND writable
   Example: TCP socket (net.Socket)

4. Transform — duplex + can modify data while passing through
   Example: zlib.createGzip() — compresses data as it passes through

Real example — reading a large CSV file without memory issues:
const readable = fs.createReadStream('bigfile.csv');
const writable = fs.createWriteStream('output.csv');
readable.pipe(writable); // pipe connects them

pipe() is the magic method — it connects streams and handles backpressure automatically.

In my ERS project, I used streams for exporting device reports as CSV — instead of loading 10,000 device records into memory, I streamed them row by row to the response."`,
  },

  {
    section: "Node.js", topic: "Core Concepts", level: "Intermediate",
    q: "What are Buffer and why is it needed in Node.js?",
    a: `What I say in interview:

"JavaScript was designed to handle strings and numbers — not raw binary data. But when you work with files, images, network data, or streams in Node.js, you're dealing with raw bytes.

Buffer is a class in Node.js that stores raw binary data in memory. Think of it like a temporary holding area for binary data.

When you read a file or receive data from a network socket, Node gives it to you as a Buffer — a sequence of bytes.

Common operations:
// Create a buffer
const buf = Buffer.from('Hello Vinod', 'utf8');
console.log(buf); // <Buffer 48 65 6c 6c 6f...>
console.log(buf.toString()); // 'Hello Vinod'

// Allocate empty buffer
const buf2 = Buffer.alloc(10); // 10 bytes, initialized to 0

// Buffer to JSON
buf.toJSON();

Why it matters in real work:
- Reading files → returns Buffer
- Streams give you data as Buffers
- Uploading images → you handle Buffer
- Encryption/hashing → works on Buffers

In my projects I encounter Buffers mostly when handling file uploads with Multer — the file data comes in as a Buffer that I then store or process."`,
  },

  {
    section: "Node.js", topic: "Modules", level: "Basic",
    q: "What is the difference between CommonJS (require) and ES Modules (import)?",
    a: `What I say in interview:

"Node.js originally used CommonJS — the require() system. ES Modules (import/export) came from the browser JS standard and Node started supporting it from version 12+.

CommonJS (CJS):
const express = require('express');
module.exports = { router };
// Synchronous — loaded immediately
// Default in Node.js (.js files)

ES Modules (ESM):
import express from 'express';
export { router };
// Asynchronous — supports top-level await
// Use .mjs extension OR set type:'module' in package.json

Key differences:
1. Loading: CJS is synchronous, ESM is asynchronous
2. CJS can require() anywhere (inside if blocks) — ESM imports are static (top of file only)
3. ESM supports tree-shaking (bundlers can remove unused code)
4. ESM supports top-level await — huge for initialization code
5. __dirname and __filename don't exist in ESM (need import.meta.url)

In 2024+, most new Node projects use ESM. But most existing MERN projects (including mine at ERS) still use CommonJS — and that's fine. Both work, just pick one and be consistent."`,
  },

  {
    section: "Node.js", topic: "Modules", level: "Intermediate",
    q: "What is the Node.js module system? How does require() work internally?",
    a: `What I say in interview:

"When you call require('./myModule'), Node.js goes through these steps:

Step 1 — Resolving: Node figures out the full file path.
- Starts with the string: './myModule'
- Tries: myModule.js → myModule.json → myModule/index.js

Step 2 — Loading: Node reads the file content.

Step 3 — Wrapping: This is the key part most people don't know.
Node wraps your module code in a function:

(function(exports, require, module, __filename, __dirname) {
  // YOUR MODULE CODE IS HERE
});

This is WHY __dirname and __filename are available in every module — they're injected by Node!

Step 4 — Evaluating: Node runs the wrapped function.

Step 5 — Caching: The result is cached. If you require() the same file again, Node returns the CACHED version — doesn't reload.

The caching is important! It means:
const a = require('./db'); // loads and caches
const b = require('./db'); // returns SAME cached instance
a === b; // true

This is how the singleton pattern works in Node — your database connection is cached and shared everywhere."`,
  },

  {
    section: "Node.js", topic: "Worker Threads & Clustering", level: "Advanced",
    q: "What are Worker Threads? How are they different from Cluster?",
    a: `What I say in interview:

"Node.js is single-threaded, which is great for I/O but terrible for CPU-intensive tasks like image resizing, PDF generation, or heavy calculations. They block the Event Loop.

Worker Threads solve this — they let you run JavaScript in a separate thread, truly parallel.

Worker Threads example:
// main.js
const { Worker } = require('worker_threads');
const worker = new Worker('./heavy-task.js', {
  workerData: { input: bigArray }
});
worker.on('message', result => console.log(result));

// heavy-task.js
const { workerData, parentPort } = require('worker_threads');
const result = heavyCalculation(workerData.input);
parentPort.postMessage(result); // send back to main

Worker Threads vs Cluster:

Worker Threads:
- Multiple threads in ONE process
- Share memory (SharedArrayBuffer)
- Best for: CPU-heavy computation within a single request

Cluster:
- Multiple Node.js PROCESSES (forked)
- Each process has its own memory
- Each process can handle requests independently
- Best for: Using all CPU cores for handling more HTTP requests
- Uses: cluster.fork() — creates child processes

const cluster = require('cluster');
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  app.listen(3000); // each worker handles requests
}

Real answer: In production I use PM2 with cluster mode — it handles forking automatically without manual cluster code."`,
  },

  {
    section: "Node.js", topic: "Error Handling", level: "Intermediate",
    q: "How do you handle errors in Node.js? What is uncaughtException?",
    a: `What I say in interview:

"Error handling in Node.js has multiple layers depending on whether errors are synchronous or async.

For synchronous code — try/catch:
try {
  const data = JSON.parse(badJson);
} catch (err) {
  console.error('Parse error:', err.message);
}

For async/await — try/catch still works:
async function getUser(id) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (err) {
    throw new AppError('User not found', 404);
  }
}

For Promises — .catch():
fetchData().catch(err => handleError(err));

For Express specifically — error middleware (4 parameters):
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

process.on('uncaughtException') — this catches errors that weren't caught anywhere:
process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  process.exit(1); // MUST exit — app is in undefined state
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise rejection:', reason);
  process.exit(1);
});

Important: After uncaughtException, you MUST exit the process. The app may be in a corrupt state. Let PM2 or Kubernetes restart it cleanly."`,
  },

  {
    section: "Node.js", topic: "Performance", level: "Advanced",
    q: "How do you improve Node.js application performance?",
    a: `What I say in interview:

"I think about Node.js performance in 4 categories:

1. Event Loop — don't block it
- Move CPU work to Worker Threads
- Use async versions of everything (fs.readFile not fs.readFileSync)
- Avoid sync operations in request handlers

2. Memory
- Stream large files instead of loading into memory
- Watch for memory leaks — closures holding references
- Use --max-old-space-size to tune heap if needed
- Profile with node --inspect + Chrome DevTools

3. Caching
- Cache DB query results in Redis
- Cache computed values in-memory (node-cache)
- HTTP caching headers (Cache-Control, ETag)

4. Clustering / Scaling
- Use PM2 cluster mode to use all CPU cores
- Horizontally scale behind a load balancer (Nginx)
- Use connection pooling for database (Mongoose connection pool)

5. Code-level optimizations
- Use compression middleware (gzip responses)
- Minimize middleware chain — only apply what's needed
- Use connection keep-alive for HTTP
- Database: proper indexes (huge impact), avoid N+1 queries

In my ERS project, our biggest win was adding Redis caching for the device list endpoint — reduced DB load by 80% because that list was queried on every dashboard refresh."`,
  },

  // ════════════════════════════════════════════════════════
  // EXPRESS.JS
  // ════════════════════════════════════════════════════════

  {
    section: "Express.js", topic: "Core Concepts", level: "Basic",
    q: "What is Express.js? Why use it over plain Node.js http module?",
    a: `What I say in interview:

"Express.js is a minimal, unopinionated web framework for Node.js. It sits on top of Node's built-in http module and provides a cleaner API for building web servers and APIs.

With plain Node http module, even a simple route looks verbose:
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ users: [] }));
  }
});

With Express — cleaner, more readable:
const express = require('express');
const app = express();
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

What Express adds:
1. Routing system — app.get(), app.post(), Router()
2. Middleware system — request pipeline
3. Request parsing — body-parser, query params
4. Response helpers — res.json(), res.send(), res.status()
5. Template engine support
6. Error handling
7. Static file serving

Express is intentionally minimal — it gives you the tools but doesn't impose structure. That's why we pair it with patterns like MVC in MERN applications."`,
  },

  {
    section: "Express.js", topic: "Middleware", level: "Intermediate",
    q: "What is Middleware in Express? Explain the middleware pipeline.",
    a: `What I say in interview:

"Middleware is the backbone of Express. Every request in Express passes through a pipeline of functions before reaching the route handler.

A middleware function has this signature:
function myMiddleware(req, res, next) {
  // do something with req or res
  next(); // pass to next middleware
}

The pipeline works like a chain:
Request → Middleware 1 → Middleware 2 → Route Handler → Response

Types of middleware:

1. Application-level: app.use()
app.use(express.json()); // parses JSON body for ALL routes

2. Router-level: router.use()
router.use(authMiddleware); // applies to all routes in this router

3. Route-specific:
app.get('/users', authMiddleware, getUsersHandler);

4. Error-handling (4 parameters — Express detects this):
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

5. Built-in middleware:
express.json()       // parse JSON body
express.urlencoded() // parse form data
express.static()     // serve static files

6. Third-party:
cors()      // handle CORS
morgan()    // HTTP request logging
helmet()    // security headers
multer()    // file uploads

Key point: Middleware ORDER matters in Express. Middleware applied before a route affects that route. After doesn't.

In my ERS project I have: logger → cors → json parser → auth check → rate limiter → route handlers"`,
  },

  {
    section: "Express.js", topic: "Middleware", level: "Intermediate",
    q: "How does authentication middleware work? Implement JWT auth middleware.",
    a: `What I say in interview:

"In most of my projects I protect routes using JWT authentication middleware. Here's exactly how I implement it:

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Step 1: Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // 'Bearer <token>'

  // Step 2: Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user to request
    next(); // proceed to route handler
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply to specific routes
router.get('/devices', authMiddleware, getDevices);

// Or apply to all routes in a router
router.use(authMiddleware);
router.get('/profile', getProfile);

Role-based authorization middleware (separate from auth):
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Usage
router.delete('/user/:id', authMiddleware, authorize('admin'), deleteUser);

In ERS project: every device management API is protected. I decode the JWT to get userId and role, then check if they have permission to view/modify that device."`,
  },

  {
    section: "Express.js", topic: "Routing", level: "Intermediate",
    q: "How do you structure routes in a large Express application?",
    a: `What I say in interview:

"For small apps, putting all routes in app.js is fine. But for a real project like ERS with 20+ routes, I follow a modular structure.

My folder structure:
src/
  routes/
    index.js          ← mounts all routers
    auth.routes.js
    device.routes.js
    user.routes.js
  controllers/
    device.controller.js
    user.controller.js
  middleware/
    auth.js
    errorHandler.js
  models/
    Device.js
    User.js

routes/device.routes.js:
const router = express.Router();
const { getDevices, addDevice, updateDevice } = require('../controllers/device.controller');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getDevices);
router.post('/', authMiddleware, addDevice);
router.put('/:id', authMiddleware, updateDevice);
module.exports = router;

routes/index.js — mount all routers:
const router = express.Router();
router.use('/auth', require('./auth.routes'));
router.use('/devices', require('./device.routes'));
router.use('/users', require('./user.routes'));
module.exports = router;

app.js:
app.use('/api/v1', require('./routes'));

Benefits of this structure:
✅ Each feature is self-contained
✅ Easy to add/remove features
✅ Controllers are testable in isolation
✅ Versioning is built in (/api/v1)
✅ Middleware applies only where needed"`,
  },

  {
    section: "Express.js", topic: "Error Handling", level: "Intermediate",
    q: "How do you implement centralized error handling in Express?",
    a: `What I say in interview:

"Instead of handling errors inside each route, I use a centralized error handler. This keeps code clean and consistent.

Step 1 — Create a custom error class:
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // known, expected errors
  }
}

Step 2 — Throw it anywhere in the app:
const getDevice = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) throw new AppError('Device not found', 404);
    res.json(device);
  } catch (err) {
    next(err); // forward to error handler
  }
};

Step 3 — Global error middleware (must be LAST in app.js):
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';

  // Log unexpected errors
  if (!err.isOperational) console.error('UNEXPECTED ERROR:', err);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

Async wrapper to avoid try/catch everywhere:
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Now routes are clean:
router.get('/devices', asyncHandler(async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
}));

In ERS: every route uses asyncHandler. The global error middleware handles Mongoose validation errors, JWT errors, and operational errors with consistent JSON responses."`,
  },

  {
    section: "Express.js", topic: "Security", level: "Advanced",
    q: "What security measures do you implement in an Express API?",
    a: `What I say in interview:

"Security is something I take seriously in production APIs. Here's my standard security checklist:

1. Helmet — sets security HTTP headers:
const helmet = require('helmet');
app.use(helmet());
// Sets: X-Frame-Options, X-XSS-Protection, HSTS, etc.

2. CORS — control which origins can call the API:
const cors = require('cors');
app.use(cors({
  origin: ['https://myapp.com', 'http://localhost:3000'],
  credentials: true
}));

3. Rate Limiting — prevent brute force / DDoS:
const rateLimit = require('express-rate-limit');
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts per window
  message: 'Too many attempts, try again later'
}));

4. Data Sanitization — prevent NoSQL injection:
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // strips $ and . from req.body

5. Input Validation — validate before processing:
const { body, validationResult } = require('express-validator');
router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  }
);

6. HTTP Parameter Pollution prevention:
const hpp = require('hpp');
app.use(hpp());

7. JWT stored in HttpOnly cookies — not localStorage

8. Environment variables — never hardcode secrets
9. Limit request body size: app.use(express.json({ limit: '10kb' }))

In ERS: I have all of these. The rate limiter on auth routes stopped a brute force attempt on a test environment."`,
  },

  // ════════════════════════════════════════════════════════
  // MONGODB
  // ════════════════════════════════════════════════════════

  {
    section: "MongoDB", topic: "Core Concepts", level: "Basic",
    q: "What is MongoDB? How is it different from relational databases?",
    a: `What I say in interview:

"MongoDB is a NoSQL document database. Instead of tables and rows like SQL, it stores data as JSON-like documents in collections.

SQL (Relational):
- Data in tables with fixed schema (columns defined upfront)
- Rows = records, Columns = fields
- Joins connect related tables
- ACID transactions built-in
- Best when data is highly structured and relationships are complex

MongoDB (Document):
- Data in collections as flexible JSON documents
- No fixed schema — documents can have different fields
- Embedding or referencing for related data
- Horizontal scaling (sharding) built-in
- Best when data is document-like, needs flexibility, or high write volume

SQL equivalent mapping:
Table → Collection
Row → Document
Column → Field
JOIN → $lookup (aggregation) or populate (Mongoose)

Example MongoDB document:
{
  _id: ObjectId('...'),
  name: 'Laptop Dell XPS',
  assignedTo: { name: 'Vinod', dept: 'Engineering' }, // embedded
  tags: ['laptop', 'active', 'warranty'],
  specs: { ram: '16GB', storage: '512GB' }
}

In my ERS device tracking project I chose MongoDB because device data has varying specs — a laptop has different fields than a router. MongoDB's flexible schema handles this naturally. A SQL table would need many nullable columns or complex joins."`,
  },

  {
    section: "MongoDB", topic: "Core Concepts", level: "Intermediate",
    q: "What is Mongoose? What does it add over the MongoDB driver?",
    a: `What I say in interview:

"The native MongoDB Node.js driver is low-level — you write raw queries. Mongoose is an ODM (Object Data Modeling) library that adds a layer of structure on top.

What Mongoose adds:

1. Schema — define structure and data types:
const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  serialNumber: { type: String, unique: true },
  status: { type: String, enum: ['active','inactive','repair'], default: 'active' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchaseDate: Date,
  createdAt: { type: Date, default: Date.now }
});

2. Model — interact with the collection:
const Device = mongoose.model('Device', deviceSchema);

3. Validation — built-in before saving:
// required, minLength, maxLength, enum, match (regex), custom validators

4. Middleware (hooks) — pre/post save, find, etc.:
deviceSchema.pre('save', function(next) {
  this.serialNumber = this.serialNumber.toUpperCase();
  next();
});

5. Virtuals — computed fields not stored in DB:
deviceSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.purchaseDate) / 86400000);
});

6. populate() — automatic reference joining:
const devices = await Device.find().populate('assignedTo', 'name email');

7. Static & Instance methods on models

Without Mongoose, I'd write raw MongoDB queries everywhere. Mongoose gives me structure, validation, and OOP patterns that fit well in a Node/Express app."`,
  },

  {
    section: "MongoDB", topic: "Queries", level: "Intermediate",
    q: "What are the most important MongoDB query operators? Give examples.",
    a: `What I say in interview:

"I use these operators regularly in my projects. I'll group them by category:

Comparison operators:
{ age: { $gt: 25 } }      // greater than
{ age: { $gte: 18 } }     // greater than or equal
{ age: { $lt: 30 } }      // less than
{ age: { $in: [1,2,3] } } // matches any in array
{ age: { $ne: 25 } }      // not equal
{ age: { $nin: [1,2] } }  // not in array

Logical operators:
{ $and: [{ status: 'active' }, { age: { $gt: 18 } }] }
{ $or: [{ dept: 'IT' }, { dept: 'HR' }] }
{ $not: { status: 'inactive' } }

Array operators:
{ tags: { $all: ['laptop', 'active'] } }  // must have ALL tags
{ tags: { $elemMatch: { $gt: 5 } } }      // element matches condition
{ tags: { $size: 3 } }                    // array has exactly 3 items

Existence/type:
{ phone: { $exists: true } }   // field exists
{ age: { $type: 'number' } }   // field is of type

Text search:
{ $text: { $search: 'Dell laptop' } } // requires text index

Regular expression:
{ name: { $regex: /^Dell/i } } // starts with Dell, case-insensitive

Update operators (in updateOne/updateMany):
{ $set: { status: 'active' } }     // set specific field
{ $unset: { oldField: '' } }       // remove field
{ $inc: { viewCount: 1 } }         // increment
{ $push: { tags: 'warranty' } }    // add to array
{ $pull: { tags: 'expired' } }     // remove from array
{ $addToSet: { tags: 'new' } }     // add only if not exists

In ERS, I use $set for device status updates and $push to add maintenance history entries."`,
  },

  {
    section: "MongoDB", topic: "Aggregation", level: "Advanced",
    q: "What is the Aggregation Pipeline? Explain key stages.",
    a: `What I say in interview:

"The Aggregation Pipeline is MongoDB's way to process and transform documents in stages. Think of it as a conveyor belt — documents enter one end and come out transformed at the other end.

Each stage takes documents in, processes them, and passes results to the next stage.

Key stages I use most:

$match — filter documents (like WHERE in SQL):
{ $match: { status: 'active', dept: 'IT' } }

$group — group and aggregate (like GROUP BY):
{ $group: {
  _id: '$dept',           // group by department
  totalDevices: { $sum: 1 },
  avgAge: { $avg: '$ageInDays' }
}}

$project — select/reshape fields (like SELECT):
{ $project: { name: 1, status: 1, _id: 0 } }

$sort — sort results:
{ $sort: { createdAt: -1 } } // newest first

$limit and $skip — pagination:
{ $skip: 20 }, { $limit: 10 }

$lookup — JOIN with another collection:
{ $lookup: {
  from: 'users',
  localField: 'assignedTo',
  foreignField: '_id',
  as: 'assignedUser'
}}

$unwind — flatten array fields:
{ $unwind: '$tags' }

$addFields — add computed fields:
{ $addFields: { fullName: { $concat: ['$first', ' ', '$last'] } } }

Real example from ERS — device count by department:
Device.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$department', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 5 }
]);

This gave us a dashboard showing which departments have the most active devices."`,
  },

  {
    section: "MongoDB", topic: "Indexing", level: "Advanced",
    q: "What are Indexes in MongoDB? Types and when to use them?",
    a: `What I say in interview:

"An index in MongoDB is exactly like an index in a book — instead of scanning every page, you go straight to the right page. Without indexes, MongoDB does a COLLSCAN — scans every document.

Default index: MongoDB creates a unique index on _id automatically.

Creating an index:
db.devices.createIndex({ serialNumber: 1 }); // 1=ascending, -1=descending

Types of indexes:

1. Single Field Index — most common:
{ serialNumber: 1 }

2. Compound Index — multiple fields:
{ department: 1, status: 1, createdAt: -1 }
// Follows 'Equality, Sort, Range' rule for best use

3. Unique Index — enforce uniqueness:
{ email: 1 }, { unique: true }

4. Text Index — full-text search:
{ name: 'text', description: 'text' }
// Then use $text: { $search: 'Dell laptop' }

5. Sparse Index — index only documents that HAVE the field:
{ phone: 1 }, { sparse: true }
// Useful for optional fields

6. TTL Index — auto-delete documents after time:
{ createdAt: 1 }, { expireAfterSeconds: 3600 }
// Great for sessions, OTP codes, temporary data

7. Partial Index — index only documents matching a filter:
{ status: 1 }, { partialFilterExpression: { status: 'active' } }

How to check if query uses index — use .explain():
Device.find({ serialNumber: 'SN123' }).explain('executionStats')
// Look for: IXSCAN (good) vs COLLSCAN (bad)

Warning: Too many indexes slow down writes. Each write must update all indexes. Rule: index fields you query/sort/filter frequently.

In ERS, I have indexes on: serialNumber (unique), department+status (compound for dashboard queries), assignedTo (for user lookups)."`,
  },

  {
    section: "MongoDB", topic: "Data Modeling", level: "Advanced",
    q: "Embedding vs Referencing in MongoDB — when to use which?",
    a: `What I say in interview:

"This is one of the most important MongoDB design decisions. Unlike SQL where you always normalize, in MongoDB you choose based on how data is accessed.

Embedding (Denormalization) — store related data inside the document:
{
  _id: ObjectId,
  deviceName: 'Dell XPS',
  maintenanceHistory: [           // embedded array
    { date: '2024-01-01', type: 'repair', technician: 'Ram' },
    { date: '2024-03-15', type: 'update', technician: 'Raj' }
  ]
}

Use embedding when:
✅ Data is always accessed together (read together = store together)
✅ 'Has-a' relationship (device HAS maintenance records)
✅ Embedded data doesn't grow unboundedly (< 100 items)
✅ Data doesn't need to exist independently
✅ 1-to-few relationship

Referencing (Normalization) — store only the ID, fetch separately:
{
  _id: ObjectId,
  deviceName: 'Dell XPS',
  assignedTo: ObjectId('user_id')  // reference to User collection
}

Use referencing when:
✅ Related data is accessed independently
✅ Data can be shared across many documents (User assigned to many devices)
✅ 'Has-many' relationship with unbounded growth
✅ Data changes frequently (update one place, reflects everywhere)
✅ 1-to-many or many-to-many relationships

In ERS:
- Device → MaintenanceHistory: EMBEDDED (always viewed with device, bounded)
- Device → AssignedUser: REFERENCE (users exist independently, one user per many devices)
- Device → Tags: EMBEDDED (simple strings, always with device)

General rule: 'Optimize for reads.' MongoDB prefers denormalization because joins ($lookup) are expensive compared to SQL JOINs."`,
  },

  {
    section: "MongoDB", topic: "Transactions", level: "Advanced",
    q: "Does MongoDB support transactions? How do you use them?",
    a: `What I say in interview:

"Yes — MongoDB supports multi-document ACID transactions since version 4.0 (requires replica set) and multi-shard transactions since 4.2.

Before 4.0: single-document operations were atomic. Cross-document operations were NOT atomic.

When do you need transactions?
When you need to update multiple documents and ALL must succeed or ALL must fail.

Example: Transferring device ownership
- Update device.assignedTo = newUser
- Update oldUser.devices (remove device)
- Update newUser.devices (add device)
If step 2 fails, step 1 should also roll back.

With Mongoose transactions:
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All operations pass the session
  await Device.findByIdAndUpdate(
    deviceId,
    { assignedTo: newUserId },
    { session }
  );
  await User.findByIdAndUpdate(
    oldUserId,
    { $pull: { devices: deviceId } },
    { session }
  );
  await User.findByIdAndUpdate(
    newUserId,
    { $push: { devices: deviceId } },
    { session }
  );

  await session.commitTransaction(); // all succeed
} catch (err) {
  await session.abortTransaction(); // all roll back
  throw err;
} finally {
  session.endSession();
}

Important note: Transactions in MongoDB have overhead and need a replica set. For single-document atomicity (which covers most use cases), transactions aren't needed. I only use transactions when I truly need cross-document atomicity."`,
  },

  {
    section: "MongoDB", topic: "Performance", level: "Advanced",
    q: "How do you optimize MongoDB queries? What is the N+1 problem?",
    a: `What I say in interview:

"Query optimization in MongoDB has a few layers:

1. Always use indexes on query fields (biggest impact):
Device.find({ status: 'active' }) // make sure status is indexed
Use .explain('executionStats') to verify IXSCAN

2. Project only needed fields — don't fetch everything:
Device.find({}, { name: 1, status: 1 }) // only name and status
// Never send 50 fields when frontend needs 3

3. Pagination — never return all documents:
Device.find().skip(page * limit).limit(limit)
// Better: cursor-based pagination with _id for large datasets

4. Use aggregation instead of multiple queries

5. Avoid regex without index on large collections

The N+1 Problem — this is a classic interview question:
N+1 happens when you query for N items, then make 1 additional query FOR EACH item.

// ❌ BAD — N+1 problem
const devices = await Device.find(); // 1 query
for (const device of devices) {
  device.user = await User.findById(device.assignedTo); // N queries!
}
// 1 device query + 100 user queries = 101 queries 😱

// ✅ GOOD — use populate (single joined query)
const devices = await Device.find().populate('assignedTo', 'name email');
// 2 queries total (or 1 with $lookup in aggregation)

// ✅ EVEN BETTER — aggregation pipeline with $lookup
Device.aggregate([
  { $lookup: { from: 'users', localField: 'assignedTo', foreignField: '_id', as: 'user' } }
]);

In ERS, I caught an N+1 in our device listing API — it was making 200+ queries per request. Fixed with populate(). Response time dropped from 2s to 80ms."`,
  },

  // ════════════════════════════════════════════════════════
  // SYSTEM DESIGN
  // ════════════════════════════════════════════════════════

  {
    section: "System Design", topic: "Fundamentals", level: "Intermediate",
    q: "What is REST API design? What are the best practices?",
    a: `What I say in interview:

"REST stands for Representational State Transfer. It's an architectural style for building APIs using HTTP.

REST constraints:
1. Stateless — each request has all info needed (no session on server)
2. Client-Server separation — frontend and backend independent
3. Uniform Interface — consistent naming and HTTP methods
4. Cacheable — responses should indicate if they're cacheable

HTTP Methods and their meaning:
GET    /devices         → list all devices (read, no body)
GET    /devices/:id     → get one device
POST   /devices         → create new device (body has data)
PUT    /devices/:id     → replace entire device
PATCH  /devices/:id     → update specific fields only
DELETE /devices/:id     → delete device

URL naming best practices:
✅ Use nouns, not verbs: /devices (not /getDevices)
✅ Use plural: /devices (not /device)
✅ Lowercase with hyphens: /device-types
✅ Nested resources: /users/:id/devices
❌ Avoid: /getAllDevices, /deviceList, /create-device

HTTP Status codes:
200 OK            — success
201 Created       — POST success
204 No Content    — DELETE success
400 Bad Request   — invalid input
401 Unauthorized  — not authenticated
403 Forbidden     — authenticated but no permission
404 Not Found     — resource doesn't exist
409 Conflict      — duplicate resource
422 Unprocessable — validation failed
500 Server Error  — unexpected server error

Response format — consistent JSON:
{
  success: true,
  data: { device: {...} },
  message: 'Device created',
  meta: { total: 100, page: 1, limit: 10 }
}

Versioning: /api/v1/devices — version in URL is simplest and most common approach."`,
  },

  {
    section: "System Design", topic: "Authentication", level: "Intermediate",
    q: "JWT vs Session-based authentication — which do you use and why?",
    a: `What I say in interview:

"Both are valid authentication strategies. I'll explain both and when I use each.

Session-based (Stateful):
1. User logs in → server creates session in DB/Redis → sends session ID as cookie
2. Every request → server looks up session ID in DB → validates
3. Logout → delete session from DB

Pros: Easy to invalidate (just delete session), simple
Cons: Server must store sessions — doesn't scale easily across multiple servers without shared session store (Redis)

JWT (Stateless):
1. User logs in → server creates JWT (signed with secret) → sends to client
2. Every request → client sends JWT → server VERIFIES signature (no DB lookup)
3. Logout → client deletes token (server can't invalidate it directly)

Pros: Stateless — scales horizontally (no shared session store), works for microservices
Cons: Can't easily invalidate before expiry, token grows with payload

JWT structure: header.payload.signature
- Header: algorithm used
- Payload: user data (id, role) — NOT for sensitive data, it's just base64 encoded
- Signature: HMAC(header + payload, secret) — proves it wasn't tampered

My approach in MERN projects:
- Access Token: short-lived JWT (15 min), stored in memory or cookie
- Refresh Token: long-lived (7 days), stored in HttpOnly cookie
- To invalidate: maintain a refresh token blacklist in Redis

Logout mechanism:
- Delete access token from memory
- Blacklist refresh token in Redis with TTL
- Set cookie to expired

In ERS I use JWT with refresh tokens. Auth state lives in Redux, token in memory, refresh token in HttpOnly cookie."`,
  },

  {
    section: "System Design", topic: "Caching", level: "Advanced",
    q: "What is Caching? How do you implement Redis caching in Node.js?",
    a: `What I say in interview:

"Caching is storing the result of an expensive operation so subsequent requests can get it faster without redoing the work.

Why Redis for caching?
- In-memory key-value store → microsecond response times
- Supports TTL (auto-expiry)
- Supports complex data types: strings, lists, hashes, sets
- Persistent (can survive restarts)
- Pub/Sub messaging (I use this in DivTinder for real-time features)

Cache-aside pattern (most common):
async function getDevices(req, res) {
  const cacheKey = 'devices:all';

  // Step 1: Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached)); // fast path
  }

  // Step 2: Cache miss — fetch from DB
  const devices = await Device.find();

  // Step 3: Store in cache with TTL
  await redis.setex(cacheKey, 300, JSON.stringify(devices)); // 300s = 5 min

  res.json(devices);
}

Cache invalidation — update/delete cache when data changes:
async function updateDevice(req, res) {
  const device = await Device.findByIdAndUpdate(req.params.id, req.body);
  await redis.del('devices:all'); // invalidate cache
  res.json(device);
}

Other caching patterns:
- Write-through: write to cache AND DB simultaneously
- Write-back: write to cache, async write to DB (faster writes, risk of data loss)

What to cache:
✅ Frequently read, rarely changed data (device list, lookup tables)
✅ Expensive computation results
✅ Session data
❌ Don't cache: highly dynamic data, sensitive user-specific data

In ERS: I cache the device dashboard summary for 5 minutes. Cache key includes the user's organization ID so different orgs get different cached data."`,
  },

  {
    section: "System Design", topic: "Scalability", level: "Advanced",
    q: "How do you design a scalable Node.js backend? Explain horizontal vs vertical scaling.",
    a: `What I say in interview:

"Scalability means the system can handle growing load without breaking.

Vertical Scaling (Scale Up):
- Add more CPU/RAM/disk to the SAME server
- Simple — no code changes
- Has a limit — you can't add infinite hardware
- Single point of failure still exists

Horizontal Scaling (Scale Out):
- Add MORE servers running the same code
- Each server handles a portion of traffic
- Load balancer distributes requests
- More complex but unlimited scaling
- If one server dies, others keep running

For Node.js horizontal scaling to work, the app must be STATELESS:
- No in-memory sessions (use Redis)
- No local file storage (use S3)
- No server-side WebSocket state (use Redis Pub/Sub)

Architecture for a scalable MERN backend:
Internet → CDN (static files)
        → Load Balancer (Nginx/ALB)
        → Node.js servers (multiple instances, PM2 cluster mode)
        → Redis (caching, sessions, pub/sub)
        → MongoDB (replica set for read scaling)
        → S3 (file storage)

Key patterns I implement:
1. Stateless API — JWT instead of sessions
2. Redis for shared state between instances
3. Connection pooling — Mongoose reuses DB connections
4. Async everywhere — non-blocking I/O
5. Rate limiting with Redis (shared across all instances)
6. Message queues (Bull/BullMQ) for heavy async work — email, reports

In production, I'd use: AWS EC2 + Auto Scaling + Application Load Balancer + ElastiCache (Redis) + MongoDB Atlas. On smaller projects, Render/Railway + MongoDB Atlas works fine."`,
  },

  {
    section: "System Design", topic: "Real-time", level: "Advanced",
    q: "How do WebSockets work? How did you use them in RideTogether?",
    a: `What I say in interview:

"HTTP is request-response — client asks, server answers, connection closes. For real-time features, that's not enough.

WebSocket is a persistent, bidirectional connection. Once established, both client and server can send messages at any time without a new request.

HTTP vs WebSocket:
HTTP:    Client → Request → Server → Response → Connection closed
WS:      Client ←→ Server (connection stays open, both sides push messages)

How Socket.io works (library I use):
// Server (Node.js)
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-ride', (rideId) => {
    socket.join(rideId); // join a room
  });

  socket.on('location-update', ({ rideId, lat, lng }) => {
    // Broadcast to everyone else in the ride room
    socket.to(rideId).emit('rider-moved', { userId: socket.data.userId, lat, lng });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Client (React)
const socket = io('http://localhost:3000');
socket.emit('join-ride', rideId);
socket.on('rider-moved', ({ userId, lat, lng }) => {
  updateMarkerOnMap(userId, lat, lng);
});

In RideTogether (DivTinder):
- Rider shares location every 3 seconds via emit
- Server broadcasts to all users in the same 'ride room'
- Google Maps markers update in real-time for all participants
- When a rider ends the trip, a 'ride-ended' event is emitted

Scaling WebSockets:
With multiple servers, a client on Server A can't receive messages from Server B.
Solution: Redis Pub/Sub adapter (socket.io-redis)
- When Server A broadcasts, it publishes to Redis
- Redis delivers to Server B which forwards to its clients"`,
  },

  {
    section: "System Design", topic: "System Design Patterns", level: "Advanced",
    q: "Design a URL Shortener (like bit.ly) — how would you approach it?",
    a: `What I say in interview:

"This is a classic system design question. I approach it step by step:

Step 1 — Clarify requirements:
- Shorten URLs, redirect to original
- ~100M URLs created per day? Or small scale?
- Analytics needed? Custom aliases?
- Expiry needed?

Step 2 — Capacity estimation:
- 100M URLs/day → 1160/sec writes
- Read:Write ratio = 100:1 → 116,000 reads/sec
- Each URL ~500 bytes → 100M * 500 = 50GB/day storage

Step 3 — API Design:
POST /api/shorten
  Body: { longUrl, customAlias?, expiresAt? }
  Response: { shortCode: 'abc123', shortUrl: 'short.ly/abc123' }

GET /:shortCode
  Response: 301/302 redirect to longUrl

Step 4 — Short code generation:
Option 1: MD5/SHA256 hash of long URL, take first 7 chars
  Risk: collisions possible
Option 2: Base62 encode auto-increment ID
  62^7 = 3.5 trillion unique codes

Step 5 — Database:
{
  shortCode: 'abc123',    // indexed
  longUrl: 'https://...',
  createdBy: userId,
  clickCount: 0,
  expiresAt: Date,
  createdAt: Date
}

Step 6 — Caching (critical for reads):
- 80% of traffic hits 20% of URLs (hot URLs)
- Cache shortCode → longUrl in Redis
- TTL: 24 hours
- On redirect: check Redis first → then DB

Step 7 — Redirect type:
301: Permanent redirect — browser caches it, less server load, but no analytics
302: Temporary redirect — every visit hits server, captures analytics

Step 8 — Scaling:
- Multiple Node servers behind load balancer
- Redis cluster for caching
- MongoDB with shortCode index
- CDN for redirect edge nodes

This shows I think about: requirements, estimation, API design, data modeling, caching, and scaling — the full system design framework."`,
  },

  {
    section: "System Design", topic: "System Design Patterns", level: "Advanced",
    q: "Design a real-time notification system — how would you approach it?",
    a: `What I say in interview:

"A notification system is something I've actually built parts of in both ERS and RideTogether. Here's how I'd design it properly:

Requirements:
- Users receive notifications when events happen (device assigned, ride started)
- Real-time delivery (< 1 second)
- Notification history
- Read/unread state
- Multiple channels: in-app, email, push

Architecture:

Step 1 — Event sources produce events:
When device is assigned → emit 'device.assigned' event
When ride starts → emit 'ride.started' event

Step 2 — Message Queue (Bull/BullMQ + Redis):
Events go to a queue so notifications are processed async
This decouples the event producer from notification delivery

Step 3 — Notification Worker:
- Reads from queue
- Creates notification record in DB
- Delivers via appropriate channels

Step 4 — Real-time delivery with Socket.io:
When notification created → emit to that user's socket room
io.to(userId).emit('notification', { title, body, type });

Step 5 — Data model:
{
  _id: ObjectId,
  userId: ObjectId,       // who receives it
  type: 'device_assigned',
  title: 'Device Assigned',
  body: 'Dell XPS assigned to you',
  isRead: false,
  data: { deviceId: '...' }, // extra context
  createdAt: Date
}

Step 6 — API:
GET  /notifications?page=1&limit=20  → paginated list
PATCH /notifications/:id/read         → mark as read
PATCH /notifications/mark-all-read    → mark all read

Step 7 — Email notifications:
Use Nodemailer + SendGrid/SES
Add email job to separate Bull queue
Worker processes email queue independently

Scaling consideration:
- One user can be connected to different server instances
- Redis Pub/Sub ensures correct server delivers to correct socket connection
- Queue ensures notifications aren't lost if delivery fails (retry logic)"`,
  },

  {
    section: "System Design", topic: "System Design Patterns", level: "Advanced",
    q: "What is microservices architecture? When would you use it vs monolith?",
    a: `What I say in interview:

"A monolith is a single deployable unit where all features live together. Microservices splits that into multiple independent services, each with its own deployment and (often) database.

Monolith:
[Auth + Devices + Users + Reports] → single app → single DB

Microservices:
[Auth Service] → Auth DB
[Device Service] → Device DB
[User Service] → User DB
[Report Service] → Report DB
All talk via API or Message Queue

Advantages of Microservices:
✅ Independent deployments — update Auth without touching Devices
✅ Independent scaling — scale only Device service if it's under load
✅ Technology flexibility — different services can use different tech
✅ Team autonomy — different teams own different services
✅ Fault isolation — Device service crash doesn't bring down Auth

Disadvantages of Microservices:
❌ Distributed system complexity — network calls between services
❌ Data consistency across services is hard
❌ More DevOps overhead (Docker, Kubernetes, service mesh)
❌ Debugging harder — trace requests across 5 services
❌ Latency — API calls instead of function calls
❌ Testing is complex

When to use Monolith (most startups):
✅ Small team (< 15 engineers)
✅ Still figuring out domain boundaries
✅ Fast iteration is priority
✅ Limited DevOps capacity

When to use Microservices:
✅ Large team with clear domain ownership
✅ Different scaling requirements per service
✅ Different tech requirements per service
✅ Mature DevOps setup (CI/CD, K8s)

My honest answer: ERS is a monolith. That's the right choice for our team size. I'd design it with clean module separation so migration to microservices is possible later."`,
  },

  {
    section: "System Design", topic: "Fundamentals", level: "Intermediate",
    q: "What is the CAP theorem? How does MongoDB fit in?",
    a: `What I say in interview:

"CAP theorem states that a distributed system can guarantee at most 2 out of 3 properties:

C — Consistency: Every read returns the most recent write
A — Availability: Every request gets a response (success or failure)
P — Partition Tolerance: System works even if network partition (nodes can't talk to each other) occurs

The KEY insight: Network partitions WILL happen in distributed systems. So you MUST have P. That means the real choice is: CP or AP.

CP System (Consistent + Partition Tolerant):
- When partition happens, system refuses to respond rather than return stale data
- Example: MongoDB (with majority read/write concern)
- Good for: banking, inventory, anywhere stale data is dangerous

AP System (Available + Partition Tolerant):
- When partition happens, system returns possibly stale data rather than refusing
- Example: Cassandra, CouchDB, DynamoDB
- Good for: social feeds, product catalogs, anywhere slight staleness is okay

Where MongoDB fits:
By default, MongoDB is CP — it prioritizes consistency.
- Writes go to primary node
- With readPreference: 'primary' — you always read latest data
- With readPreference: 'secondaryPreferred' — you might read stale data (more available)
- writeConcern: 'majority' — write is confirmed by majority of nodes before success

In practice, modern systems like MongoDB allow you to tune the tradeoffs:
- Strong consistency on some operations
- Eventual consistency on others
This is why CAP theorem is now often discussed as PACELC (extends CAP with latency tradeoffs).

I mention this in interviews to show I understand that database choice depends on business requirements."`,
  },

  {
    section: "System Design", topic: "Fundamentals", level: "Advanced",
    q: "What is rate limiting? How do you implement it?",
    a: `What I say in interview:

"Rate limiting controls how many requests a client can make in a time window. It protects APIs from abuse, brute force, and DDoS attacks.

Common algorithms:

1. Fixed Window Counter (simplest):
Count requests per user per window (e.g., 100 requests per minute)
Problem: allows burst at window boundary (100 at 0:59 + 100 at 1:01 = 200 in 2 seconds)

2. Sliding Window Log:
Store timestamp of each request in Redis sorted set
Count only requests in last N seconds
More accurate but uses more memory

3. Token Bucket (most flexible):
Bucket has capacity of N tokens, refills at rate R per second
Each request costs 1 token
Allows bursts up to bucket size
Used by AWS API Gateway

4. Leaky Bucket:
Requests added to queue, processed at fixed rate
Smooths out traffic spikes

Implementation in Express with Redis (Sliding Window):
const rateLimit = async (req, res, next) => {
  const key = \`rate:\${req.ip}\`;
  const now = Date.now();
  const window = 60 * 1000; // 1 minute
  const limit = 100;

  // Remove old entries outside window
  await redis.zremrangebyscore(key, 0, now - window);

  // Count current requests
  const count = await redis.zcard(key);

  if (count >= limit) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: 60
    });
  }

  // Add current request timestamp
  await redis.zadd(key, now, now);
  await redis.expire(key, 60);

  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', limit - count - 1);
  next();
};

In Express, express-rate-limit library handles this simply.
For production: use Redis store so rate limits are shared across all server instances.

In ERS: login endpoint has strict rate limiting (10 attempts/15 min). General API has 1000 requests/15 min."`,
  },

  {
    section: "System Design", topic: "Database Design", level: "Advanced",
    q: "What is database indexing strategy? Explain with a real scenario.",
    a: `What I say in interview:

"Indexing is the single biggest performance lever you have in MongoDB. The right indexes can make queries 1000x faster. Wrong indexes waste write performance.

How MongoDB finds documents without an index:
Collection Scan (COLLSCAN) — reads EVERY document.
With 1 million devices, finding one by serialNumber scans all 1M. Terrible.

With an index:
Index Scan (IXSCAN) — jumps directly to matching documents via B-tree.

My indexing strategy process:
Step 1: Identify your query patterns (what does your app actually query?)
Step 2: Create indexes based on those patterns
Step 3: Verify with .explain()

Real scenario from ERS — Device listing with filters:
// App query:
Device.find({
  organization: orgId,     // filter
  status: 'active',        // filter
  department: 'IT'         // filter
}).sort({ createdAt: -1 }) // sort

// Create compound index:
deviceSchema.index({ organization: 1, status: 1, department: 1, createdAt: -1 });

ESR Rule for compound indexes: Equality first, Sort second, Range last
Equality fields: exact match (organization, status, department)
Sort fields: (createdAt: -1)
Range fields: ($gt, $lt queries)

Index on text search:
deviceSchema.index({ name: 'text', serialNumber: 'text' });
// Query: Device.find({ $text: { $search: 'Dell' } })

Index for ref lookups (populate):
deviceSchema.index({ assignedTo: 1 }); // speeds up populate

Things that kill index performance:
❌ Using index field in a function: { $where: 'this.name.toLowerCase()...' }
❌ Leading wildcard regex: { name: /.*Dell/ } — can't use index
✅ Anchored regex: { name: /^Dell/ } — CAN use index

Monitor slow queries in MongoDB Atlas with Query Profiler."`,
  },

  {
    section: "System Design", topic: "System Design Patterns", level: "Advanced",
    q: "How would you design the ERS Device Management System you work on?",
    a: `What I say in interview:

"This is great because I can speak from real experience.

The ERS system tracks company devices — laptops, phones, printers — assigns them to employees, and maintains their lifecycle.

Requirements I identified:
Functional: Add/update/delete devices, assign to employees, track status (active/repair/retired), generate reports, search and filter
Non-functional: Multi-tenant (multiple organizations), role-based access, export reports, real-time dashboard counts

Data Models:
Device: { name, serialNumber, category, status, organization, assignedTo, purchaseDate, warrantyExpiry, specs, history[] }
User: { name, email, role (admin/manager/employee), organization }
Organization: { name, domain, plan }
MaintenanceLog: { deviceId, type, date, notes, technician }

API Structure:
POST   /api/v1/auth/login
GET    /api/v1/devices?status=active&dept=IT&page=1
POST   /api/v1/devices
PATCH  /api/v1/devices/:id/assign
GET    /api/v1/reports/summary
GET    /api/v1/reports/export (streams CSV)

Key technical decisions I made:
1. JWT for auth (stateless, fits multi-tenant)
2. Organization ID on every document + every query (data isolation)
3. Compound indexes: {organization, status}, {organization, assignedTo}
4. Redis cache for dashboard summary counts (5min TTL)
5. Streaming for CSV export (avoid memory issues with large datasets)
6. Role middleware: admin > manager > employee permission levels
7. Soft delete (isDeleted flag) — devices have audit history

If I were scaling it:
- Add Redis cache aggressively on read-heavy endpoints
- Move report generation to a background job (Bull queue)
- Add MongoDB Atlas search for full-text device search
- Separate read replicas for report queries

This answer shows: I designed it, I understand the tradeoffs, and I know what I'd improve."`,
  },
];

// ── Config ──────────────────────────────────────────────
const SECTIONS = ["All", "Node.js", "Express.js", "MongoDB", "System Design"];

const SEC_META = {
  "Node.js":       { color: "#4ade80", icon: "⬡" },
  "Express.js":    { color: "#fb923c", icon: "⚡" },
  "MongoDB":       { color: "#34d399", icon: "🍃" },
  "System Design": { color: "#a78bfa", icon: "🏗" },
};

const LEVEL_STYLE = {
  Basic:        { bg: "rgba(34,197,94,0.1)",  border: "#22c55e", text: "#4ade80" },
  Intermediate: { bg: "rgba(234,179,8,0.1)",  border: "#eab308", text: "#facc15" },
  Advanced:     { bg: "rgba(239,68,68,0.1)",  border: "#ef4444", text: "#f87171" },
};

const TOPIC_COLORS = {
  "Core Concepts": "#60a5fa",
  "Modules": "#a78bfa",
  "Worker Threads & Clustering": "#f472b6",
  "Error Handling": "#f87171",
  "Performance": "#fb923c",
  "Middleware": "#facc15",
  "Routing": "#34d399",
  "Security": "#f43f5e",
  "Core Concepts": "#4ade80",
  "Queries": "#38bdf8",
  "Aggregation": "#a78bfa",
  "Indexing": "#fbbf24",
  "Data Modeling": "#34d399",
  "Transactions": "#e879f9",
  "Fundamentals": "#60a5fa",
  "Authentication": "#fb923c",
  "Caching": "#f43f5e",
  "Scalability": "#4ade80",
  "Real-time": "#38bdf8",
  "System Design Patterns": "#a78bfa",
  "Database Design": "#fbbf24",
};

export default function Backend() {
  const [filter, setFilter]     = useState("All");
  const [current, setCurrent]   = useState(0);
  const [flipped, setFlipped]   = useState(false);
  const [answered, setAnswered] = useState(new Set());
  const [showAll, setShowAll]   = useState(false);

  const filtered = filter === "All" ? questions : questions.filter(q => q.section === filter);
  const q        = filtered[current];
  const lc       = q ? LEVEL_STYLE[q.level] : LEVEL_STYLE.Basic;
  const sm       = q ? SEC_META[q.section]  : SEC_META["Node.js"];
  const gi       = q ? questions.indexOf(q) : -1;
  const isDone   = answered.has(gi);

  const goTo = (i) => { setCurrent(i); setFlipped(false); };
  const markDone = () => setAnswered(prev => new Set([...prev, gi]));

  const counts = SECTIONS.slice(1).map(s => ({
    label: s, color: SEC_META[s].color,
    total: questions.filter(q => q.section === s).length,
    done:  questions.filter(q => q.section === s && answered.has(questions.indexOf(q))).length,
  }));

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f",
      color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace",
      display: "flex", flexDirection: "column",
    }}>

      {/* ── Header ── */}
      <div style={{ background: "#0c0c1e", borderBottom: "1px solid #1e293b", padding: "14px 18px 10px" }}>
        <div style={{ fontSize: 9, color: "#334155", letterSpacing: 3, marginBottom: 4 }}>BACKEND + SYSTEM DESIGN PREP</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>
          <span style={{ color: "#4ade80" }}>Node.js</span>
          <span style={{ color: "#334155" }}> · </span>
          <span style={{ color: "#fb923c" }}>Express</span>
          <span style={{ color: "#334155" }}> · </span>
          <span style={{ color: "#34d399" }}>MongoDB</span>
          <span style={{ color: "#334155" }}> · </span>
          <span style={{ color: "#a78bfa" }}>System Design</span>
        </div>

        {/* Progress cards */}
        <div style={{ display: "flex", gap: 6 }}>
          {counts.map(c => (
            <div key={c.label} style={{
              flex: 1, background: "#111827", borderRadius: 8,
              padding: "6px 8px", border: `1px solid ${c.color}20`,
            }}>
              <div style={{ fontSize: 8, color: "#334155", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden" }}>
                {c.label.split(' ')[0]}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.color }}>
                {c.done}<span style={{ color: "#334155" }}>/{c.total}</span>
              </div>
              <div style={{ height: 2, background: "#1e293b", borderRadius: 99, marginTop: 4 }}>
                <div style={{
                  height: "100%", borderRadius: 99, background: c.color,
                  width: `${c.total ? (c.done / c.total) * 100 : 0}%`,
                  transition: "width 0.4s",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section Filter ── */}
      <div style={{
        display: "flex", gap: 5, padding: "10px 18px",
        background: "#0c0c1e", borderBottom: "1px solid #1e293b",
        overflowX: "auto",
      }}>
        {SECTIONS.map(s => {
          const active = filter === s;
          const col = s === "All" ? "#94a3b8" : SEC_META[s].color;
          return (
            <button key={s} onClick={() => { setFilter(s); goTo(0); }} style={{
              flex: "0 0 auto", padding: "6px 12px", borderRadius: 99, fontSize: 10,
              border: active ? `1px solid ${col}` : "1px solid #1e293b",
              background: active ? `${col}18` : "transparent",
              color: active ? col : "#475569",
              cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 700 : 400,
              whiteSpace: "nowrap",
            }}>{s}</button>
          );
        })}
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height: 2, background: "#1e293b" }}>
        <div style={{
          height: "100%",
          width: `${filtered.length ? ((current + 1) / filtered.length) * 100 : 0}%`,
          background: sm?.color || "#60a5fa", transition: "width 0.3s",
        }} />
      </div>

      {/* ── Card ── */}
      {q && (
        <div style={{ flex: 1, padding: "12px 18px 10px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                background: `${sm.color}18`, border: `1px solid ${sm.color}55`,
                color: sm.color, fontSize: 9, fontWeight: 700,
                padding: "2px 8px", borderRadius: 6,
              }}>{sm.icon} {q.section}</span>
              <span style={{ fontSize: 9, color: TOPIC_COLORS[q.topic] || "#94a3b8" }}>
                {q.topic}
              </span>
              {isDone && <span style={{ fontSize: 9, color: "#4ade80" }}>✓ DONE</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 9, color: "#334155" }}>{current + 1}/{filtered.length}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                background: lc.bg, border: `1px solid ${lc.border}`, color: lc.text,
              }}>{q.level}</span>
            </div>
          </div>

          {/* Question */}
          <div style={{
            background: "#0f172a", border: `1px solid #1e293b`,
            borderLeft: `3px solid ${sm.color}`,
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 8, color: "#334155", letterSpacing: 2, marginBottom: 8 }}>QUESTION</div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: "#f1f5f9", fontWeight: 600 }}>
              {q.q}
            </div>
          </div>

          {/* Answer toggle */}
          {!flipped ? (
            <button onClick={() => setFlipped(true)} style={{
              background: `linear-gradient(135deg, ${sm.color}10, ${sm.color}05)`,
              border: `1px solid ${sm.color}44`,
              borderRadius: 12, padding: "14px",
              cursor: "pointer", color: sm.color,
              fontSize: 13, fontFamily: "inherit", textAlign: "center",
            }}>
              🎤 Show Interview Answer
            </button>
          ) : (
            <div style={{
              background: "#080f08", border: "1px solid #166534",
              borderRadius: 12, padding: "14px 16px", flex: 1,
              maxHeight: showAll ? "none" : "340px",
              overflow: showAll ? "visible" : "hidden",
              position: "relative",
            }}>
              <div style={{ fontSize: 8, color: "#4ade80", letterSpacing: 2, marginBottom: 8 }}>
                🎤 INTERVIEW ANSWER
              </div>
              <pre style={{
                fontSize: 11.5, lineHeight: 1.85, color: "#d1fae5",
                whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit",
              }}>{q.a}</pre>
              {!showAll && (
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 80,
                  background: "linear-gradient(transparent, #080f08)",
                  borderRadius: "0 0 12px 12px",
                  display: "flex", alignItems: "flex-end", justifyContent: "center",
                  paddingBottom: 8,
                }}>
                  <button onClick={() => setShowAll(true)} style={{
                    background: "#166534", border: "1px solid #4ade80",
                    color: "#4ade80", borderRadius: 8, padding: "4px 16px",
                    fontSize: 10, cursor: "pointer", fontFamily: "inherit",
                  }}>▼ Show full answer</button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { goTo(Math.max(0, current - 1)); setShowAll(false); }}
              disabled={current === 0}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 12,
                border: "1px solid #1e293b", background: "#0f172a",
                color: current === 0 ? "#1e293b" : "#94a3b8",
                cursor: current === 0 ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>← Prev</button>

            {flipped && !isDone && (
              <button onClick={markDone} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 12,
                border: "1px solid #166534", background: "#052e16",
                color: "#4ade80", cursor: "pointer", fontFamily: "inherit",
              }}>✓ Got it</button>
            )}

            <button onClick={() => { goTo(Math.min(filtered.length - 1, current + 1)); setShowAll(false); }}
              disabled={current === filtered.length - 1}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 12,
                border: "1px solid #1e293b", background: "#0f172a",
                color: current === filtered.length - 1 ? "#1e293b" : "#94a3b8",
                cursor: current === filtered.length - 1 ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>Next →</button>
          </div>

          {/* Dot nav */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
            {filtered.map((fq, i) => {
              const fgi  = questions.indexOf(fq);
              const done = answered.has(fgi);
              const col  = SEC_META[fq.section]?.color || "#60a5fa";
              return (
                <button key={i} onClick={() => { goTo(i); setShowAll(false); }} style={{
                  width: 22, height: 22, borderRadius: 5, border: "none",
                  fontSize: 8, cursor: "pointer", fontFamily: "inherit",
                  background: i === current ? col : done ? "#052e16" : "#1e293b",
                  color: i === current ? "#000" : done ? "#4ade80" : "#334155",
                  fontWeight: i === current ? 700 : 400,
                }}>{i + 1}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: "8px 18px 14px", borderTop: "1px solid #1e293b",
        background: "#0c0c1e", fontSize: 8, color: "#1e293b",
        textAlign: "center", lineHeight: 1.8,
      }}>
        Node.js: Event Loop · Streams · Buffers · Workers · Clustering · CJS vs ESM
        Express: Middleware · Auth · Routing · Error Handling · Security
        MongoDB: Queries · Aggregation · Indexes · Embedding vs Ref · Transactions · N+1
        System Design: REST · JWT · Caching · Scaling · WebSockets · URL Shortener · Notifications · Microservices · CAP · Rate Limiting
      </div>
    </div>
  );
}