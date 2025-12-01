# EventEmitter

Type-safe event emitter pattern implementation with generic event maps.

## Overview

EventEmitter provides a robust, type-safe pub-sub pattern for event-driven programming. It uses TypeScript generics to enforce type safety for event names and their payloads, preventing runtime errors and improving developer experience.

**Key Features:**
- Type-safe event emissions and subscriptions
- Generic event map definition
- "Any" event listeners (wildcard subscriptions)
- Method chaining API
- Function extension support
- Zero dependencies

## Basic Usage

### Defining Event Map

```typescript
import EventEmitter from '@sky-modules/core/EventEmitter'

// Define your event map
interface MyEvents {
  'user:login': (userId: string, timestamp: number) => void
  'user:logout': (userId: string) => void
  'data:update': (data: { id: number; value: string }) => void
  'error': (error: Error) => void
}

// Create emitter
const emitter = new EventEmitter<MyEvents>()
```

### Subscribing to Events

```typescript
// Subscribe to events with type safety
emitter.on('user:login', (userId, timestamp) => {
  console.log(`User ${userId} logged in at ${timestamp}`)
  // TypeScript knows userId is string and timestamp is number
})

emitter.on('data:update', (data) => {
  console.log(`Data updated: ${data.id} = ${data.value}`)
  // TypeScript knows data has id and value properties
})

// Chainable API
emitter
  .on('user:login', handler1)
  .on('user:logout', handler2)
  .on('error', errorHandler)
```

### Emitting Events

```typescript
// Emit events with type-checked arguments
emitter.emit('user:login', 'user123', Date.now())

emitter.emit('data:update', { id: 1, value: 'hello' })

// TypeScript error - wrong argument types
// emitter.emit('user:login', 123, 'not a number')

// TypeScript error - missing arguments
// emitter.emit('user:login', 'user123')
```

### Unsubscribing

```typescript
const handler = (userId: string) => {
  console.log(`User ${userId} logged out`)
}

// Subscribe
emitter.on('user:logout', handler)

// Unsubscribe specific handler
emitter.off('user:logout', handler)

// Unsubscribe all handlers
emitter.offAll()
```

## Advanced Usage

### Any Event Listeners

Listen to all events regardless of type:

```typescript
// Subscribe to any event
emitter.onAny((eventName, ...args) => {
  console.log(`Event fired: ${String(eventName)}`, args)
})

// Will be called for all emits
emitter.emit('user:login', 'user123', Date.now())
emitter.emit('user:logout', 'user123')
emitter.emit('data:update', { id: 1, value: 'test' })
```

**Use Cases:**
- Logging all events
- Debugging event flow
- Analytics tracking
- Event replay systems

### Extending Classes

Add event emitter functionality to existing classes:

```typescript
class UserManager extends EventEmitter<MyEvents> {
  private users = new Map<string, User>()

  login(userId: string) {
    // ... login logic ...
    this.emit('user:login', userId, Date.now())
  }

  logout(userId: string) {
    // ... logout logic ...
    this.emit('user:logout', userId)
  }
}

const manager = new UserManager()
manager.on('user:login', (userId, timestamp) => {
  console.log(`Login event: ${userId} at ${timestamp}`)
})

manager.login('user123')
```

### Extending Functions

Add event emitter methods to functions:

```typescript
interface FunctionEvents {
  'called': (args: unknown[]) => void
  'returned': (result: unknown) => void
}

function myFunction(x: number): number {
  const result = x * 2
  return result
}

// Extend function with EventEmitter
const emittingFn = EventEmitter.extend<typeof myFunction, FunctionEvents>(myFunction)

// Subscribe to function events
emittingFn.on('called', (args) => {
  console.log('Function called with:', args)
})

emittingFn.on('returned', (result) => {
  console.log('Function returned:', result)
})

// Use function normally
const result = emittingFn(5)
```

### Manual Initialization

For more control over initialization:

```typescript
class CustomEmitter extends EventEmitter<MyEvents> {
  constructor() {
    super()
    // Manual initialization
    EventEmitter.super(this)
  }
}
```

## API Reference

### Constructor

```typescript
new EventEmitter<EventMap>()
```

Creates a new EventEmitter instance with the specified event map.

**Type Parameters:**
- `EventMap` - Object mapping event names to handler signatures

### Methods

#### `on\<K\>(event, callback)`

Subscribe to an event.

```typescript
on<K extends keyof T>(ev: K, callback: T[K]): this
```

**Parameters:**
- `ev` - Event name (type-checked against event map)
- `callback` - Handler function (signature enforced by event map)

**Returns:** `this` for method chaining

**Example:**
```typescript
emitter.on('user:login', (userId, timestamp) => {
  // Handle login
})
```

#### `onAny(callback)`

Subscribe to all events.

```typescript
onAny<T extends []>(callback: (...args: T) => void): this
```

**Parameters:**
- `callback` - Handler receiving event name and arguments

**Returns:** `this` for method chaining

**Example:**
```typescript
emitter.onAny((eventName, ...args) => {
  console.log(`Event: ${String(eventName)}`, args)
})
```

#### `off\<K\>(event, callback)`

Unsubscribe from an event.

```typescript
off<K extends keyof T>(ev: K, callback: T[K]): this
```

**Parameters:**
- `ev` - Event name
- `callback` - Handler to remove (must be same reference)

**Returns:** `this` for method chaining

**Example:**
```typescript
const handler = (userId) => { /* ... */ }
emitter.on('user:login', handler)
emitter.off('user:login', handler)
```

#### `offAll()`

Unsubscribe from all events.

```typescript
offAll(): this
```

**Returns:** `this` for method chaining

**Example:**
```typescript
emitter.offAll() // Removes all listeners
```

#### `emit\<K\>(event, ...args)`

Emit an event to all subscribers.

```typescript
emit<K extends keyof T>(ev: K, ...args: Parameters<T[K]> & []): this
```

**Parameters:**
- `ev` - Event name
- `args` - Event arguments (type-checked against handler signature)

**Returns:** `this` for method chaining

**Example:**
```typescript
emitter.emit('user:login', 'user123', Date.now())
```

### Static Methods

#### `EventEmitter.super(self)`

Manually initialize EventEmitter properties.

```typescript
static super<T extends { [K in keyof T]: T[K] }>(self: EventEmitter<T>): void
```

**Parameters:**
- `self` - EventEmitter instance to initialize

**Example:**
```typescript
class MyEmitter extends EventEmitter<MyEvents> {
  constructor() {
    super()
    EventEmitter.super(this)
  }
}
```

#### `EventEmitter.extend(fn)`

Extend a function with EventEmitter methods.

```typescript
static extend<T extends Function, E extends { [K in keyof E]: E[K] }>(
  fn: T
): T & EventEmitter<E>
```

**Parameters:**
- `fn` - Function to extend

**Returns:** Function with EventEmitter methods added

**Example:**
```typescript
const fn = (x: number) => x * 2
const emittingFn = EventEmitter.extend<typeof fn, MyEvents>(fn)

emittingFn.on('called', (args) => console.log(args))
```

## Common Patterns

### Request/Response Pattern

```typescript
interface RequestEvents {
  'request': (id: string, data: unknown) => void
  'response': (id: string, result: unknown) => void
  'error': (id: string, error: Error) => void
}

const api = new EventEmitter<RequestEvents>()

// Subscriber
api.on('request', async (id, data) => {
  try {
    const result = await processRequest(data)
    api.emit('response', id, result)
  } catch (error) {
    api.emit('error', id, error as Error)
  }
})

// Requester
async function makeRequest(data: unknown): Promise<unknown> {
  const id = generateId()

  return new Promise((resolve, reject) => {
    api.on('response', (responseId, result) => {
      if (responseId === id) resolve(result)
    })

    api.on('error', (errorId, error) => {
      if (errorId === id) reject(error)
    })

    api.emit('request', id, data)
  })
}
```

### State Machine

```typescript
interface StateMachineEvents {
  'state:change': (from: string, to: string) => void
  'state:enter': (state: string) => void
  'state:exit': (state: string) => void
}

class StateMachine extends EventEmitter<StateMachineEvents> {
  private currentState: string = 'idle'

  transition(newState: string) {
    const oldState = this.currentState

    this.emit('state:exit', oldState)
    this.emit('state:change', oldState, newState)
    this.currentState = newState
    this.emit('state:enter', newState)
  }
}

const fsm = new StateMachine()

fsm.on('state:enter', (state) => {
  console.log(`Entered state: ${state}`)
})

fsm.transition('loading')
fsm.transition('ready')
```

### Plugin System

```typescript
interface PluginEvents {
  'plugin:load': (name: string) => void
  'plugin:unload': (name: string) => void
  'plugin:error': (name: string, error: Error) => void
}

class PluginManager extends EventEmitter<PluginEvents> {
  private plugins = new Map<string, Plugin>()

  load(name: string, plugin: Plugin) {
    try {
      plugin.initialize()
      this.plugins.set(name, plugin)
      this.emit('plugin:load', name)
    } catch (error) {
      this.emit('plugin:error', name, error as Error)
    }
  }

  unload(name: string) {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.cleanup()
      this.plugins.delete(name)
      this.emit('plugin:unload', name)
    }
  }
}
```

### Event Bus

```typescript
// Global event bus
interface GlobalEvents {
  'app:ready': () => void
  'user:action': (action: string, data: unknown) => void
  'notification': (message: string, level: 'info' | 'warning' | 'error') => void
}

class EventBus extends EventEmitter<GlobalEvents> {
  private static instance: EventBus

  static getInstance(): EventBus {
    if (!this.instance) {
      this.instance = new EventBus()
    }
    return this.instance
  }

  private constructor() {
    super()
  }
}

// Usage across application
const bus = EventBus.getInstance()

// Module A
bus.on('user:action', (action, data) => {
  analytics.track(action, data)
})

// Module B
bus.emit('user:action', 'button-click', { buttonId: 'submit' })
```

## Type Safety

EventEmitter provides complete type safety:

```typescript
interface Events {
  'typed': (x: number, y: string) => void
  'untyped': () => void
}

const emitter = new EventEmitter<Events>()

// ✅ Correct
emitter.on('typed', (x, y) => {
  // x is number, y is string
})
emitter.emit('typed', 42, 'hello')

// ❌ TypeScript errors
emitter.on('typed', (x: string) => {})  // Wrong type
emitter.emit('typed', 'wrong', 42)      // Wrong argument types
emitter.emit('typed', 42)               // Missing argument
emitter.emit('unknown', 123)            // Unknown event
```

## Performance Considerations

### Memory Management

```typescript
// Remember to unsubscribe to prevent memory leaks
class Component extends EventEmitter<MyEvents> {
  private cleanup: (() => void)[] = []

  onMount() {
    const handler = () => { /* ... */ }
    this.on('update', handler)

    // Store cleanup function
    this.cleanup.push(() => this.off('update', handler))
  }

  onUnmount() {
    // Clean up all subscriptions
    this.cleanup.forEach(fn => fn())
    this.cleanup = []
  }
}
```

### Handler Deduplication

```typescript
// Avoid duplicate handlers
const handler = () => console.log('fired')

emitter.on('event', handler)
emitter.on('event', handler)  // Same reference - won't duplicate

// To allow duplicates, use different function instances
emitter.on('event', () => console.log('fired'))
emitter.on('event', () => console.log('fired'))  // Different instances
```

### Batch Operations

```typescript
// Batch multiple subscriptions
function setupListeners(emitter: EventEmitter<MyEvents>) {
  return emitter
    .on('event1', handler1)
    .on('event2', handler2)
    .on('event3', handler3)
}
```

## Testing

```typescript
import { describe, it, expect } from 'vitest'
import EventEmitter from '@sky-modules/core/EventEmitter'

describe('EventEmitter', () => {
  it('should emit and receive events', () => {
    interface TestEvents {
      'test': (value: number) => void
    }

    const emitter = new EventEmitter<TestEvents>()
    let received: number | undefined

    emitter.on('test', (value) => {
      received = value
    })

    emitter.emit('test', 42)

    expect(received).toBe(42)
  })

  it('should unsubscribe handlers', () => {
    const emitter = new EventEmitter<{ 'test': () => void }>()
    let count = 0

    const handler = () => { count++ }

    emitter.on('test', handler)
    emitter.emit('test')
    expect(count).toBe(1)

    emitter.off('test', handler)
    emitter.emit('test')
    expect(count).toBe(1) // Not incremented
  })
})
```

## Best Practices

### 1. Define Clear Event Maps

```typescript
// Good - descriptive event names with namespaces
interface UserEvents {
  'user:created': (user: User) => void
  'user:updated': (user: User, changes: Partial<User>) => void
  'user:deleted': (userId: string) => void
}

// Avoid - vague names
interface BadEvents {
  'change': (data: any) => void
  'update': () => void
}
```

### 2. Use Type-Safe Payloads

```typescript
// Good - strongly typed
interface GoodEvents {
  'data:loaded': (data: { items: Item[]; total: number }) => void
}

// Avoid - any types
interface BadEvents {
  'data:loaded': (data: any) => void
}
```

### 3. Clean Up Subscriptions

```typescript
// Good - cleanup on unmount/destroy
class Component {
  private emitter = new EventEmitter<Events>()

  destroy() {
    this.emitter.offAll()
  }
}
```

### 4. Document Event Contracts

```typescript
/**
 * Events emitted by DataService
 *
 * @event data:fetch - Emitted when data fetch starts
 * @event data:success - Emitted when data fetch succeeds
 * @event data:error - Emitted when data fetch fails
 */
interface DataServiceEvents {
  'data:fetch': (url: string) => void
  'data:success': (data: unknown) => void
  'data:error': (error: Error) => void
}
```

## Related Modules

- [core/Array](../Array/) - Array utilities including `remove` method
- [core/PromisePool](../PromisePool/) - Concurrent promise execution
- [core/type-guards](../type-guards/) - Type guard utilities

## Examples

See [EventEmitter.spec.ts](./EventEmitter.spec.ts) for comprehensive usage examples and test cases.
