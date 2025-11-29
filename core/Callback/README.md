# Callback

Type-safe callback utilities with support for both functions and object method tuples.

## Overview

The Callback module provides a unified type and invocation utility for callbacks that can be either standalone functions or object method tuples. This pattern preserves `this` context when invoking methods.

**Key Features:**
- Unified callback type (function or `[object, method]`)
- Automatic `this` binding
- Type-safe with generics
- Zero runtime overhead
- Zero dependencies

## Installation

```typescript
import Callback, { invokeCallback } from '@sky-modules/core/Callback'
```

## API Reference

### Callback<A, R>

Type representing a callback that can be either a function or an object method tuple.

```typescript
type Callback<A extends unknown[], R> =
  | ((...args: A) => R)
  | [unknown, (this: unknown, ...args: A) => R]
```

**Type Parameters:**
- `A` - Tuple of argument types
- `R` - Return type

**Example:**
```typescript
// Function callback
const fnCallback: Callback<[number], string> = (n) => n.toString()

// Object method callback
class Counter {
  count = 0
  increment(amount: number) {
    this.count += amount
    return this.count
  }
}

const counter = new Counter()
const methodCallback: Callback<[number], number> = [counter, counter.increment]
```

### invokeCallback(callback, ...args)

Invoke a callback with proper `this` binding.

```typescript
invokeCallback<A extends unknown[], R>(
  callback: Callback<A, R>,
  ...args: A
): R
```

**Parameters:**
- `callback` - Callback to invoke (function or `[object, method]`)
- `args` - Arguments to pass to callback

**Returns:** Result of callback invocation

**Example:**
```typescript
// Invoke function
const result1 = invokeCallback((x: number) => x * 2, 5) // 10

// Invoke object method (preserves this)
class Logger {
  prefix = '[LOG]'
  log(message: string) {
    console.log(this.prefix, message)
  }
}

const logger = new Logger()
invokeCallback([logger, logger.log], 'Hello') // [LOG] Hello
```

## Usage Patterns

### Function Callbacks

```typescript
function processData<T>(
  data: T[],
  callback: Callback<[T], void>
) {
  data.forEach(item => invokeCallback(callback, item))
}

// Usage with function
processData([1, 2, 3], (n) => console.log(n))
```

### Object Method Callbacks

```typescript
class DataProcessor {
  count = 0

  process(item: string) {
    this.count++
    console.log(`Processing ${item} (${this.count})`)
  }
}

const processor = new DataProcessor()

// Pass method with this binding
processData(
  ['a', 'b', 'c'],
  [processor, processor.process]
)
// Processing a (1)
// Processing b (2)
// Processing c (3)
```

### Event Handlers

```typescript
class EventManager {
  handlers: Map<string, Callback<[any], void>[]> = new Map()

  on(event: string, callback: Callback<[any], void>) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(callback)
  }

  emit(event: string, data: any) {
    const callbacks = this.handlers.get(event) || []
    callbacks.forEach(cb => invokeCallback(cb, data))
  }
}

// Usage
const events = new EventManager()

// Function handler
events.on('click', (e) => console.log('Clicked', e))

// Method handler
class ClickHandler {
  handleClick(e: MouseEvent) {
    console.log('Method handler:', e)
  }
}

const handler = new ClickHandler()
events.on('click', [handler, handler.handleClick])

events.emit('click', { x: 100, y: 200 })
```

### Async Callbacks

```typescript
async function executeAsync<T>(
  callback: Callback<[], Promise<T>>
): Promise<T> {
  return await invokeCallback(callback)
}

// Function
await executeAsync(async () => {
  return await fetchData()
})

// Object method
class API {
  async fetchUser(id: number) {
    return await fetch(`/api/users/${id}`)
  }
}

const api = new API()
await executeAsync([api, () => api.fetchUser(123)])
```

### Middleware Pattern

```typescript
type Middleware<T> = Callback<[T, () => void], void>

function runMiddleware<T>(
  middlewares: Middleware<T>[],
  context: T
) {
  let index = 0

  function next() {
    if (index < middlewares.length) {
      const middleware = middlewares[index++]
      invokeCallback(middleware, context, next)
    }
  }

  next()
}

// Usage
class Logger {
  log(ctx: any, next: () => void) {
    console.log('Before:', ctx)
    next()
    console.log('After:', ctx)
  }
}

const logger = new Logger()

runMiddleware(
  [
    (ctx, next) => { ctx.step1 = true; next() },
    [logger, logger.log],
    (ctx, next) => { ctx.step2 = true; next() }
  ],
  {}
)
```

### Type-Safe Builders

```typescript
class QueryBuilder {
  private query = ''

  where(condition: string) {
    this.query += ` WHERE ${condition}`
    return this
  }

  build() {
    return this.query
  }
}

function buildQuery(
  callback: Callback<[QueryBuilder], void>
): string {
  const builder = new QueryBuilder()
  invokeCallback(callback, builder)
  return builder.build()
}

// Usage with method
class QueryHelper {
  addUserFilter(builder: QueryBuilder) {
    builder.where('user_id = 123')
  }
}

const helper = new QueryHelper()
const sql = buildQuery([helper, helper.addUserFilter])
```

## Best Practices

### 1. Preserve This Context

```typescript
// ✅ Good - preserves this
class Service {
  name = 'MyService'

  process(data: string) {
    console.log(this.name, data) // this.name accessible
  }
}

const service = new Service()
invokeCallback([service, service.process], 'test')

// ❌ Avoid - loses this
const method = service.process
invokeCallback(method, 'test') // this.name is undefined
```

### 2. Use Type Parameters

```typescript
// ✅ Good - type-safe
function execute<T, R>(
  callback: Callback<[T], R>,
  arg: T
): R {
  return invokeCallback(callback, arg)
}

// ❌ Avoid - loses type safety
function execute(callback: any, arg: any): any {
  return invokeCallback(callback, arg)
}
```

### 3. Prefer Tuples for Methods

```typescript
// ✅ Good - correct this binding
const callback: Callback<[], void> = [obj, obj.method]
invokeCallback(callback)

// ❌ Avoid - manual binding
const callback = obj.method.bind(obj)
invokeCallback(callback)
```

### 4. Document Callback Signatures

```typescript
// ✅ Good - clear signature
type DataCallback = Callback<[data: string, index: number], void>

function processItems(
  items: string[],
  callback: DataCallback
) {
  items.forEach((item, i) => invokeCallback(callback, item, i))
}

// ❌ Avoid - unclear callback type
function processItems(items: string[], callback: any) {
  // What are the arguments?
}
```

## Why Callback Type?

### Problem: Lost This Context

```typescript
class Counter {
  count = 0

  increment() {
    this.count++
  }
}

const counter = new Counter()

// Problem: loses this
setTimeout(counter.increment, 100) // Error: this is undefined

// Solution 1: bind
setTimeout(counter.increment.bind(counter), 100) // Verbose

// Solution 2: Callback tuple
invokeCallback([counter, counter.increment]) // Clean
```

### Benefits

1. **Automatic Binding** - No manual `.bind()` calls
2. **Type Safety** - Full TypeScript inference
3. **Consistency** - Unified callback pattern
4. **Performance** - No extra closure allocations

## Performance

- **Zero overhead** for function callbacks
- **Single `apply` call** for method callbacks
- **No closures** created (unlike `.bind()`)
- **Inline-optimizable** by JS engines

## Comparison with Alternatives

### vs Function.bind()

```typescript
// bind - creates new function
const bound = obj.method.bind(obj)
invoke(bound)

// Callback - reuses method
invoke([obj, obj.method])
```

### vs Arrow Functions

```typescript
// Arrow - creates closure
const callback = () => obj.method()
invoke(callback)

// Callback - no closure
invoke([obj, obj.method])
```

### vs Event Listeners

```typescript
// addEventListener - requires removeEventListener with same reference
const listener = obj.handleEvent.bind(obj)
element.addEventListener('click', listener)
element.removeEventListener('click', listener)

// Callback - can be stored and invoked directly
const callback: Callback<[Event], void> = [obj, obj.handleEvent]
```

## Integration with Other Modules

### With async Module

```typescript
import { fire, task } from '@sky-modules/core/async'

class API {
  async fetchData() {
    return await fetch('/api/data')
  }
}

const api = new API()

// Fire object method
fire([api, api.fetchData])

// Task with object method
await task([api, api.fetchData])
```

### With EventEmitter

```typescript
import EventEmitter from '@sky-modules/core/EventEmitter'

class Logger {
  log(message: string) {
    console.log('[LOG]', message)
  }
}

const emitter = new EventEmitter<{ log: (msg: string) => void }>()
const logger = new Logger()

// Subscribe with method callback
emitter.on('log', [logger, logger.log])
```

## Related Modules

- [core/async](../async/) - Async utilities using Callback
- [core/EventEmitter](../EventEmitter/) - Event emitter
- [core/bind](../bind/) - Function binding utilities

## Examples

See [Callback.spec.ts](./Callback.spec.ts) for comprehensive usage examples and test cases.
