# Async Creation Utilities

Utilities for creating async operations with waiting and initialization patterns.

## Installation

```typescript
import { when, init } from '@sky-modules/core/async-creation'
```

## API

### when(object, callback?, ...args)

Wait for async operations to complete and optionally call a callback with results.

```typescript
when<T extends Awaitable<unknown> | readonly Awaitable<unknown>[], A extends unknown[]>(
  object: T,
  callback?: Callback<[WhenResult<T>, ...A], void | Promise<void>>,
  ...args: A
): PromiseLike<WhenResult<T>>
```

**Parameters:**
- `object` - Promise, object with `whenReady` property, or array of awaitables
- `callback` - Optional callback to invoke with results
- `args` - Additional arguments to pass to callback

**Returns:** Promise that resolves to the awaited result(s)

**Note:** Uses `task()` internally, so it's safe to not await - errors will be handled by `handleAsyncError`

### init(instance, ...args)

Initialize an instance by calling its `init()` method with arguments.

```typescript
init<T extends { init(...args: A): Promise<void> }, A extends unknown[]>(
  instance: T,
  ...args: A
): Promise<T>
```

**Parameters:**
- `instance` - Object with `init()` method
- `args` - Arguments to pass to `init()`

**Returns:** Promise that resolves to the same instance after initialization

## Usage

### Waiting for Single Promise

```typescript
const data = await when(fetchData())
console.log(data)
```

### Waiting for Multiple Promises

```typescript
const results = await when([
  loadConfig(),
  loadDatabase(),
  loadCache()
])

console.log(results) // [configData, dbData, cacheData]
```

### With Callback

```typescript
await when(fetchUserData(), (userData) => {
  console.log('User loaded:', userData.name)
})
```

### Initializing Objects

```typescript
class Service {
  async init(url: string) {
    this.connection = await connect(url)
  }
}

const service = await init(new Service(), 'http://localhost:3000')
```

### Fire-and-Forget (Safe without await)

```typescript
// Safe to not await - errors are tracked and handled
when(loadUserPreferences(), (prefs) => {
  applyPreferences(prefs)
})

// Continue immediately without blocking
console.log('Loading preferences in background...')
```
