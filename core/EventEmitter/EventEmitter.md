# EventEmitter

Type-safe event emitter with full TypeScript support.

## Overview

`EventEmitter` is a strongly-typed event system that provides compile-time type safety for event names and their arguments. It ensures you can't emit events that don't exist or pass wrong argument types.

## Quick Start

```typescript
import EventEmitter from '@sky-modules/core/EventEmitter'

// Define your event interface
interface MyEvents {
    connect: (url: string) => void
    disconnect: () => void
    message: (data: string, timestamp: number) => void
    error: (error: Error) => void
}

// Create typed emitter
class MyService extends EventEmitter<MyEvents> {
    constructor() {
        super()
        EventEmitter.super(this)
    }

    connect(url: string) {
        // TypeScript ensures correct event name and arguments
        this.emit('connect', url)
    }
}

const service = new MyService()

// Type-safe event listeners
service.on('message', (data, timestamp) => {
    // TypeScript knows: data is string, timestamp is number
    console.log(`[${timestamp}] ${data}`)
})

// TypeScript error if wrong types
service.on('message', (data: number) => {}) // ❌ Error!
service.emit('message', 'hello', 123) // ✅ OK
service.emit('message', 123, 'hello') // ❌ Error!
```

## API Reference

### Constructor

```typescript
new EventEmitter<T extends { [K in keyof T]: T[K] }>()
```

Creates a new event emitter with typed events.

**Type Parameter:**
- `T` - Event map where keys are event names and values are callback signatures

**Example:**
```typescript
interface Events {
    save: (filename: string) => void
    load: () => void
}

const emitter = new EventEmitter<Events>()
```

### Methods

#### `on<K>(event: K, callback: T[K]): this`

Registers an event listener.

**Parameters:**
- `event` - Event name (must be key from event interface)
- `callback` - Event handler (signature must match event definition)

**Returns:** `this` (for method chaining)

**Example:**
```typescript
emitter.on('save', (filename) => {
    console.log(`Saving ${filename}`)
})

// Method chaining
emitter
    .on('save', handler1)
    .on('save', handler2)
    .on('load', handler3)
```

#### `off<K>(event: K, callback: T[K]): this`

Removes an event listener.

**Parameters:**
- `event` - Event name
- `callback` - Specific handler to remove

**Returns:** `this` (for method chaining)

**Example:**
```typescript
function handler(filename: string) {
    console.log(filename)
}

emitter.on('save', handler)
emitter.off('save', handler) // Removes only this handler
```

**Note:** Only removes the specific callback reference. Use the same function reference to remove it.

#### `emit<K>(event: K, ...args: Parameters<T[K]>): this`

Triggers an event, calling all registered listeners.

**Parameters:**
- `event` - Event name
- `...args` - Arguments to pass to listeners (type-checked!)

**Returns:** `this` (for method chaining)

**Example:**
```typescript
// TypeScript ensures correct arguments
emitter.emit('save', 'data.json') // ✅ OK
emitter.emit('save', 123) // ❌ Error: expects string
emitter.emit('save') // ❌ Error: missing argument
```

## Static Methods

### `EventEmitter.super<T>(self: EventEmitter<T>): void`

Initializes the event emitter. Call in constructor when extending EventEmitter.

**Example:**
```typescript
class MyEmitter extends EventEmitter<MyEvents> {
    constructor() {
        super()
        EventEmitter.super(this) // Required!
    }
}
```

### `EventEmitter.extend<T, E>(fn: T): T & EventEmitter<E>`

Extends a function with EventEmitter capabilities.

**Parameters:**
- `fn` - Function to extend
- `E` - Event interface type parameter

**Returns:** Function with event emitter methods

**Example:**
```typescript
interface RouterEvents {
    route: (path: string) => void
}

function router(path: string) {
    router.emit('route', path)
}

EventEmitter.extend<typeof router, RouterEvents>(router)

// Now router has event methods
router.on('route', (path) => console.log(path))
router('/home')
```

## Usage Patterns

### Basic Event Handling

```typescript
interface AppEvents {
    start: () => void
    stop: () => void
    update: (progress: number) => void
}

class App extends EventEmitter<AppEvents> {
    constructor() {
        super()
        EventEmitter.super(this)
    }

    run() {
        this.emit('start')

        let progress = 0
        const interval = setInterval(() => {
            progress += 10
            this.emit('update', progress)

            if (progress >= 100) {
                clearInterval(interval)
                this.emit('stop')
            }
        }, 100)
    }
}

const app = new App()

app.on('start', () => console.log('Started!'))
app.on('update', (progress) => console.log(`${progress}%`))
app.on('stop', () => console.log('Done!'))

app.run()
```

### Multiple Listeners

Multiple listeners for the same event are all called:

```typescript
emitter.on('save', () => console.log('Handler 1'))
emitter.on('save', () => console.log('Handler 2'))
emitter.on('save', () => console.log('Handler 3'))

emitter.emit('save', 'file.txt')
// Output:
// Handler 1
// Handler 2
// Handler 3
```

### Removing Listeners

```typescript
function onSave(filename: string) {
    console.log(`Saved ${filename}`)
}

emitter.on('save', onSave)
emitter.emit('save', 'test.txt') // Called

emitter.off('save', onSave)
emitter.emit('save', 'test2.txt') // Not called
```

### Method Chaining

```typescript
emitter
    .on('connect', () => console.log('Connected'))
    .on('disconnect', () => console.log('Disconnected'))
    .emit('connect')
    .emit('disconnect')
```

### Error Handling

```typescript
interface Events {
    error: (error: Error) => void
    success: (result: string) => void
}

class Service extends EventEmitter<Events> {
    constructor() {
        super()
        EventEmitter.super(this)
    }

    async fetchData() {
        try {
            const result = await fetch('/api/data')
            this.emit('success', await result.text())
        } catch (error) {
            this.emit('error', error as Error)
        }
    }
}

const service = new Service()
service.on('error', (error) => console.error('Failed:', error))
service.on('success', (data) => console.log('Data:', data))
```

### Lifecycle Events

```typescript
interface ComponentEvents {
    mount: () => void
    update: (props: any) => void
    unmount: () => void
}

class Component extends EventEmitter<ComponentEvents> {
    constructor() {
        super()
        EventEmitter.super(this)
    }

    mount() {
        this.emit('mount')
    }

    update(props: any) {
        this.emit('update', props)
    }

    destroy() {
        this.emit('unmount')
    }
}
```

## Advanced Usage

### Extending Functions

Add events to plain functions:

```typescript
interface LoggerEvents {
    log: (message: string, level: string) => void
}

function logger(message: string) {
    const level = 'info'
    logger.emit('log', message, level)
    console.log(`[${level}] ${message}`)
}

EventEmitter.extend<typeof logger, LoggerEvents>(logger)

// Subscribe to log events
logger.on('log', (message, level) => {
    // Send to analytics
})

logger('Application started')
```

### Event Namespacing

Use nested interfaces for organization:

```typescript
interface Events {
    'user:login': (username: string) => void
    'user:logout': () => void
    'system:start': () => void
    'system:stop': () => void
}

emitter.on('user:login', (username) => {
    console.log(`User logged in: ${username}`)
})
```

### Type-Safe Event Data

Use complex types for event payloads:

```typescript
interface User {
    id: number
    name: string
}

interface Events {
    userCreated: (user: User) => void
    userUpdated: (user: User, changes: Partial<User>) => void
    userDeleted: (userId: number) => void
}

class UserService extends EventEmitter<Events> {
    constructor() {
        super()
        EventEmitter.super(this)
    }

    createUser(name: string): User {
        const user = { id: Date.now(), name }
        this.emit('userCreated', user)
        return user
    }
}
```

## Best Practices

### 1. Always Define Event Interface

```typescript
// ✅ Good - type-safe events
interface Events {
    click: (x: number, y: number) => void
}
class Button extends EventEmitter<Events> {}

// ❌ Bad - no type safety
class Button extends EventEmitter<any> {}
```

### 2. Call EventEmitter.super() in Constructor

```typescript
// ✅ Good
class MyEmitter extends EventEmitter<Events> {
    constructor() {
        super()
        EventEmitter.super(this) // Required!
    }
}

// ❌ Bad - will cause runtime errors
class MyEmitter extends EventEmitter<Events> {
    constructor() {
        super()
        // Missing EventEmitter.super(this)
    }
}
```

### 3. Keep Event Names Consistent

```typescript
// ✅ Good - consistent naming
interface Events {
    start: () => void
    stop: () => void
    update: (value: number) => void
}

// ❌ Bad - inconsistent
interface Events {
    onStart: () => void
    handleStop: () => void
    updatedValue: (value: number) => void
}
```

### 4. Use Method Chaining

```typescript
// ✅ Good - clean and readable
emitter
    .on('start', handleStart)
    .on('stop', handleStop)
    .emit('start')

// ❌ Bad - verbose
emitter.on('start', handleStart)
emitter.on('stop', handleStop)
emitter.emit('start')
```

## TypeScript Integration

EventEmitter provides full TypeScript support:

```typescript
interface Events {
    save: (filename: string, size: number) => void
}

const emitter = new EventEmitter<Events>()

// ✅ TypeScript validates event names
emitter.on('save', () => {}) // OK
emitter.on('invalid', () => {}) // ❌ Error!

// ✅ TypeScript validates callback signatures
emitter.on('save', (filename, size) => {
    // filename: string
    // size: number
})

emitter.on('save', (wrong: number) => {}) // ❌ Error!

// ✅ TypeScript validates emit arguments
emitter.emit('save', 'file.txt', 1024) // OK
emitter.emit('save', 123, 'wrong') // ❌ Error!
```

## Performance

- Lightweight: ~50 lines of code
- Fast: Direct array iteration for listeners
- Memory efficient: Only stores active listeners
- No overhead: Type checking happens at compile time

## See Also

- [hooks](../hooks/) - Event middleware system
- [reaction](../define/reaction.ts) - Reactive dependency tracking
