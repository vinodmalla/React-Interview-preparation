import { useState } from "react";

const questions = [
  // ─── SECTION 1: CORE FUNDAMENTALS ───
  {
    section: "Core Fundamentals",
    level: "Basic",
    q: "What is React and why is it used?",
    a: `React is a JavaScript library by Meta for building fast, component-based UIs.

WHY React:
• Component-based → reusable, isolated pieces of UI
• Virtual DOM → React computes minimal real DOM updates → fast rendering
• One-way data flow → predictable state management
• Huge ecosystem → React Router, Redux, Next.js

💬 Interview line: "React lets me break UI into small reusable components and updates only what changed in the DOM using the Virtual DOM — making apps fast and maintainable."`,
  },
  {
    section: "Core Fundamentals",
    level: "Basic",
    q: "What is JSX? Why can't browsers read it directly?",
    a: `JSX = JavaScript XML. It lets you write HTML-like syntax inside JS.

const el = <h1>Hello, Vinod</h1>;

Browsers can't read JSX because it's NOT valid JS. Babel compiles it to:
React.createElement('h1', null, 'Hello, Vinod')

💬 Interview line: "JSX is syntactic sugar — Babel transforms it into React.createElement calls that the browser can understand."`,
  },
  {
    section: "Core Fundamentals",
    level: "Basic",
    q: "What is the Virtual DOM? How does React use it?",
    a: `Virtual DOM = a lightweight JS copy of the real DOM kept in memory.

How it works (Reconciliation):
1. State changes → React creates a new Virtual DOM tree
2. Compares new vs old tree (diffing algorithm)
3. Finds the minimum changes needed
4. Updates ONLY those parts in the real DOM (patching)

WHY: Real DOM manipulation is slow. Virtual DOM batches updates and minimizes repaints.

💬 Interview line: "React diffs the Virtual DOM trees before touching the real DOM — so UI updates are surgical, not full re-renders."`,
  },
  {
    section: "Core Fundamentals",
    level: "Basic",
    q: "Functional vs Class Components — what's the difference?",
    a: `Class Component:
class Counter extends React.Component {
  state = { count: 0 }
  render() { return <div>{this.state.count}</div> }
}

Functional Component (modern):
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

Key differences:
• Functional: simpler, no 'this', uses Hooks
• Class: lifecycle methods (componentDidMount etc.), more boilerplate
• React team recommends Functional Components since React 16.8+

💬 Interview line: "I always use functional components with hooks — they're cleaner, easier to test, and the React team officially prefers them."`,
  },
  {
    section: "Core Fundamentals",
    level: "Basic",
    q: "What are Props? How are they different from State?",
    a: `Props (Properties):
• Passed FROM parent TO child — read-only in child
• Like function arguments
• Child cannot modify props

State:
• Local data owned by the component
• Can be changed (triggers re-render)
• Managed inside the component

Example:
// Parent passes prop
<UserCard name="Vinod" />

// Child uses prop (read-only)
function UserCard({ name }) { return <h1>{name}</h1> }

💬 Interview line: "Props flow down (parent to child) and are immutable inside the child. State is internal, mutable, and triggers re-render when it changes."`,
  },

  // ─── SECTION 2: HOOKS ───
  {
    section: "React Hooks",
    level: "Intermediate",
    q: "What is useState? When does re-render happen?",
    a: `useState gives functional components local state.

const [count, setCount] = useState(0);

Rules:
• setCount(newValue) → triggers re-render
• React does NOT re-render if you set the same value (shallow comparison)
• State updates are ASYNCHRONOUS — don't read state right after setting

Functional update (when new state depends on old):
setCount(prev => prev + 1); // ✅ safe
setCount(count + 1);        // ❌ can be stale in async

💬 Interview line: "I always use the functional form of setState when the new value depends on the previous one — avoids stale closure bugs."`,
  },
  {
    section: "React Hooks",
    level: "Intermediate",
    q: "Explain useEffect — what does it replace from class components?",
    a: `useEffect runs side effects after render.

Replaces:
• componentDidMount     → useEffect(() => {}, [])
• componentDidUpdate    → useEffect(() => {}, [dep])
• componentWillUnmount → return cleanup function

useEffect(() => {
  const sub = socket.connect();
  return () => sub.disconnect(); // cleanup
}, [roomId]); // runs when roomId changes

Dependency array rules:
• []      → run once on mount
• [a, b]  → run when a or b changes
• no arr  → run after EVERY render (dangerous!)

💬 Interview line: "useEffect with cleanup is how I handle subscriptions and timers — the return function prevents memory leaks."`,
  },
  {
    section: "React Hooks",
    level: "Intermediate",
    q: "What is useRef? Give two real use cases.",
    a: `useRef returns a mutable object { current: value } that persists across renders WITHOUT causing re-render.

Use Case 1 — DOM access:
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus(); // focus input programmatically

Use Case 2 — Store mutable value without re-render:
const timerRef = useRef(null);
timerRef.current = setTimeout(...); // won't trigger re-render

Key difference from useState:
• useState change → re-render
• useRef change → NO re-render

💬 Interview line: "I used useRef in RideTogether to store the Google Maps instance — I didn't want map re-initialization on every render."`,
  },
  {
    section: "React Hooks",
    level: "Intermediate",
    q: "What is useCallback? When should you use it?",
    a: `useCallback memoizes a function — returns the SAME function reference across renders unless dependencies change.

WHY: In React, functions are recreated on every render.
If you pass a function as prop to a child, child re-renders unnecessarily.

const handleClick = useCallback(() => {
  doSomething(id);
}, [id]); // only recreated when id changes

When to use:
✅ Passing callbacks to memoized child components (React.memo)
✅ As dependency in useEffect to avoid infinite loops

When NOT to use:
❌ Don't wrap every function — has overhead itself

💬 Interview line: "useCallback prevents child components from re-rendering due to new function references on every parent render."`,
  },
  {
    section: "React Hooks",
    level: "Intermediate",
    q: "What is useMemo? How is it different from useCallback?",
    a: `useMemo memoizes a computed VALUE (not a function).

const expensiveResult = useMemo(() => {
  return heavyCalculation(data); // only runs when data changes
}, [data]);

useCallback vs useMemo:
• useCallback(fn, deps)    → memoizes the FUNCTION itself
• useMemo(() => val, deps) → memoizes the RETURN VALUE

Same goal: avoid unnecessary recomputation/re-renders.

When to use useMemo:
✅ Expensive filtering/sorting of large arrays
✅ Complex derived data calculations

❌ Don't over-memoize — profiler first, optimize second

💬 Interview line: "I use useMemo when I have expensive derivations like filtering 1000+ records — it skips recalculation on unrelated re-renders."`,
  },
  {
    section: "React Hooks",
    level: "Intermediate",
    q: "What is useContext? How does it solve prop drilling?",
    a: `Prop drilling = passing props through many intermediate components that don't need them.

useContext solves this by providing global-like state.

// 1. Create context
const ThemeContext = createContext('light');

// 2. Provide at top level
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 3. Consume anywhere in tree (no prop passing!)
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>
}

When to use:
✅ Theme, language, auth user, permissions
❌ Frequently changing state (causes all consumers to re-render) — use Redux/Zustand instead

💬 Interview line: "I use Context for app-wide concerns like auth state and theme. For high-frequency updates, I'd use Redux or Zustand to avoid over-rendering."`,
  },
  {
    section: "React Hooks",
    level: "Intermediate",
    q: "What is useReducer? When to use it over useState?",
    a: `useReducer manages complex state logic using a reducer function (like Redux pattern).

const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch(action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'RESET':     return { count: 0 };
    default:          return state;
  }
}

dispatch({ type: 'INCREMENT' });

Use useReducer when:
✅ State has multiple sub-values
✅ Next state depends on previous state
✅ Complex state transitions (form with many fields)

Use useState when:
✅ Simple, independent values

💬 Interview line: "useReducer shines for form state or multi-step flows where transitions are complex — it keeps logic centralized in the reducer."`,
  },

  // ─── SECTION 3: COMPONENT PATTERNS ───
  {
    section: "Component Patterns",
    level: "Intermediate",
    q: "What is React.memo? How does it prevent unnecessary re-renders?",
    a: `React.memo is a HOC that memoizes a component — skips re-render if props haven't changed (shallow comparison).

const UserCard = React.memo(function UserCard({ name }) {
  return <div>{name}</div>;
});

// Parent re-renders → UserCard re-renders ONLY if 'name' changed

Shallow comparison means:
✅ Primitives (string, number) → works perfectly
❌ Objects/arrays → new reference = re-render (use useMemo for stable refs)

Combine with useCallback for function props:
const handler = useCallback(() => {}, []);
<UserCard onClick={handler} /> // stable reference → no re-render

💬 Interview line: "React.memo + useCallback is my go-to combo to prevent child re-renders when only unrelated parent state changes."`,
  },
  {
    section: "Component Patterns",
    level: "Intermediate",
    q: "What are Higher-Order Components (HOC)?",
    a: `HOC = a function that takes a component and returns a new enhanced component.

function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const isLoggedIn = useAuth();
    if (!isLoggedIn) return <Redirect to="/login" />;
    return <WrappedComponent {...props} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);

Common HOC use cases:
• Authentication guards
• Logging / analytics
• Theming
• Feature flags

Modern alternative: Custom Hooks (preferred now)
HOCs are still seen in older codebases and libraries like Redux connect().

💬 Interview line: "HOCs were the pattern before hooks. Now I prefer custom hooks for reuse — cleaner and easier to compose without wrapper hell."`,
  },
  {
    section: "Component Patterns",
    level: "Intermediate",
    q: "What are Custom Hooks? Build one example.",
    a: `Custom hooks = reusable functions that use built-in hooks internally.

Rule: name must start with 'use'

Example — useFetch:
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage anywhere:
const { data, loading } = useFetch('/api/users');

Benefits:
✅ Reuse stateful logic across components
✅ Clean, testable, no wrapper components

💬 Interview line: "I extracted API call logic into a useFetch hook in my RideTogether project — any component could call it without duplicating useEffect logic."`,
  },
  {
    section: "Component Patterns",
    level: "Intermediate",
    q: "What is the difference between Controlled and Uncontrolled components?",
    a: `Controlled Component:
React controls the form value via state.

const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />

• Source of truth: React state
• Full control — validation, formatting on every keystroke

Uncontrolled Component:
DOM controls its own value. You read it via ref.

const ref = useRef();
<input ref={ref} />
// read: ref.current.value on submit

• Source of truth: DOM itself
• Simpler for basic cases, file inputs

When to use what:
✅ Controlled → complex forms, real-time validation
✅ Uncontrolled → simple forms, file uploads, 3rd party DOM libs

💬 Interview line: "I use controlled components for all my forms — gives me full control for real-time validation and conditional UI."`,
  },

  // ─── SECTION 4: PERFORMANCE ───
  {
    section: "Performance Optimization",
    level: "Advanced",
    q: "What causes unnecessary re-renders in React? How do you fix them?",
    a: `Common causes:
1. Parent re-renders → all children re-render by default
2. New object/array reference passed as prop every render
3. Context value changes → all consumers re-render
4. Inline functions in JSX: onClick={() => fn()} — new reference each time

Fixes:
1. React.memo  → skip child re-render if props unchanged
2. useCallback → stable function references
3. useMemo     → stable object/array references
4. Split Context → separate frequently-changing from rarely-changing context
5. Lazy state initialization → useState(() => expensiveFn())

Debug tool: React DevTools Profiler → shows which components re-rendered and why

💬 Interview line: "I always profile before optimizing — React DevTools Profiler shows the render flame graph and highlights wasted renders."`,
  },
  {
    section: "Performance Optimization",
    level: "Advanced",
    q: "What is Code Splitting? How does React.lazy work?",
    a: `Code splitting = splitting your JS bundle into smaller chunks loaded on demand, instead of one giant bundle.

React.lazy + Suspense:
const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}

What happens:
• Dashboard.js is NOT in the initial bundle
• Downloaded only when user navigates to it
• Suspense shows fallback while loading

Common split points:
✅ Routes (most impactful)
✅ Modals and heavy components
✅ Admin panels

💬 Interview line: "In my projects I route-based code split using React.lazy — initial load is faster because users only download what they need."`,
  },
  {
    section: "Performance Optimization",
    level: "Advanced",
    q: "What is React.Suspense? What are its use cases?",
    a: `Suspense lets you declaratively show a fallback while something is loading.

Use Case 1 — Lazy loading (stable):
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>

Use Case 2 — Data fetching (React 18+, experimental/concurrent):
Works with frameworks like Next.js, Relay that integrate with Suspense

Key points:
• fallback = what to show while the child "suspends"
• Can be nested — each level catches its nearest Suspense boundary
• Works with React.lazy today
• Future: will work with all async data fetching

💬 Interview line: "Suspense is React's way of handling async UI declaratively — instead of isLoading booleans everywhere, I wrap in Suspense with a clean fallback."`,
  },
  {
    section: "Performance Optimization",
    level: "Advanced",
    q: "What is Reconciliation and the Diffing Algorithm?",
    a: `Reconciliation = the process React uses to decide what to update in the real DOM.

React's diffing rules:
1. Different element type → destroy old, build new subtree
   <div> vs <span> → completely replaced

2. Same type → update only changed attributes
   <div className="a"> → <div className="b"> → only class updated

3. Lists use 'key' prop to identify items efficiently

WHY keys matter in lists:
// ❌ Bad — React re-renders all items on reorder
{items.map((item, index) => <li key={index}>{item}</li>)}

// ✅ Good — React identifies by stable ID
{items.map(item => <li key={item.id}>{item.name}</li>)}

💬 Interview line: "Using index as key is a footgun — if items reorder, React remounts everything. Always use stable unique IDs."`,
  },

  // ─── SECTION 5: ADVANCED PATTERNS ───
  {
    section: "Advanced Concepts",
    level: "Advanced",
    q: "What is the React Fiber architecture?",
    a: `Fiber = React's internal reconciliation engine (rewritten in React 16).

Problem with old React (Stack reconciler):
• Rendering was synchronous — couldn't be interrupted
• Long renders would block the UI (janky)

Fiber solves this by making rendering:
• Interruptible — can pause and resume work
• Prioritized — urgent updates (user input) beat background work
• Incremental — can split work into chunks

This enables React 18 features:
• Concurrent Mode
• useTransition
• Suspense for data
• Automatic batching

💬 Interview line: "Fiber is what makes React concurrent — it lets React pause rendering to handle higher-priority events like user clicks, then resume background work."`,
  },
  {
    section: "Advanced Concepts",
    level: "Advanced",
    q: "What is useTransition in React 18?",
    a: `useTransition marks a state update as non-urgent — React can defer it while keeping the UI responsive.

const [isPending, startTransition] = useTransition();

// Urgent: search input update (immediate)
setQuery(e.target.value);

// Non-urgent: filtering 10,000 items (deferred)
startTransition(() => {
  setFilteredResults(filter(data, query));
});

// isPending = true while deferred update is in progress
{isPending && <Spinner />}

Before useTransition: heavy state updates blocked user input.
After: input stays snappy, heavy work happens in background.

💬 Interview line: "useTransition was a game-changer for search UX — the input updates instantly while the results filtering happens in the background without freezing."`,
  },
  {
    section: "Advanced Concepts",
    level: "Advanced",
    q: "What is Error Boundary? How do you implement one?",
    a: `Error Boundary = a class component that catches JS errors in its child tree and shows a fallback UI instead of crashing the whole app.

(Must be a class component — no hook equivalent yet)

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logError(error, info); // send to monitoring
  }

  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}

// Usage:
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>

💬 Interview line: "I wrap critical sections like Dashboard and payments in Error Boundaries — one bad component doesn't take down the entire app."`,
  },
  {
    section: "Advanced Concepts",
    level: "Advanced",
    q: "What is the difference between SSR, CSR, and SSG?",
    a: `CSR (Client-Side Rendering) — React default:
• Browser downloads empty HTML + JS bundle
• JS runs, React renders in browser
• First paint slow, but fast after hydration
• Bad for SEO

SSR (Server-Side Rendering) — Next.js getServerSideProps:
• Server renders full HTML per request
• Browser gets pre-filled HTML → fast first paint
• Good for SEO, but server load per request

SSG (Static Site Generation) — Next.js getStaticProps:
• HTML generated at BUILD TIME
• Served from CDN → fastest possible
• Best for content that doesn't change per user

ISR (Incremental Static Regeneration):
• SSG but pages regenerate in background after set interval

💬 Interview line: "For RideTogether's public landing page I'd use SSG for speed. For user dashboards with live data — CSR or SSR with React Query."`,
  },
  {
    section: "Advanced Concepts",
    level: "Advanced",
    q: "What is Prop Drilling and what are the solutions?",
    a: `Prop Drilling = passing props down through many layers of components that don't use them — just to reach a deeply nested child.

Problem:
App → Layout → Sidebar → NavItem → UserAvatar (needs user)
All intermediate components receive 'user' but don't use it.

Solutions (in order of preference):
1. Component Composition — restructure components
2. useContext — great for static/slow-changing data (theme, user)
3. Redux / Zustand — for complex, frequently-changing global state
4. React Query / SWR — for server state (API data)

Component Composition trick:
// Instead of drilling, pass components as children/props
<Layout sidebar={<UserSidebar user={user} />}>
  <Main />
</Layout>

💬 Interview line: "Prop drilling past 2 levels is a design smell. I restructure first with composition, then reach for Context or Zustand if needed."`,
  },

  // ─── SECTION 6: REACT ROUTER & STATE MANAGEMENT ───
  {
    section: "Routing & State",
    level: "Intermediate",
    q: "How does React Router v6 work? Key concepts?",
    a: `React Router v6 key concepts:

1. BrowserRouter — wraps app, provides routing context
2. Routes + Route — defines URL-to-component mapping
3. Link / NavLink — navigation without page reload
4. useNavigate — programmatic navigation
5. useParams — read URL parameters
6. Outlet — renders nested child routes

Setup:
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<UserProfile />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

Read param:
const { id } = useParams();

Navigate programmatically:
const navigate = useNavigate();
navigate('/dashboard', { replace: true });

💬 Interview line: "React Router v6 uses nested Routes with Outlet — cleaner than v5's Switch. I use useNavigate for post-login redirects."`,
  },
  {
    section: "Routing & State",
    level: "Advanced",
    q: "Redux vs Context API — when to use which?",
    a: `Context API:
✅ Low-frequency updates (theme, auth user, language)
✅ Simple apps with few global values
❌ Frequent updates → re-renders ALL consumers
❌ No devtools, no middleware, no time-travel debugging

Redux (with Redux Toolkit):
✅ Complex, frequently changing global state
✅ Multiple slices of state with separate logic
✅ Middleware (thunk, saga) for async
✅ Redux DevTools — inspect every action
❌ More boilerplate (though RTK reduces it a lot)

Rule of thumb:
• < 3 shared values, change rarely → Context
• Complex app, many features sharing state → Redux Toolkit

Zustand is a lighter middle ground:
• Less boilerplate than Redux
• More control than Context

💬 Interview line: "For DivTinder, I used Context for auth and localStorage token. If I were scaling it, I'd move to Redux Toolkit for the payment and user state slices."`,
  },

  // ─── SECTION 7: TRICKY / RAPID FIRE ───
  {
    section: "Tricky Questions",
    level: "Advanced",
    q: "What are the Rules of Hooks?",
    a: `Two strict rules (enforced by ESLint plugin):

Rule 1: Only call Hooks at the TOP LEVEL
❌ Don't call inside if, for, while, nested functions
✅ Always called in same order every render

// ❌ Wrong
if (condition) {
  const [state, setState] = useState(0);
}

Rule 2: Only call Hooks in React Functions
✅ Functional components
✅ Custom hooks
❌ Regular JS functions, class components

WHY order matters:
React tracks hooks by call ORDER in memory. If order changes between renders, React gets confused which state belongs to which hook.

💬 Interview line: "Hook order must be stable because React identifies hooks by their position in the call stack — conditionals would break that order."`,
  },
  {
    section: "Tricky Questions",
    level: "Advanced",
    q: "What is Batching in React? What changed in React 18?",
    a: `Batching = React groups multiple state updates into a single re-render.

Before React 18:
• Batching only worked inside React event handlers
• setState inside setTimeout, Promises, native events → each caused separate re-render

setCount(c => c + 1); // re-render 1
setName('Vinod');      // re-render 2 (inefficient!)

React 18 — Automatic Batching:
• Now batches ALL state updates everywhere:
  ✅ Event handlers
  ✅ setTimeout / setInterval
  ✅ Promises
  ✅ Native event listeners

setCount(c => c + 1);
setName('Vinod');
// → single re-render ✅

If you need to opt out: use ReactDOM.flushSync()

💬 Interview line: "React 18's automatic batching was a free performance win — async callbacks that used to cause multiple re-renders now batch automatically."`,
  },
  {
    section: "Tricky Questions",
    level: "Advanced",
    q: "What is the key prop? Why should you never use index as key?",
    a: `key = React's way to identify list items across renders.

React uses key to:
✅ Detect which item was added, removed, or reordered
✅ Reuse existing DOM elements instead of recreating

❌ Why index as key is dangerous:
// Items: ['A', 'B', 'C'] → keys: 0, 1, 2
// Delete 'A' → ['B', 'C']
// Now: key=0 is 'B', key=1 is 'C'
// React thinks key=0 just CHANGED (not removed)
// → wrong updates, broken animations, stale input state

✅ Use stable unique IDs:
{items.map(item => <li key={item._id}>{item.name}</li>)}

When index is safe:
• Static list that never reorders or filters
• No stateful components in the list

💬 Interview line: "Index as key caused a production bug in an earlier project — items with inputs showed wrong values after filtering. Always use database IDs."`,
  },
  {
    section: "Tricky Questions",
    level: "Advanced",
    q: "What is a Stale Closure in React hooks? Give an example.",
    a: `Stale closure = a function captures an old variable value from a previous render, not the current one.

// ❌ Bug: stale closure
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 'count' is STALE — always 0!
    }, 1000);
    return () => clearInterval(id);
  }, []); // [] means closure captured count=0 forever
}

// ✅ Fix: functional update
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1); // always fresh
  }, 1000);
  return () => clearInterval(id);
}, []);

// ✅ Or: add count to dependency array (but recreates interval)

💬 Interview line: "Stale closures are the #1 subtle React bug. Functional state updates and correct dependency arrays are the cure."`,
  },
];

const levelColors = {
  Basic: { bg: "rgba(34,197,94,0.15)", border: "#22c55e", text: "#4ade80" },
  Intermediate: { bg: "rgba(234,179,8,0.15)", border: "#eab308", text: "#facc15" },
  Advanced: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", text: "#f87171" },
};

const sectionColors = {
  "Core Fundamentals": "#60a5fa",
  "React Hooks": "#a78bfa",
  "Component Patterns": "#34d399",
  "Performance Optimization": "#f97316",
  "Advanced Concepts": "#f43f5e",
  "Routing & State": "#38bdf8",
  "Tricky Questions": "#e879f9",
};

const sections = [...new Set(questions.map(q => q.section))];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(new Set());
  const [filter, setFilter] = useState("All");
  

  const filtered = filter === "All" ? questions : questions.filter(q => q.section === filter);
  const q = filtered[current];
  const lc = q ? levelColors[q.level] : levelColors.Basic;

  const goTo = (idx) => {
    setCurrent(idx);
    setFlipped(false);
  };

  const markDone = () => {
    setAnswered(prev => new Set([...prev, questions.indexOf(q)]));
  };

  const globalIdx = q ? questions.indexOf(q) : -1;
  const isDone = answered.has(globalIdx);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px 12px",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0d0d1a",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: 3, marginBottom: 4 }}>REACT INTERVIEW PREP</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#60a5fa" }}>
            ⚛️ 8-Hour Mastery Plan
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>PROGRESS</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            <span style={{ color: "#4ade80" }}>{answered.size}</span>
            <span style={{ color: "#475569" }}> / {questions.length}</span>
          </div>
          <div style={{
            width: 80, height: 4, background: "#1e293b", borderRadius: 99, marginTop: 6,
          }}>
            <div style={{
              width: `${(answered.size / questions.length) * 100}%`,
              height: "100%", background: "#4ade80", borderRadius: 99,
              transition: "width 0.4s",
            }} />
          </div>
        </div>
      </div>

      {/* Section Filter */}
      <div style={{
        display: "flex", gap: 8, padding: "12px 24px", overflowX: "auto",
        borderBottom: "1px solid #1e293b", background: "#0d0d1a",
        WebkitOverflowScrolling: "touch",
      }}>
        {["All", ...sections].map(s => (
          <button key={s} onClick={() => { setFilter(s); setCurrent(0); setFlipped(false); }}
            style={{
              padding: "5px 12px", borderRadius: 99, fontSize: 11, whiteSpace: "nowrap",
              border: filter === s ? `1px solid ${sectionColors[s] || "#60a5fa"}` : "1px solid #1e293b",
              background: filter === s ? `${sectionColors[s] || "#60a5fa"}22` : "transparent",
              color: filter === s ? (sectionColors[s] || "#60a5fa") : "#475569",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* Counter */}
      <div style={{ padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: "#475569" }}>
          Question <span style={{ color: "#94a3b8" }}>{current + 1}</span> of <span style={{ color: "#94a3b8" }}>{filtered.length}</span>
        </div>
        <div style={{
          padding: "3px 10px", borderRadius: 99, fontSize: 10,
          border: `1px solid ${lc.border}`,
          background: lc.bg, color: lc.text, fontWeight: 700,
        }}>
          {q?.level}
        </div>
      </div>

      {/* Card */}
      {q && (
        <div style={{ flex: 1, padding: "0 24px 16px", display: "flex", flexDirection: "column" }}>
          {/* Section tag */}
          <div style={{
            fontSize: 10, color: sectionColors[q.section] || "#60a5fa",
            letterSpacing: 2, marginBottom: 12,
          }}>
            {q.section.toUpperCase()}
            {isDone && <span style={{ marginLeft: 8, color: "#4ade80" }}>✓ DONE</span>}
          </div>

          {/* Question */}
          <div style={{
            background: "#111827", border: "1px solid #1e293b",
            borderRadius: 12, padding: "18px 20px", marginBottom: 12,
          }}>
            <div style={{ fontSize: 10, color: "#475569", marginBottom: 8, letterSpacing: 2 }}>QUESTION</div>
            <div style={{ fontSize: 16, lineHeight: 1.6, color: "#f1f5f9", fontWeight: 600 }}>
              {q.q}
            </div>
          </div>

          {/* Answer toggle */}
          {!flipped ? (
            <button onClick={() => setFlipped(true)} style={{
              background: "linear-gradient(135deg, #1e3a5f, #1e1b4b)",
              border: "1px solid #3b82f6",
              borderRadius: 12, padding: "16px 20px", cursor: "pointer",
              color: "#93c5fd", fontSize: 14, fontFamily: "inherit",
              textAlign: "center", transition: "all 0.2s",
            }}>
              👁️ Reveal Answer
            </button>
          ) : (
            <div style={{
              background: "#0f1f0f", border: "1px solid #166534",
              borderRadius: 12, padding: "18px 20px", flex: 1,
            }}>
              <div style={{ fontSize: 10, color: "#4ade80", marginBottom: 10, letterSpacing: 2 }}>ANSWER</div>
              <pre style={{
                fontSize: 12.5, lineHeight: 1.75, color: "#d1fae5",
                whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit",
              }}>
                {q.a}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 13,
                border: "1px solid #1e293b", background: "#111827",
                color: current === 0 ? "#334155" : "#94a3b8",
                cursor: current === 0 ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>
              ← Prev
            </button>
            {flipped && !isDone && (
              <button onClick={markDone} style={{
                flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 13,
                border: "1px solid #166534", background: "#14532d22",
                color: "#4ade80", cursor: "pointer", fontFamily: "inherit",
              }}>
                ✓ Got it
              </button>
            )}
            <button onClick={() => { goTo(Math.min(filtered.length - 1, current + 1)); }}
              disabled={current === filtered.length - 1}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 10, fontSize: 13,
                border: "1px solid #1e293b", background: "#111827",
                color: current === filtered.length - 1 ? "#334155" : "#94a3b8",
                cursor: current === filtered.length - 1 ? "not-allowed" : "pointer", fontFamily: "inherit",
              }}>
              Next →
            </button>
          </div>

          {/* Question dots nav */}
          <div style={{
            display: "flex", gap: 5, flexWrap: "wrap", marginTop: 14, justifyContent: "center",
          }}>
            {filtered.map((fq, i) => {
              const gi = questions.indexOf(fq);
              const done = answered.has(gi);
              return (
                <button key={i} onClick={() => goTo(i)} style={{
                  width: 22, height: 22, borderRadius: 6, border: "none",
                  fontSize: 9, cursor: "pointer", fontFamily: "inherit",
                  background: i === current ? "#3b82f6" : done ? "#166534" : "#1e293b",
                  color: i === current ? "#fff" : done ? "#4ade80" : "#475569",
                  fontWeight: i === current ? 700 : 400,
                }}>
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Time guide footer */}
      <div style={{
        padding: "10px 24px 20px",
        borderTop: "1px solid #1e293b",
        background: "#0d0d1a",
        fontSize: 10, color: "#334155", lineHeight: 2,
      }}>
        ⏱ 8H PLAN: Fundamentals 1h → Hooks 2h → Patterns 1.5h → Performance 1.5h → Advanced 1.5h → Mock QnA 0.5h
      </div>
    </div>
  );
}