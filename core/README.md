# @sky-modules/core

Core utilities and runtime for Sky Modules framework - a distributed reactive system for building real-time applications.

## Installation

```bash
npm install @sky-modules/core
```

## What's Included

The core package provides:

- **Reactive Runtime** - Automatic dependency tracking and state synchronization
- **Network Synchronization** - Real-time state sharing across clients
- **Schema System** - Typed data structures with reactivity decorators
- **Serialization** - Preserve class instances across network/storage
- **Utility Functions** - Common helpers for modern TypeScript development

## Key Features

### Distributed Reactivity

Build applications where state automatically synchronizes across multiple clients in real-time - perfect for multiplayer games, collaborative editors, and live dashboards.

### Type-Safe Schemas

Define reactive data structures with decorators:

```typescript
import '@sky-modules/core/define'

@define('app.User')
class User {
    @string name
    @number x = 0
    @number y = 0
}
```

### Automatic Change Tracking

Changes are automatically tracked and can be shared:

```typescript
const user = new User()
user.name = 'Anna'

share(user, (updates) => {
    // Send updates to other clients
    websocket.send(updates)
})

user.x = 10 // Automatically triggers update!
```

## Core Modules

The package includes these sub-modules:

- **env** - Cross-platform environment variable access
- **define** - Schema definition and decorators
- **reaction** - Reactive computations
- **share** - Network synchronization
- **serialize** - Class instance serialization

And many more utility modules for arrays, objects, functions, and async operations.

## Use Cases

Perfect for building:

- 🎮 Multiplayer games with real-time state sync
- 📝 Collaborative editors (like Figma, Google Docs)
- 💬 Real-time chat applications
- 📊 Live dashboards with automatic updates
- 🔄 Offline-first apps with sync
- 🌐 Distributed systems

## Documentation

For complete documentation, examples, and API reference, visit the [full documentation](https://empty-set-dev.github.io/sky-modules).

## Quick Example

```typescript
import '@sky-modules/core/define'

@define('app.Counter')
class Counter {
    @number count = 0

    increment() {
        this.count++
    }
}

const counter = new Counter()

// React to changes
reaction(() => {
    console.log('Count:', counter.count)
})

counter.increment() // Logs: Count: 1
```

## License

ISC License - see the [LICENSE](../../LICENSE) file for details.
