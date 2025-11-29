# Map Extensions

Type-safe Map.has() with automatic type narrowing for Map.get().

## Overview

The Map module extends the native `Map` type with improved TypeScript type narrowing. After checking `map.has(key)`, TypeScript knows that `map.get(key)` will return a non-undefined value.

**Key Features:**
- Type-safe `has()` checks
- Automatic type narrowing for `get()`
- No runtime overhead
- Zero dependencies

## Installation

```typescript
import '@sky-modules/core/Map'
```

## API Reference

### Map.prototype.has(key)

Check if map has a key with type narrowing.

```typescript
has<P extends K>(key: P): this is { get(key: P): V } & this
```

**Parameters:**
- `key` - Key to check

**Returns:** `true` if key exists, `false` otherwise

**Type Narrowing:**
When `has(key)` returns `true`, TypeScript knows `get(key)` returns `V` (not `V | undefined`)

**Example:**
```typescript
const map = new Map<string, number>()
map.set('count', 42)

if (map.has('count')) {
  // TypeScript knows get() returns number, not number | undefined
  const value = map.get('count') // Type: number
  console.log(value + 1) // No null check needed!
}
```

## Usage Patterns

### Before (Without Extension)

```typescript
const map = new Map<string, User>()

if (map.has('user123')) {
  const user = map.get('user123') // Type: User | undefined

  // Need manual type check or assertion
  if (user) {
    console.log(user.name) // OK
  }
  // or
  console.log(user!.name) // Unsafe assertion
}
```

### After (With Extension)

```typescript
const map = new Map<string, User>()

if (map.has('user123')) {
  const user = map.get('user123') // Type: User (no undefined!)
  console.log(user.name) // OK - no check needed
}
```

### Type-Safe Lookups

```typescript
const config = new Map<string, string>()
config.set('apiUrl', 'https://api.example.com')
config.set('timeout', '5000')

function getConfig(key: string): string {
  if (config.has(key)) {
    return config.get(key) // Type: string (safe!)
  }
  throw new Error(`Config key not found: ${key}`)
}
```

### Optional Chaining

```typescript
const cache = new Map<string, Data>()

// Without extension - need optional chaining
const data1 = cache.get('key')?.value

// With extension - direct access after has() check
if (cache.has('key')) {
  const data2 = cache.get('key').value // Safe, no ?.
}
```

### Registry Pattern

```typescript
class ServiceRegistry {
  private services = new Map<string, Service>()

  register(name: string, service: Service) {
    this.services.set(name, service)
  }

  get(name: string): Service {
    if (this.services.has(name)) {
      // Type-safe: get() returns Service, not Service | undefined
      return this.services.get(name)
    }
    throw new Error(`Service not found: ${name}`)
  }

  tryGet(name: string): Service | undefined {
    return this.services.get(name)
  }
}

const registry = new ServiceRegistry()
const service = registry.get('auth') // Type: Service
```

### Cache Implementation

```typescript
class Cache<K, V> {
  private map = new Map<K, V>()

  set(key: K, value: V) {
    this.map.set(key, value)
  }

  get(key: K): V | undefined {
    return this.map.get(key)
  }

  getOrThrow(key: K): V {
    if (this.map.has(key)) {
      return this.map.get(key) // Type: V (no undefined)
    }
    throw new Error('Cache miss')
  }

  getOrCompute(key: K, compute: () => V): V {
    if (this.map.has(key)) {
      return this.map.get(key) // Type: V
    }
    const value = compute()
    this.map.set(key, value)
    return value
  }
}
```

### Event Handlers

```typescript
class EventBus {
  private handlers = new Map<string, Set<Function>>()

  on(event: string, handler: Function) {
    if (this.handlers.has(event)) {
      this.handlers.get(event).add(handler) // Type: Set<Function>
    } else {
      this.handlers.set(event, new Set([handler]))
    }
  }

  emit(event: string, ...args: unknown[]) {
    if (this.handlers.has(event)) {
      const handlers = this.handlers.get(event) // Type: Set<Function>
      handlers.forEach(handler => handler(...args))
    }
  }
}
```

### Memoization

```typescript
function memoize<A extends unknown[], R>(
  fn: (...args: A) => R
): (...args: A) => R {
  const cache = new Map<string, R>()

  return (...args: A): R => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key) // Type: R (no undefined check)
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

const fibonacci = memoize((n: number): number => {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
})
```

### Resource Pool

```typescript
class ResourcePool<T> {
  private available = new Map<string, T>()
  private inUse = new Set<string>()

  acquire(id: string): T {
    if (this.available.has(id)) {
      const resource = this.available.get(id) // Type: T
      this.available.delete(id)
      this.inUse.add(id)
      return resource
    }
    throw new Error(`Resource not available: ${id}`)
  }

  release(id: string, resource: T) {
    this.inUse.delete(id)
    this.available.set(id, resource)
  }
}
```

## Best Practices

### 1. Always Check Before Get

```typescript
// ✅ Good - check with has()
if (map.has(key)) {
  const value = map.get(key) // Type-safe
  useValue(value)
}

// ❌ Avoid - unchecked get()
const value = map.get(key) // Type: V | undefined
if (value) {
  useValue(value)
}
```

### 2. Use for Non-Null Guarantees

```typescript
// ✅ Good - leverages type narrowing
function getRequired<K, V>(map: Map<K, V>, key: K): V {
  if (map.has(key)) {
    return map.get(key) // Type: V
  }
  throw new Error('Key not found')
}

// ❌ Avoid - manual assertion
function getRequired<K, V>(map: Map<K, V>, key: K): V {
  return map.get(key)! // Unsafe!
}
```

### 3. Combine with Optional Returns

```typescript
// ✅ Good - explicit undefined for optional
class Config {
  private map = new Map<string, string>()

  get(key: string): string | undefined {
    return this.map.get(key) // Explicit undefined
  }

  getRequired(key: string): string {
    if (this.map.has(key)) {
      return this.map.get(key) // Non-undefined
    }
    throw new Error(`Missing config: ${key}`)
  }
}
```

### 4. Don't Assume Has Means Get Succeeds

```typescript
// ⚠️ Be careful with concurrent modifications
if (map.has(key)) {
  // Another thread/task could delete the key here
  const value = map.get(key) // Could be undefined in rare cases
}

// ✅ Better for concurrent scenarios
const value = map.get(key)
if (value !== undefined) {
  useValue(value)
}
```

## How It Works

### Type Predicate Magic

```typescript
// The extension uses TypeScript's type predicate:
has<P extends K>(key: P): this is { get(key: P): V } & this

// When has() returns true:
// - TypeScript narrows `this` to have a get() that returns V
// - The `& this` preserves all other Map methods
```

### Example Type Flow

```typescript
const map: Map<string, number>

// Before check
map.get('key') // Type: number | undefined

// After has() check
if (map.has('key')) {
  // TypeScript knows: this is { get(key: 'key'): number } & Map<string, number>
  map.get('key') // Type: number (no undefined!)
}
```

## Performance

- **Zero runtime overhead** - Pure TypeScript feature
- **No monkey-patching** - Only type declaration
- **Compiled away** - No JavaScript emitted

## Limitations

### 1. Only Works Within Same Scope

```typescript
const map = new Map<string, number>()

function check(key: string): boolean {
  return map.has(key)
}

function getValue(key: string): number {
  if (check(key)) {
    return map.get(key) // Still number | undefined
  }
}
```

### 2. Doesn't Survive Reassignment

```typescript
let hasKey = map.has('key')

if (hasKey) {
  map.get('key') // Still number | undefined
}
```

### 3. Not Flow-Sensitive Across Modifications

```typescript
if (map.has('key')) {
  map.delete('key')
  map.get('key') // Type: number (but actually undefined!)
}
```

## Comparison with Alternatives

### vs Non-Null Assertion

```typescript
// Non-null assertion - runtime error if wrong
const value = map.get(key)!

// Type narrowing - compile-time safety
if (map.has(key)) {
  const value = map.get(key)
}
```

### vs Optional Chaining

```typescript
// Optional chaining - returns undefined
const value = map.get(key)?.toString()

// Type narrowing - direct access
if (map.has(key)) {
  const value = map.get(key).toString()
}
```

### vs Manual Checks

```typescript
// Manual check - verbose
const value = map.get(key)
if (value !== undefined) {
  useValue(value)
}

// Type narrowing - concise
if (map.has(key)) {
  useValue(map.get(key))
}
```

## Related Modules

- [core/type-guards](../type-guards/) - Runtime type checking
- [core/assume](../assume/) - Type assumptions
- [core/Object](../Object/) - Object utilities

## Examples

See [Map.spec.ts](./Map.spec.ts) for comprehensive usage examples and test cases.
