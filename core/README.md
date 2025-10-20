# @sky-modules/core

**Distributed Reactive Runtime** - A powerful TypeScript framework for building real-time, distributed applications with automatic state synchronization.

## 🌟 What is Sky Core?

Sky Core is not just a utility library - it's a complete runtime system that combines:

- **Reactive Programming** (like MobX) - automatic dependency tracking
- **Network Synchronization** (like Colyseus) - efficient state sharing
- **Schema System** (like Zod) - typed data structures with reactivity
- **Serialization** - preserve class instances across network/disk

All in one seamless framework with **zero configuration**.

## 🎯 Use Cases

Perfect for building:

- 🎮 **Multiplayer games** - sync player state in real-time
- 📝 **Collaborative editors** - like Figma, Google Docs
- 💬 **Real-time chat** - with presence and state
- 📊 **Live dashboards** - automatic updates
- 🔄 **Offline-first apps** - with automatic sync
- 🌐 **Distributed systems** - share state across servers

## 🚀 Quick Start

```typescript
import '@sky-modules/core/define'

// Define a shared class
@define('app.User')
class User {
    @string name
    @number x = 0
    @number y = 0

    move(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }
}

// Create an instance
const user = new User()
user.name = 'Anna'

// Share it over the network
share(user, (updates, pretty) => {
    // Send updates to other clients
    websocket.send(updates)

    console.log('Changed:', pretty.set)
    // Changed: [['app.User', 123, { x: 10, y: 20 }]]
})

// Changes are automatically tracked
user.move(10, 20) // Updates sent automatically!
```

## 🏗️ Architecture

Sky Core provides three levels of reactivity:

### 1. Local Reactivity (like MobX)

Automatic dependency tracking and re-execution:

```typescript
@define('app.Counter')
class Counter {
    @number count = 0

    increment() {
        this.count++
    }
}

const counter = new Counter()

// Automatically tracks dependencies
reaction(() => {
    console.log('Count:', counter.count)
})

counter.increment() // Console: "Count: 1"
counter.increment() // Console: "Count: 2"
```

### 2. Network Synchronization

Efficient state sharing across network:

```typescript
// Server
const gameState = new GameState()

share(gameState, (updates) => {
    // Broadcast only changes (not entire state!)
    clients.forEach(client => {
        client.send(updates)
    })
})

// Client
websocket.on('message', (updates) => {
    // Apply updates from server
    apply(localGameState, updates)
})
```

**Updates are optimized:**
```typescript
// Instead of sending entire object (100+ KB):
{ player: { x: 100, y: 200, health: 80, ... } }

// Send only what changed (< 1 KB):
[[UPDATE_TYPE.SET, [[playerId, [[0, 100], [1, 200]]]]]]
```

### 3. Persistence

Serialize objects with class metadata:

```typescript
// Save to disk/database
const json = save(user)
// {
//   __class: 'app.User',
//   __id: 123,
//   name: 'Anna',
//   x: 10,
//   y: 20
// }

// Load from disk/database
const restored = load(json)
// Automatically restores User class instance!
restored instanceof User // true
restored.move(5, 5) // Works!
```

## 📦 Core Modules

### Public API

- **Array** - Useful array extensions (`last()`, `remove()`, `shuffle()`)
- **bind** - Automatic method binding decorator
- **mergeNamespace** - Merge object namespaces
- **not** - Type-safe null/undefined checks

### Runtime System

- **define** - Class registry for serialization
- **plain/schema** - Typed reactive data structures
- **share/observe** - Network synchronization
- **reaction** - Dependency tracking
- **hooks** - Event middleware system
- **EventEmitter** - Type-safe events
- **globalify** - Global namespace management

## 🎮 Example: Multiplayer Game

```typescript
@define('game.Player')
class Player {
    @string name
    @number x = 0
    @number y = 0
    @number health = 100

    move(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }

    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - amount)
    }
}

@define('game.GameState')
class GameState {
    @array(Player) players = []

    addPlayer(name: string): Player {
        const player = new Player()
        player.name = name
        this.players.push(player)
        return player
    }
}

// Server
const game = new GameState()

share(game, (updates, pretty) => {
    // Broadcast to all clients
    io.emit('game:update', updates)

    // Log for debugging
    console.log('Game updated:', pretty)
})

// Client joins
const player = game.addPlayer('Anna')
// Automatically synced to all clients!

// Player moves
player.move(10, 20)
// Only movement data sent, not entire player object
```

## 📝 Example: Real-time Collaboration

```typescript
@define('doc.TextDocument')
class TextDocument {
    @string title = ''
    @string content = ''
    @array(User) collaborators = []

    updateContent(newContent: string) {
        this.content = newContent
    }
}

// Share document
const doc = new TextDocument()
doc.title = 'My Document'

share(doc, (updates) => {
    // Send to all collaborators
    doc.collaborators.forEach(user => {
        sendToUser(user, updates)
    })
})

// User types
doc.updateContent('Hello, world!')
// Only content change sent to other users
```

## 🔧 Schema System

Define typed, reactive data structures:

```typescript
// Simple types
@string name
@number age
@boolean active

// Optional types
@optional.string nickname
@optional.number score

// Nullable types
@nullable.string avatar

// Objects
@object(Address) address
@array(Friend) friends

// Functions
@func onUpdate
```

Custom schemas:

```typescript
const AddressSchema = {
    street: string,
    city: string,
    country: string
}

@define('app.User')
class User {
    @string name
    @object(AddressSchema) address
}

// Type-safe!
const user = new User()
user.address = {
    street: '123 Main St',
    city: 'Moscow',
    country: 'Russia'
}
```

## 🔍 How It Works

### Define System

Every class/function is registered in a global registry:

```typescript
@define('app.MyClass')
class MyClass { }

// Internally stores:
{
    'app.MyClass': {
        name: 'app.MyClass',
        value: MyClass,
        [idSymbol]: 1,
        [uidSymbol]: 'app.MyClass',
        [typeSymbol]: 'class'
    }
}
```

This enables:
- Serialization with class metadata
- Hot module replacement
- Network synchronization
- Debugging and introspection

### Reactive Properties

When you use decorators like `@string`, `@number`, they create getters/setters that:

1. Track reads (for `reaction()`)
2. Track writes (for `share()`)
3. Batch updates efficiently
4. Observe nested objects

```typescript
// This:
@number count

// Becomes:
get count() {
    // Track dependency if inside reaction()
    return this._count
}
set count(value) {
    // Notify share() listeners
    // Queue update to network
    this._count = value
}
```

### Update Protocol

Changes are encoded efficiently:

```typescript
UpdateOfShared.Type.SET: [
    objectId,           // Which object changed
    [
        [propertyIndex, newValue],  // Which properties changed
        [propertyIndex, newValue],
    ]
]
```

Example:
```typescript
// Change: player.x = 100, player.y = 200
// Encoded as:
[UPDATE_TYPE.SET, [[playerId, [[0, 100], [1, 200]]]]]
// ~20 bytes instead of ~100+ bytes
```

## 🎓 Best Practices

### 1. Always use @define for shared classes

```typescript
// ✅ Good
@define('app.User')
class User { }

// ❌ Bad - can't serialize
class User { }
```

### 2. Use typed decorators

```typescript
// ✅ Good - type-safe and reactive
@string name
@number age

// ❌ Bad - no reactivity
name: string = ''
age: number = 0
```

### 3. Batch updates when possible

```typescript
// ✅ Good - single update
function movePlayer(dx: number, dy: number) {
    player.x += dx
    player.y += dy
} // One network update

// ❌ Bad - two updates
player.x += dx  // Network update
player.y += dy  // Another network update
```

### 4. Use namespaces for organization

```typescript
@define('game.entities.Player')
@define('game.entities.Enemy')
@define('game.systems.Physics')
```

## 📚 API Reference

See individual module documentation:

- [Array](./Array/Array.md) - Array extensions
- [bind](./bind/bind.md) - Method binding decorator
- [mergeNamespace](./mergeNamespace/mergeNamespace.md) - Namespace merging
- [not](./not/not.md) - Null/undefined utilities

## 🔜 Roadmap

- [ ] DevTools Chrome extension
- [ ] React hooks integration
- [ ] Conflict resolution for offline sync
- [ ] Optimistic updates
- [ ] Time-travel debugging
- [ ] Performance profiling tools

## 📄 License

MIT

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

---

**Made with ❤️ for building real-time, distributed applications**
