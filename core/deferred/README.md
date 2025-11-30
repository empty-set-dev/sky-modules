# Deferred

Create a promise with externally accessible resolve and reject functions.

## Installation

```typescript
import deferred from '@sky-modules/core/deferred'
```

## API

### deferred<T>()

Create a deferred promise.

```typescript
deferred<T = void>(): [
  Promise<T>,
  (value: T | PromiseLike<T>) => void,
  (reason?: unknown) => void
]
```

Returns `[promise, resolve, reject]`

## Usage

### Basic Usage

```typescript
const [promise, resolve, reject] = deferred<string>()

// Resolve from external code
setTimeout(() => resolve('Hello'), 1000)

const value = await promise // 'Hello'
```

### Event-driven Resolution

```typescript
function waitForEvent(target: EventTarget, eventName: string) {
  const [promise, resolve] = deferred<Event>()
  target.addEventListener(eventName, resolve, { once: true })
  return promise
}

const clickEvent = await waitForEvent(button, 'click')
```

### Manual Control

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
    if (item) item[1](value)
  }
}
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
    this.initResolve()
  }

  async query(sql: string) {
    await this.initPromise // Wait for init
    return executeQuery(sql)
  }
}
```
