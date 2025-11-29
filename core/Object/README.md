# Object Extensions

Deep freeze utility for immutable object trees.

## Overview

The Object module extends the native `Object` constructor with deep freezing capabilities. It provides utilities to recursively freeze objects and their nested properties, ensuring complete immutability.

**Key Features:**
- Deep freeze objects recursively
- Freeze detection with symbol marker
- Type-safe with TypeScript
- Works with arrays and nested objects
- Zero dependencies

## Installation

```typescript
import '@sky-modules/core/Object'
```

## API Reference

### Object.freezeDeep(object)

Recursively freeze an object and all its nested properties.

```typescript
Object.freezeDeep<T extends Record<string, unknown>>(object: T): Readonly<T>
```

**Parameters:**
- `object` - Object or array to freeze deeply

**Returns:** Frozen object (same reference)

**Example:**
```typescript
const config = {
  api: {
    url: 'https://api.example.com',
    timeout: 5000
  },
  features: ['auth', 'analytics']
}

Object.freezeDeep(config)

// All modifications fail silently (or throw in strict mode)
config.api.url = 'changed'           // No effect
config.features.push('new')          // No effect
config.newProp = 'value'             // No effect
```

### Object.isFreezable(value)

Check if a value can be frozen.

```typescript
Object.isFreezable(value: unknown): value is Record<string, unknown>
```

**Parameters:**
- `value` - Value to check

**Returns:** `true` if value is an object or function, `false` otherwise

**Example:**
```typescript
Object.isFreezable({})              // true
Object.isFreezable([])              // true
Object.isFreezable(function() {})   // true
Object.isFreezable(42)              // false
Object.isFreezable('string')        // false
Object.isFreezable(null)            // false
Object.isFreezable(undefined)       // false
```

### Object.isDeeplyFrozen(object)

Check if an object has been deeply frozen.

```typescript
Object.isDeeplyFrozen(object: Object): boolean
```

**Parameters:**
- `object` - Object to check

**Returns:** `true` if object was frozen with `freezeDeep()`, `false` otherwise

**Example:**
```typescript
const obj = { a: 1 }

Object.isDeeplyFrozen(obj)      // false

Object.freezeDeep(obj)

Object.isDeeplyFrozen(obj)      // true
Object.isFrozen(obj)            // true (also shallow frozen)
```

### Symbol.deeplyFrozen

Symbol marker attached to deeply frozen objects.

```typescript
Symbol.deeplyFrozen: unique symbol
```

**Example:**
```typescript
const obj = { a: 1 }
Object.freezeDeep(obj)

obj[Symbol.deeplyFrozen] // true
```

## Usage Patterns

### Immutable Configuration

```typescript
const config = Object.freezeDeep({
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      user: 'admin',
      password: 'secret'
    }
  },
  features: {
    auth: true,
    analytics: false
  }
})

// Safe to pass around - cannot be modified
export default config
```

### Immutable Constants

```typescript
const ROUTES = Object.freezeDeep({
  home: '/',
  user: {
    profile: '/user/profile',
    settings: '/user/settings'
  },
  admin: {
    dashboard: '/admin',
    users: '/admin/users'
  }
})

// Guaranteed immutable
export { ROUTES }
```

### Immutable State

```typescript
class Store {
  private state: Readonly<State>

  constructor(initialState: State) {
    this.state = Object.freezeDeep(initialState)
  }

  getState(): Readonly<State> {
    return this.state
  }

  setState(newState: State) {
    this.state = Object.freezeDeep(newState)
  }
}
```

### Freezing Arrays

```typescript
const items = Object.freezeDeep([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
])

// Cannot modify array
items.push({ id: 3, name: 'Item 3' })  // No effect

// Cannot modify nested objects
items[0].name = 'Changed'              // No effect
```

### Configuration Validation

```typescript
function loadConfig(raw: unknown): Config {
  // Validate and freeze
  const validated = validateConfig(raw)
  return Object.freezeDeep(validated)
}

const config = loadConfig(rawData)

// Config is guaranteed immutable
// Can safely cache and reuse
```

### Enum-like Objects

```typescript
const Status = Object.freezeDeep({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const)

type StatusValue = typeof Status[keyof typeof Status]

// Cannot be modified
function setStatus(status: StatusValue) {
  // ...
}
```

## Deep Freeze vs Shallow Freeze

### Object.freeze() - Shallow

```typescript
const obj = {
  a: 1,
  nested: { b: 2 }
}

Object.freeze(obj)

obj.a = 10              // No effect (frozen)
obj.nested.b = 20       // MODIFIED! (not frozen)
```

### Object.freezeDeep() - Deep

```typescript
const obj = {
  a: 1,
  nested: { b: 2 }
}

Object.freezeDeep(obj)

obj.a = 10              // No effect (frozen)
obj.nested.b = 20       // No effect (frozen deeply)
```

## Best Practices

### 1. Freeze After Creation

```typescript
// ✅ Good - freeze immediately
const config = Object.freezeDeep({
  api: { url: 'https://api.com' }
})

// ❌ Avoid - freeze late
const config = { api: { url: 'https://api.com' } }
// ... config might be modified here
Object.freezeDeep(config)
```

### 2. Use for Configurations

```typescript
// ✅ Good - immutable config
export const APP_CONFIG = Object.freezeDeep({
  version: '1.0.0',
  features: ['auth', 'analytics']
})

// ❌ Avoid - mutable config
export const APP_CONFIG = {
  version: '1.0.0',
  features: ['auth', 'analytics']
}
```

### 3. Don't Freeze Large Objects

```typescript
// ✅ Good - small constant data
const COLORS = Object.freezeDeep({
  primary: '#007bff',
  secondary: '#6c757d'
})

// ❌ Avoid - large dynamic data
const users = await fetchAllUsers() // 10,000 users
Object.freezeDeep(users) // Expensive!
```

### 4. Check Before Freezing

```typescript
// ✅ Good - check if already frozen
function ensureFrozen<T extends object>(obj: T): Readonly<T> {
  return Object.isDeeplyFrozen(obj)
    ? obj as Readonly<T>
    : Object.freezeDeep(obj)
}

// ❌ Avoid - freeze repeatedly
Object.freezeDeep(obj)
Object.freezeDeep(obj) // Redundant
```

## Performance Considerations

### Freezing Cost

- **Small objects**: Negligible overhead
- **Large objects**: Can be expensive
- **Deep nesting**: Cost increases with depth
- **Arrays**: Each element is processed

### When to Use

**Use freezeDeep() for:**
- Application configuration
- Constants and enums
- Immutable reference data
- Security-critical data

**Avoid freezeDeep() for:**
- Large dynamic datasets
- Frequently changing data
- Performance-critical hot paths
- User input data

## Strict Mode Behavior

```typescript
'use strict'

const obj = Object.freezeDeep({ a: 1 })

// In strict mode: throws TypeError
obj.a = 2 // TypeError: Cannot assign to read only property

// In non-strict mode: fails silently
obj.a = 2 // No error, no effect
```

## Type Safety

```typescript
const config = Object.freezeDeep({
  api: {
    url: 'https://api.com',
    timeout: 5000
  }
})

// TypeScript knows it's Readonly
type ConfigType = typeof config
// Readonly<{ api: { url: string, timeout: number } }>

// Type error at compile time
config.api.url = 'changed' // Error: Cannot assign to 'url'
```

## Comparison with Alternatives

### vs Object.freeze()

```typescript
// Object.freeze - shallow only
const obj = Object.freeze({ nested: { value: 1 } })
obj.nested.value = 2 // MODIFIABLE

// Object.freezeDeep - recursive
const obj = Object.freezeDeep({ nested: { value: 1 } })
obj.nested.value = 2 // IMMUTABLE
```

### vs Immutable.js

```typescript
// Immutable.js - different API, larger bundle
import { Map } from 'immutable'
const map = Map({ a: Map({ b: 1 }) })
const updated = map.setIn(['a', 'b'], 2)

// Object.freezeDeep - native objects, zero dependencies
const obj = Object.freezeDeep({ a: { b: 1 } })
// To "update": create new object
const updated = { ...obj, a: { ...obj.a, b: 2 } }
```

### vs Immer

```typescript
// Immer - mutable-style updates with structural sharing
import produce from 'immer'
const next = produce(state, draft => {
  draft.a.b = 2
})

// Object.freezeDeep - pure immutability, no updates
const obj = Object.freezeDeep({ a: { b: 1 } })
// Must create new objects manually
```

## Symbol Marker

The `Symbol.deeplyFrozen` marker allows quick checks without recursively checking all properties:

```typescript
const obj = { nested: { value: 1 } }

// Without marker - must check recursively
function isCompletelyFrozen(obj: any): boolean {
  if (!Object.isFrozen(obj)) return false
  return Object.values(obj).every(v =>
    typeof v !== 'object' || isCompletelyFrozen(v)
  )
}

// With marker - instant check
Object.freezeDeep(obj)
Object.isDeeplyFrozen(obj) // true (O(1) lookup)
```

## Related Modules

- [core/define](../define/) - Class and object definition
- [core/canClone](../canClone/) - Cloning utilities
- [core/type-guards](../type-guards/) - Type checking utilities

## Examples

See [Object.spec.ts](./Object.spec.ts) for comprehensive usage examples and test cases.
