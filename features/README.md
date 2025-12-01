# Features Module

High-level architectural patterns and systems for building complex applications with reactive state management, effect-based lifecycle control, and Entity-Component-System architecture.

## Installation

```bash
npm install @sky-modules/features
```

## Overview

The features module provides three complementary subsystems:

- **ECS (Entity-Component-System)** - Data-oriented architecture for game development and complex simulations
- **Effect System** - Hierarchical lifecycle and dependency management with automatic cleanup
- **Reactive System** - Observable state management with automatic change tracking

## Quick Start

### ECS (Entity-Component-System)

Build game entities with composable components and behavior systems:

```typescript
import '@sky-modules/features/ecs/global'

// Define components
class PositionComponent extends Component {
    x: number = 0
    y: number = 0
}

class VelocityComponent extends Component {
    x: number = 0
    y: number = 0
}

defineComponent('position', PositionComponent)
defineComponent('velocity', VelocityComponent)

// Define system
class MovementSystem extends System {
    static components = ['position', 'velocity']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            entity.position.x += entity.velocity.x * ev.dt
            entity.position.y += entity.velocity.y * ev.dt
        })
    }
}

defineSystem('movement', MovementSystem)

// Create world
const effectTree = new EffectTree().registerUpdateEvents({})
const systems = new Systems(effectTree)
effectTree.addContext(systems)
effectTree.commit()

// Create entity
const player = new Entity(effectTree)
player.position.x = 100
player.velocity.x = 50  // Moves 50 units per second
```

### Effect System

Manage hierarchical lifecycles with automatic cleanup:

```typescript
import { Effect, EffectTree } from '@sky-modules/features/effect'

// Create root effect tree
const root = new EffectTree()

// Create child effect with cleanup
const effect = new Effect(() => {
    console.log('Effect initialized')

    const interval = setInterval(() => {
        console.log('Running...')
    }, 1000)

    // Return cleanup function
    return () => {
        clearInterval(interval)
        console.log('Effect cleaned up')
    }
}, root)

// Dispose effect (cleanup runs automatically)
await effect.dispose()
```

### Reactive System

Track state changes with reactive properties:

```typescript
import { reactive, observe } from '@sky-modules/features/reactive'

class Counter {
    @reactive
    count: number = 0
}

const counter = new Counter()

observe(counter, (event) => {
    console.log('State changed:', event.type)
})

counter.count++ // Triggers change event
```

## Subsystems

### [ECS (Entity-Component-System)](./ecs/README.md)

Data-oriented architecture pattern perfect for games and simulations. Entities are containers for components (data), and systems (logic) operate on entities with specific component combinations.

**Key Features:**
- Automatic entity-system registration based on components
- Lazy component initialization
- Dynamic component addition/removal
- System lifecycle hooks (onAddEntity, onRemoveEntity)
- Integrated with Effect system for lifecycle management

**Use Cases:**
- Game development
- Physics simulations
- Complex UI state management
- Data-driven applications

### [Effect System](./effect/README.md)

Hierarchical effect management with automatic dependency tracking and cleanup. Effects form trees where parent disposal automatically cleans up all children.

**Key Features:**
- Parent-child effect hierarchies
- Context injection and propagation
- Automatic cleanup on disposal
- Dependency tracking
- Event-driven lifecycle hooks

**Use Cases:**
- Resource management
- Event listener cleanup
- Async operation coordination
- Nested component lifecycles
- Animation management

### Reactive System

Observable state management that automatically tracks changes to properties and notifies observers.

**Key Features:**
- Decorator-based reactive properties
- Change event observation
- State serialization/deserialization
- Computed reactive values

**Use Cases:**
- UI state synchronization
- Data binding
- Undo/redo systems
- State persistence

## Integration

These subsystems work together seamlessly:

```typescript
import '@sky-modules/features/ecs/global'
import { EffectTree } from '@sky-modules/features/effect'

// Effect system provides lifecycle management for ECS
const effectTree = new EffectTree()
    .registerUpdateEvents({})

// Systems context integrated with effects
const systems = new Systems(effectTree)
effectTree.addContext(systems)
effectTree.commit()

// Entities automatically participate in effect lifecycle
const entity = new Entity(effectTree)

// When entity.effect is disposed, it's automatically removed from all systems
entity.effect.dispose()
```

## Architecture Patterns

### Component-Based Architecture (ECS)

Separate data (components) from behavior (systems):

```typescript
// Data
class HealthComponent extends Component {
    current: number = 100
    max: number = 100
}

// Behavior
class HealthSystem extends System {
    static components = ['health']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            if (entity.health.current <= 0) {
                entity.effect.dispose() // Entity dies
            }
        })
    }
}
```

### Hierarchical Lifecycle Management (Effect)

Build nested structures with automatic cleanup:

```typescript
const scene = new Effect(effectTree)

// Child effects are disposed when parent is disposed
const camera = new Effect(scene)
const lights = new Effect(scene)

// Dispose entire scene hierarchy
scene.dispose() // Automatically disposes camera and lights
```

### Context Propagation (Effect)

Share context down the effect tree:

```typescript
class GameConfig {
    static context = true
    difficulty: 'easy' | 'normal' | 'hard' = 'normal'
}

const config = new GameConfig()
effectTree.addContext(config)

// All child effects can access context
const entity = new Entity(effectTree)
entity.effect.context(GameConfig) // Returns config instance
```

## Performance Considerations

- **ECS**: O(n) iteration over entities in systems, cache-friendly data layout
- **Effect System**: Deferred operations via commit() for batching
- **Reactive**: Lazy evaluation, minimal overhead when not observed

## Related Modules

- `@sky-modules/core` - Core utilities used throughout
- `@sky-modules/math` - Vector and math utilities for game development
- `@sky-modules/platform` - Platform detection and abstractions

## TypeScript Support

Full TypeScript support with generic types:

```typescript
// Type-safe component access
const entity = new Entity(effectTree)
const position: PositionComponent = entity.position

// Type-safe effect dependencies
const effect = new Effect<MyContext>([parent, MyContext])
```

## Documentation

- [ECS Guide](./ecs/README.md) - Comprehensive ECS architecture guide
- [Effect System Guide](./effect/README.md) - Effect lifecycle and patterns
- API documentation available via JSDoc in source files

## License

MIT
