# Idle

Async delay utility with AbortSignal support for cancellable timeouts.

## Overview

The idle module provides a simple async delay function that integrates with the AbortController API for cancellable timeouts.

**Key Features:**
- Promise-based delays
- AbortSignal support
- Type-safe with Time type
- Zero dependencies

## Installation

```typescript
import idle from '@sky-modules/core/idle'
```

## API Reference

### idle(timeout, parameters?)

Wait for a specified duration.

```typescript
idle(timeout: Time, parameters?: IdleParameters): Promise<void>
```

**Parameters:**
- `timeout` - Duration to wait (in Time type, typically seconds)
- `parameters` - Optional configuration
  - `signal` - AbortSignal to cancel timeout

**Returns:** Promise that resolves after timeout

**Example:**
```typescript
// Wait 2 seconds
await idle(2)

// Wait 5 seconds
await idle(5)

// With abort signal
const controller = new AbortController()
await idle(3, { signal: controller.signal })

// Cancel timeout
controller.abort()
```

## Usage Patterns

### Basic Delay

```typescript
console.log('Starting...')
await idle(2) // Wait 2 seconds
console.log('Done!')
```

### Cancellable Delay

```typescript
const controller = new AbortController()

// Start delay
const delayPromise = idle(10, { signal: controller.signal })

// Cancel after 2 seconds
setTimeout(() => controller.abort(), 2000)

try {
  await delayPromise
} catch {
  console.log('Delay cancelled')
}
```

### Rate Limiting

```typescript
async function processItems(items: string[]) {
  for (const item of items) {
    await processItem(item)
    await idle(0.5) // Wait 500ms between items
  }
}
```

### Retry with Delay

```typescript
async function retryWithBackoff(fn: () => Promise<void>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fn()
      return // Success
    } catch (error) {
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) // Exponential backoff
        await idle(delay)
      } else {
        throw error // Final attempt failed
      }
    }
  }
}
```

### Timeout Pattern

```typescript
async function fetchWithTimeout(url: string, timeoutSeconds: number) {
  const controller = new AbortController()

  const timeoutPromise = idle(timeoutSeconds, { signal: controller.signal })
    .then(() => { throw new Error('Timeout') })

  const fetchPromise = fetch(url, { signal: controller.signal })

  try {
    return await Promise.race([fetchPromise, timeoutPromise])
  } finally {
    controller.abort() // Cleanup
  }
}
```

### Debouncing

```typescript
let debounceTimeout: AbortController | null = null

async function debounce(fn: () => void, delay: number) {
  // Cancel previous timeout
  if (debounceTimeout) {
    debounceTimeout.abort()
  }

  debounceTimeout = new AbortController()

  try {
    await idle(delay, { signal: debounceTimeout.signal })
    fn()
  } catch {
    // Aborted, do nothing
  }
}
```

### Animation Delays

```typescript
async function animateSequence() {
  element.classList.add('fade-in')
  await idle(0.3)

  element.classList.add('slide-up')
  await idle(0.5)

  element.classList.add('bounce')
}
```

## Time Type

The `timeout` parameter uses the `Time` type which has a `valueOf()` method returning seconds:

```typescript
// Time type implementation
interface Time {
  valueOf(): number // Returns seconds
}

// Usage
await idle(2)      // 2 seconds
await idle(0.5)    // 500 milliseconds
await idle(10)     // 10 seconds
```

## AbortSignal Integration

### Creating AbortController

```typescript
const controller = new AbortController()

idle(5, { signal: controller.signal })

// Cancel anytime
controller.abort()
```

### Multiple Operations

```typescript
const controller = new AbortController()

Promise.all([
  idle(5, { signal: controller.signal }),
  idle(3, { signal: controller.signal }),
  fetch('/api/data', { signal: controller.signal })
])

// Cancel all at once
controller.abort()
```

## Best Practices

### 1. Use for Delays, Not Scheduling

```typescript
// ✅ Good - delay between operations
await processItem()
await idle(1)
await processNextItem()

// ❌ Avoid - use setInterval instead
while (true) {
  await doSomething()
  await idle(60) // Use setInterval for periodic tasks
}
```

### 2. Always Cleanup with AbortSignal

```typescript
// ✅ Good - cleanup on abort
const controller = new AbortController()
try {
  await idle(10, { signal: controller.signal })
} finally {
  controller.abort() // Ensure cleanup
}

// ❌ Avoid - no cleanup mechanism
await idle(10) // Can't be cancelled
```

### 3. Don't Block Critical Paths

```typescript
// ✅ Good - delay non-critical operations
const data = await fetchData()
processData(data)
idle(1).then(() => sendAnalytics()) // Don't await

// ❌ Avoid - blocking critical flow
await fetchData()
await idle(5) // Unnecessary delay before processing
processData()
```

### 4. Use Exponential Backoff for Retries

```typescript
// ✅ Good - exponential backoff
for (let i = 0; i < retries; i++) {
  try {
    await operation()
    break
  } catch {
    await idle(Math.pow(2, i)) // 1s, 2s, 4s, 8s...
  }
}

// ❌ Avoid - linear backoff
for (let i = 0; i < retries; i++) {
  try {
    await operation()
    break
  } catch {
    await idle(1) // Always same delay
  }
}
```

## Performance

- **Minimal overhead** - Simple setTimeout wrapper
- **No polling** - Event-driven abort mechanism
- **Memory efficient** - Automatic cleanup

## Comparison with Alternatives

### vs setTimeout

```typescript
// setTimeout - callback-based
setTimeout(() => {
  console.log('Done')
}, 2000)

// idle - promise-based
await idle(2)
console.log('Done')
```

### vs sleep/delay

```typescript
// Other libraries
await sleep(2000)    // Milliseconds
await delay(2000)    // Milliseconds

// idle
await idle(2)        // Seconds (Time type)
```

## Related Modules

- [core/async](../async/) - Async utilities
- [core/deferred](../deferred/) - Deferred promises
- [core/PromisePool](../PromisePool/) - Concurrent execution

## Examples

See [idle.spec.ts](./idle.spec.ts) for comprehensive usage examples and test cases.
