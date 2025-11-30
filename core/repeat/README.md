# repeat

Execute a callback multiple times with iteration support.

## Installation

```typescript
import repeat from '@sky-modules/core/repeat'
```

## API

### repeat(count, callback, ...args)

Repeat a callback function a specified number of times with support for async callbacks.

```typescript
repeat<A extends unknown[]>(
  count: number,
  callback: (iteration: number, ...args: A) => void | Promise<void>,
  ...args: A
): Promise<void>
```

**Parameters:**
- `count` - Number of times to repeat
- `callback` - Function to execute (receives iteration index and optional args)
- `args` - Additional arguments to pass to callback

**Returns:** Promise that resolves when all iterations complete

## Usage

### Simple Loop

```typescript
await repeat(5, (i) => {
  console.log(`Iteration ${i}`)
})
// Output: Iteration 0, 1, 2, 3, 4
```

### Async Operations

```typescript
await repeat(3, async (i) => {
  const data = await fetchData(i)
  await saveToDatabase(data)
})
```

### With Additional Arguments

```typescript
await repeat(4, (i, prefix, suffix) => {
  console.log(`${prefix}${i}${suffix}`)
}, 'Item: ', '!')
// Output: Item: 0!, Item: 1!, Item: 2!, Item: 3!
```
