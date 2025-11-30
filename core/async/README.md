# Async Utilities

Utilities for handling asynchronous operations with error handling and task tracking.

## Installation

```typescript
import { fire, task, handleAsyncError } from '@sky-modules/core/async'
```

## API

### fire(callback, ...args)

Execute an async callback with automatic error handling (fire-and-forget).

```typescript
fire<A extends unknown[], R>(
  callback: Callback<A, Promise<R>>,
  ...args: A
): PromiseLike<void | R>
```

### task(callback, ...args)

Execute an async callback and track it as a pending task.

```typescript
task<A extends unknown[], R>(
  callback: Callback<A, Promise<R>>,
  ...args: A
): Promise<R>
```

### handleAsyncError(error)

Handle errors from async operations.

```typescript
handleAsyncError(error: unknown): void
```

## Usage

### Fire and Forget

```typescript
// Don't wait for completion
fire(async () => {
  await analytics.track('page_view')
  await logger.log('User visited')
})

console.log('Page rendered') // Continues immediately
```

### Tracked Tasks

```typescript
// Track initialization
await task(async () => {
  await loadConfiguration()
  await connectDatabase()
})

// All tasks complete before runtime starts
```

### With Object Methods

```typescript
class API {
  async fetchData() {
    return await fetch('/api/data')
  }
}

const api = new API()

fire([api, api.fetchData])
await task([api, api.fetchData])
```

## fire() vs task()

Use `fire()` for:
- Background tasks
- Analytics/logging
- Non-critical operations

Use `task()` for:
- Initialization code
- Critical operations
- When runtime should wait
