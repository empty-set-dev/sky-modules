# Deferred

Create a promise with externally accessible resolve and reject functions.

## Overview

The deferred module provides a utility to create promises where the resolve and reject functions are accessible outside the promise constructor. This pattern is useful for scenarios where promise resolution needs to be controlled from external code.

**Key Features:**
- Externally controllable promises
- Type-safe with generics
- Simple tuple return
- Zero dependencies

## Installation

```typescript
import deferred from '@sky-modules/core/deferred'
```

## API Reference

### deferred<T>()

Create a deferred promise.

```typescript
deferred<T = void>(): [
  Promise<T>,
  (value: T | PromiseLike<T>) => void,
  (reason?: unknown) => void
]
```

**Returns:** Tuple with `[promise, resolve, reject]`

**Example:**
```typescript
// Create deferred promise
const [promise, resolve, reject] = deferred<number>()

// Resolve from external code
setTimeout(() => resolve(42), 1000)

// Await the promise
const result = await promise // 42
```

## Usage Patterns

### Basic Usage

```typescript
const [promise, resolve, reject] = deferred<string>()

// Resolve later
resolve('Hello')

// Get result
const value = await promise // 'Hello'
```

### Event-driven Resolution

```typescript
function waitForEvent(target: EventTarget, eventName: string) {
  const [promise, resolve] = deferred<Event>()

  target.addEventListener(eventName, resolve, { once: true })

  return promise
}

// Usage
const clickEvent = await waitForEvent(button, 'click')
console.log('Button clicked!', clickEvent)
```

### Manual Promise Control

```typescript
class AsyncQueue<T> {
  private queue: Array<[Promise<T>, (value: T) => void]> = []

  enqueue(): Promise<T> {
    const [promise, resolve] = deferred<T>()
    this.queue.push([promise, resolve])
    return promise
  }

  dequeue(value: T) {
    const item = this.queue.shift()
    if (item) {
      item[1](value) // Resolve promise
    }
  }
}

// Usage
const queue = new AsyncQueue<number>()

const p1 = queue.enqueue()
const p2 = queue.enqueue()

queue.dequeue(42)  // Resolves p1
queue.dequeue(100) // Resolves p2

await p1 // 42
await p2 // 100
```

### Cancellable Operations

```typescript
class CancellableTask<T> {
  private [promise, resolve, reject] = deferred<T>()

  cancel(reason?: string) {
    this.reject(new Error(reason || 'Cancelled'))
  }

  complete(value: T) {
    this.resolve(value)
  }

  get result() {
    return this.promise
  }
}

// Usage
const task = new CancellableTask<string>()

setTimeout(() => task.complete('Done'), 1000)

// Or cancel it
task.cancel('User cancelled')

try {
  await task.result
} catch (error) {
  console.error(error) // Error: User cancelled
}
```

### Resource Loading

```typescript
class ResourceLoader {
  private resources = new Map<string, [Promise<Resource>, (r: Resource) => void]>()

  load(url: string): Promise<Resource> {
    if (!this.resources.has(url)) {
      const [promise, resolve] = deferred<Resource>()
      this.resources.set(url, [promise, resolve])

      // Start loading
      fetch(url)
        .then(res => res.json())
        .then(resolve)
    }

    return this.resources.get(url)![0]
  }
}

// Usage
const loader = new ResourceLoader()

// Multiple calls return same promise
const p1 = loader.load('/api/data')
const p2 = loader.load('/api/data') // Same promise

await p1 === await p2 // true
```

### Synchronization Primitive

```typescript
class Semaphore {
  private waiters: Array<() => void> = []
  private count: number

  constructor(initial: number) {
    this.count = initial
  }

  async acquire(): Promise<void> {
    if (this.count > 0) {
      this.count--
      return
    }

    const [promise, resolve] = deferred<void>()
    this.waiters.push(resolve)
    await promise
  }

  release() {
    if (this.waiters.length > 0) {
      const resolve = this.waiters.shift()!
      resolve()
    } else {
      this.count++
    }
  }
}

// Usage
const sem = new Semaphore(2)

await sem.acquire() // OK
await sem.acquire() // OK
sem.acquire() // Waits

sem.release() // Releases one waiter
```

### Request/Response Pattern

```typescript
class MessageBus {
  private pending = new Map<string, (response: unknown) => void>()

  async request<T>(message: string, data: unknown): Promise<T> {
    const id = crypto.randomUUID()
    const [promise, resolve] = deferred<T>()

    this.pending.set(id, resolve)
    this.send({ id, message, data })

    return promise
  }

  handleResponse(id: string, data: unknown) {
    const resolve = this.pending.get(id)
    if (resolve) {
      this.pending.delete(id)
      resolve(data)
    }
  }
}

// Usage
const bus = new MessageBus()

const response = await bus.request<UserData>('getUser', { id: 123 })
console.log(response)
```

### Async Initialization

```typescript
class Database {
  private initPromise: Promise<void>
  private initResolve!: () => void

  constructor() {
    [this.initPromise, this.initResolve] = deferred<void>()
    this.connect()
  }

  private async connect() {
    await connectToDatabase()
    this.initResolve() // Signal initialization complete
  }

  async query(sql: string) {
    await this.initPromise // Wait for init
    return executeQuery(sql)
  }
}

// Usage
const db = new Database()
await db.query('SELECT * FROM users') // Waits for init automatically
```

## Best Practices

### 1. Always Handle Rejections

```typescript
// ✅ Good - handle rejection
const [promise, resolve, reject] = deferred<number>()

try {
  const result = await promise
} catch (error) {
  console.error('Promise rejected:', error)
}

// ❌ Avoid - unhandled rejection
const [promise] = deferred()
// Promise may reject without handler
```

### 2. Don't Leak Resolve/Reject

```typescript
// ✅ Good - encapsulate control
class AsyncValue<T> {
  private [promise, resolve] = deferred<T>()

  set(value: T) {
    this.resolve(value)
  }

  get(): Promise<T> {
    return this.promise
  }
}

// ❌ Avoid - exposing resolve/reject
function createPromise() {
  const [p, resolve] = deferred()
  return { promise: p, resolve } // Leaks control
}
```

### 3. Use for Control Flow, Not Data Storage

```typescript
// ✅ Good - control flow
const [ready, setReady] = deferred<void>()
await initialize()
setReady()
await ready

// ❌ Avoid - use variables instead
const [value, setValue] = deferred<number>()
setValue(42)
const result = await value // Just use: let result = 42
```

### 4. Consider Cleanup

```typescript
// ✅ Good - cleanup on timeout
const [promise, resolve] = deferred<string>()

const timeout = setTimeout(() => {
  resolve('timeout')
}, 5000)

promise.then(() => clearTimeout(timeout))

// ❌ Avoid - no cleanup
const [promise] = deferred()
setTimeout(() => {}, 5000) // Leaked timeout
```

## Pattern Comparison

### vs Promise Constructor

```typescript
// Promise constructor
const promise = new Promise((resolve, reject) => {
  // resolve/reject only accessible here
  setTimeout(() => resolve('done'), 1000)
})

// Deferred
const [promise, resolve, reject] = deferred<string>()
// resolve/reject accessible anywhere
setTimeout(() => resolve('done'), 1000)
```

### vs Async/Await

```typescript
// Async/await - for sequential operations
async function loadData() {
  const data = await fetch('/api/data')
  return data.json()
}

// Deferred - for external control
const [dataReady, signalReady] = deferred<Data>()
onDataReceived(data => signalReady(data))
await dataReady
```

## Performance

- **Zero overhead** - Simple promise wrapper
- **Memory efficient** - No additional allocations
- **Type-safe** - Full generic support

## Related Modules

- [core/async](../async/) - Async utilities
- [core/idle](../idle/) - Delay utilities
- [core/PromisePool](../PromisePool/) - Concurrent execution
- [core/EventEmitter](../EventEmitter/) - Event-driven patterns

## Examples

See [deferred.spec.ts](./deferred.spec.ts) for comprehensive usage examples and test cases.
