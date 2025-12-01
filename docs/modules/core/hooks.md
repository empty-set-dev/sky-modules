# Hooks

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  hooks utility module
</div>

Hook system for intercepting and chaining method calls with middleware-like functionality.

## Installation

```typescript
import { hook, withHooks } from '@sky-modules/core/hooks'
```

## API

### Hook

Type definition for hook functions.

```typescript
type Hook = ((
  this: unknown,
  next: (this: unknown, ...args: unknown[]) => void,
  ...args: unknown[]
) => void) & { next: Hook }
```

**Properties:**
- `next` - Next hook in the chain

### AnyHook

Hook that handles any event type.

```typescript
type AnyHook = ((
  this: unknown,
  next: (this: unknown, ...args: unknown[]) => void,
  eventName: string,
  ...args: unknown[]
) => void) & { next: Hook }
```

### HooksOwner

Interface for objects that support hooks.

```typescript
type HooksOwner = Record<PropertyKey, (...args: unknown[]) => void> & {
  __hooks: Record<PropertyKey, Hook> & { onAny?: AnyHook }
  __bakedHooks: Record<
    PropertyKey,
    (eventName: string, callback: Callback<unknown[], unknown>, ...args: unknown[]) => unknown
  >
}
```

### hook(prototype, key, descriptor)

Register a hook on a prototype method.

```typescript
hook(prototype: object, k: PropertyKey, descriptor: PropertyDescriptor): void
```

**Parameters:**
- `prototype` - Class prototype
- `k` - Method key
- `descriptor` - Property descriptor with hook function

**Behavior:**
- Adds hook to method's hook chain
- Creates separate __hooks chain per class level
- Compiles hooks when first called

**Returns:** void

### withHooks(eventType, hooksOwner, callback, ...args)

Execute callback with hooks applied.

```typescript
withHooks<A extends unknown[], R, H>(
  eventType: string,
  hooksOwner: H,
  callback: Callback<A, R>,
  ...args: A
): R
```

**Parameters:**
- `eventType` - Hook event name
- `hooksOwner` - Object with hooks
- `callback` - Function to execute
- `args` - Arguments to pass to callback

**Returns:** Callback return value

## Usage

### Creating a Class with Hooks

```typescript
import { hook } from '@sky-modules/core/hooks'

class API {
  __hooks = {}
  __bakedHooks = {}

  @hook
  async fetchData(id: string) {
    return await fetch(`/api/data/${id}`).then(r => r.json())
  }
}
```

### Adding Hooks to Methods

```typescript
const api = new API()

// Add logging hook
api.__hooks.fetchData = function(next, ...args) {
  console.log('Before fetch:', args)
  next(...args)
  console.log('After fetch')
}
```

### Using withHooks for Execution

```typescript
import { withHooks } from '@sky-modules/core/hooks'

const result = withHooks(
  'fetchData',
  api,
  async (id) => {
    return await api.fetchData(id)
  },
  '123'
)
```

### Hook Chain

```typescript
// First hook
api.__hooks.processData = function(next, data) {
  console.log('Hook 1: Start')
  next(data)
  console.log('Hook 1: End')
}

// Second hook (added later)
api.__hooks.processData.next = function(next, data) {
  console.log('Hook 2: Start')
  next(data)
  console.log('Hook 2: End')
}

// Both hooks execute in order
```

### Universal Hook (onAny)

```typescript
api.__hooks.onAny = function(next, eventName, ...args) {
  console.log(`Event: ${eventName}`)
  next(...args)
}
```

## Notes

- Hooks form a chain, each calling `next()` to proceed
- Multiple hooks on same method are stacked
- Hooks are compiled on first use for performance
- Works with async and sync methods
- Context (this) is preserved through hook chain
