# Idle

Async delay utility with AbortSignal support.

## Installation

```typescript
import idle from '@sky-modules/core/idle'
```

## API

### idle(timeout, parameters?)

Wait for a specified duration.

```typescript
idle(timeout: Time, parameters?: { signal?: AbortSignal }): Promise<void>
```

## Usage

### Basic Delay

```typescript
console.log('Starting...')
await idle(2) // Wait 2 seconds
console.log('Done!')
```

### Cancellable Delay

```typescript
const controller = new AbortController()

const delayPromise = idle(10, { signal: controller.signal })

// Cancel after 2 seconds
setTimeout(() => controller.abort(), 2000)

await delayPromise
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

### Retry with Backoff

```typescript
async function retryWithBackoff(fn: () => Promise<void>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fn()
      return
    } catch (error) {
      if (i < maxRetries - 1) {
        await idle(Math.pow(2, i)) // 1s, 2s, 4s...
      } else {
        throw error
      }
    }
  }
}
```
