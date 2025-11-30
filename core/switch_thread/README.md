# Switch Thread

Yield control to the event loop to allow other tasks to execute.

## Installation

```typescript
import switchThread from '@sky-modules/core/switch_thread'
```

## API

### switchThread()

Yield control to the event loop.

```typescript
switchThread(): Promise<void>
```

**Returns:** Promise that resolves in the next event loop iteration

**Behavior:**
- Returns a resolved Promise to defer execution
- Allows browser to process pending events and tasks
- Useful for preventing UI blocking on long operations

## Usage

### Break Up Long Tasks

```typescript
import switchThread from '@sky-modules/core/switch_thread'

async function processLargeDataset(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i])

    // Every 100 items, yield to event loop
    if (i % 100 === 0) {
      await switchThread()
    }
  }
}
```

### Prevent UI Freezing

```typescript
async function computeExpensiveValue() {
  // Do some work
  const result1 = expensiveComputation1()

  // Yield to allow UI to update
  await switchThread()

  // Continue work
  const result2 = expensiveComputation2()

  return combine(result1, result2)
}
```

### Async Iterator with Yielding

```typescript
async function* processItems(items) {
  for (const item of items) {
    yield processItem(item)
    await switchThread()
  }
}
```

### Batch Processing

```typescript
async function batchProcess(items, batchSize = 10) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    processBatch(batch)

    if (i + batchSize < items.length) {
      await switchThread()
    }
  }
}
```

## Performance Considerations

- Use for CPU-intensive operations on large datasets
- Helps maintain responsive UI in React/Vue/etc
- Minimal overhead - just resolves a Promise
- Can significantly improve perceived performance

## Related

- Useful with `fire()` and `task()` from async utilities
- Works with any async/await pattern
- Compatible with Promise-based code

## Notes

- Current implementation uses `Promise.resolve()`
- Returns immediately but schedules execution in next tick
- Does not block - other microtasks may still execute first
- Essential for maintaining 60fps UI responsiveness
