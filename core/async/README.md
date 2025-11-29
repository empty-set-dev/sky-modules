# Async Utilities

Utilities for handling asynchronous operations with error handling and task tracking.

## Overview

The async module provides utilities for firing async callbacks with automatic error handling and tracking async tasks during application runtime.

**Key Features:**
- Fire-and-forget async operations
- Tracked async tasks
- Automatic error handling
- Runtime integration
- Zero dependencies

## Installation

```typescript
import { fire, task, handleAsyncError } from '@sky-modules/core/async'
```

## API Reference

### fire(callback, ...args)

Execute an async callback with automatic error handling (fire-and-forget pattern).

```typescript
fire<A extends unknown[], R>(
  callback: Callback<A, Promise<R>>,
  ...args: A
): PromiseLike<void | R>
```

**Parameters:**
- `callback` - Async function or `[object, method]` tuple
- `args` - Arguments to pass to callback

**Returns:** Promise that resolves when callback completes or catches errors

**Example:**
```typescript
// Fire and forget
fire(async () => {
  await saveData()
  await sendNotification()
})

// With arguments
fire(async (userId: number) => {
  const user = await fetchUser(userId)
  await processUser(user)
}, 123)

// With object method
fire([userService, userService.update], user)
```

**Behavior:**
- Catches all errors automatically
- Errors are handled by `handleAsyncError`
- Does not block execution
- Returns promise for optional awaiting

### task(callback, ...args)

Execute an async callback and track it as a pending task.

```typescript
task<A extends unknown[], R>(
  callback: Callback<A, Promise<R>>,
  ...args: A
): Promise<R>
```

**Parameters:**
- `callback` - Async function or `[object, method]` tuple
- `args` - Arguments to pass to callback

**Returns:** Promise with callback result

**Example:**
```typescript
// Track as task
await task(async () => {
  await initializeDatabase()
  await loadInitialData()
})

// With arguments
const result = await task(async (id: number) => {
  return await fetchData(id)
}, 42)

// Runtime waits for all tasks
// Tracked automatically until completion
```

**Behavior:**
- Adds promise to `RuntimeInternal.pendingTasks`
- Removes from tracking when complete
- Only tracks if not already in runtime
- Useful for initialization tasks

### handleAsyncError(error)

Handle errors from async operations.

```typescript
handleAsyncError(error: unknown): void
```

**Parameters:**
- `error` - Error from async operation

**Behavior:**
- **Client-side**: Throws error in next tick (via `setTimeout`)
- **Server-side**: Throws error immediately

**Example:**
```typescript
try {
  await riskyOperation()
} catch (error) {
  handleAsyncError(error)
}
```

## Usage Patterns

### Fire and Forget

```typescript
// Don't wait for completion
fire(async () => {
  await analytics.track('page_view')
  await logger.log('User visited page')
})

// Continue immediately
console.log('Page rendered')
```

### Background Tasks

```typescript
// Start background work
fire(async () => {
  await syncDatabase()
  await cleanupCache()
  await optimizeImages()
})
```

### Initialization Tasks

```typescript
// Track initialization
await task(async () => {
  await loadConfiguration()
  await connectDatabase()
  await startServices()
})

// All tasks complete before runtime starts
```

### Error Handling

```typescript
// Errors caught automatically
fire(async () => {
  const data = await fetchData()
  if (!data) {
    throw new Error('No data')
  }
  await processData(data)
})
// Error handled by handleAsyncError
```

### Object Methods

```typescript
class UserService {
  async updateUser(id: number) {
    // Implementation
  }
}

const service = new UserService()

// Fire object method
fire([service, service.updateUser], 123)

// Task with object method
await task([service, service.updateUser], 456)
```

## fire() vs task()

### Use fire() when:
- Fire-and-forget operations
- Background tasks
- Analytics/logging
- Non-critical operations
- Don't need result

### Use task() when:
- Need to track completion
- Initialization code
- Critical operations
- Need result value
- Want runtime to wait

## Integration with Runtime

```typescript
// During app initialization
await task(async () => {
  await initializeApp()
})

// Runtime waits for all pending tasks
// Then starts application
```

## Best Practices

### 1. Use fire() for Non-critical Operations

```typescript
// ✅ Good - analytics doesn't block
fire(async () => {
  await analytics.track('event')
})

// ❌ Avoid - blocking main flow
await analytics.track('event')
```

### 2. Use task() for Initialization

```typescript
// ✅ Good - tracked initialization
await task(async () => {
  await loadConfig()
  await connectDB()
})

// ❌ Avoid - untracked initialization
fire(async () => {
  await loadConfig() // May not complete before app starts
})
```

### 3. Handle Errors Explicitly When Needed

```typescript
// ✅ Good - explicit error handling
fire(async () => {
  try {
    await criticalOperation()
  } catch (error) {
    console.error('Operation failed:', error)
    await fallbackOperation()
  }
})

// ⚠️ Automatic - uses handleAsyncError
fire(async () => {
  await operation() // Errors handled automatically
})
```

### 4. Don't Overuse fire()

```typescript
// ✅ Good - appropriate use
const result = await fetchData()
fire(async () => {
  await sendAnalytics(result)
})

// ❌ Avoid - should use await
fire(async () => {
  const data = await fetchData()
  return processData(data) // Result lost!
})
```

## Error Handling Behavior

### Client-Side (Browser)

```typescript
// Throws in next tick to prevent UI freeze
setTimeout(() => {
  throw error
})
```

### Server-Side (Node.js)

```typescript
// Throws immediately
throw error
```

## Performance

- **Minimal overhead** - Direct promise handling
- **No polling** - Event-driven tracking
- **Memory efficient** - Automatic cleanup

## Related Modules

- [core/Callback](../Callback/) - Callback invocation utilities
- [core/runtime](../runtime/) - Runtime management
- [core/PromisePool](../PromisePool/) - Concurrent promise execution
- [core/deferred](../deferred/) - Deferred promises

## Examples

See [async.spec.ts](./async.spec.ts) for comprehensive usage examples and test cases.
