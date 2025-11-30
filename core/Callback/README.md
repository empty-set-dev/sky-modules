# Callback

Type-safe callback utilities with support for functions and object method tuples.

## Installation

```typescript
import Callback, { invokeCallback } from '@sky-modules/core/Callback'
```

## API

### Callback<A, R>

Type for callbacks that can be either a function or `[object, method]` tuple.

```typescript
type Callback<A extends unknown[], R> =
  | ((...args: A) => R)
  | [unknown, (this: unknown, ...args: A) => R]
```

### invokeCallback(callback, ...args)

Invoke a callback with proper `this` binding.

```typescript
invokeCallback<A extends unknown[], R>(
  callback: Callback<A, R>,
  ...args: A
): R
```

## Usage

### Function Callback

```typescript
const callback = (x: number) => x * 2
invokeCallback(callback, 5) // 10
```

### Object Method Callback

```typescript
class Logger {
  prefix = '[LOG]'
  log(message: string) {
    console.log(this.prefix, message)
  }
}

const logger = new Logger()
invokeCallback([logger, logger.log], 'Hello') // [LOG] Hello
```

### With Async Module

```typescript
import { fire, task } from '@sky-modules/core/async'

class API {
  async fetchData() {
    return await fetch('/api/data')
  }
}

const api = new API()
fire([api, api.fetchData])
await task([api, api.fetchData])
```

## Why Use This?

The tuple pattern `[object, method]` preserves `this` context without creating closures or using `.bind()`.

```typescript
// Without Callback - loses this
class Counter {
  count = 0
  increment() { this.count++ }
}

const counter = new Counter()
setTimeout(counter.increment, 100) // Error: this is undefined

// With Callback - preserves this
invokeCallback([counter, counter.increment]) // Works correctly
```
