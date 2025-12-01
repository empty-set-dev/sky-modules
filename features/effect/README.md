# Effect System

Hierarchical lifecycle and dependency management system with automatic cleanup. Build complex application structures where parent disposal automatically cleans up all children.

## Overview

The Effect system provides:

- **Hierarchical Effects** - Parent-child relationships with automatic cleanup propagation
- **Context Injection** - Dependency injection that propagates down the effect tree
- **Dependency Tracking** - Track relationships between effects for coordinated disposal
- **Event-Driven Lifecycle** - Hook into effect lifecycle events throughout the tree
- **Automatic Cleanup** - Disposal functions run automatically in correct order

This enables building complex nested structures (UI components, game objects, resource managers) with confidence that cleanup will happen correctly.

## Installation

```bash
npm install @sky-modules/features
```

```typescript
import { Effect, EffectTree, EffectDep } from '@sky-modules/features/effect'
```

## Core Concepts

### EffectTree

The root of an effect hierarchy. Only EffectTree can exist without a parent.

```typescript
class EffectTree extends EffectBase {
    // Input state tracking
    isLeftMousePressed: boolean
    isMiddleMousePressed: boolean
    isRightMousePressed: boolean
    isPressed: Record<string, boolean>
    gamepadStates: Record<number, Gamepad>

    // Setup methods
    registerUpdateEvents(options): this
    registerMouseEvents(options): this
    registerEmitKeyboardEvents(before?, after?): this
    registerGamepadEvents(options?): this
    registerRenderEvents(options): this
    registerEmitWindowResize(options): this

    // Lifecycle coordination
    commit(): void
}
```

**Key Features:**
- Serves as the root dependency for all child effects
- Manages global input state (mouse, keyboard, gamepad)
- Coordinates update/render loops via registered events
- Batches structural changes via commit()

### Effect

A node in the effect tree with optional cleanup callback.

```typescript
class Effect extends EffectBase {
    readonly root: EffectTree

    constructor(dep: EffectDep, host?: object)
    constructor(
        callback: () => () => Promise<void> | void,
        dep: EffectDep,
        host?: object
    )

    addParent(parent: EffectBase): this
    removeParent(parent: EffectBase): this
    isChildOf(parent: EffectBase): boolean

    addDep(dep: EffectDep): this
    removeDep(dep: EffectDep): this

    context<T>(Context: ContextConstructor): T | undefined
    addContext(context: object): this
}
```

**Key Features:**
- Can have multiple parents (multiple ownership)
- Optional callback returns cleanup function
- Access contexts from parent effects
- Automatic disposal when last parent is removed

### EffectDep

Type defining valid effect dependencies:

```typescript
type EffectDep = EffectBase | [EffectBase, ContextConstructor]
```

Dependencies can be:
- Simple parent effect
- Context-aware dependency `[parent, ContextClass]`

### ContextConstructor

Type for classes that can be used as contexts:

```typescript
type ContextConstructor = {
    new (...args: any[]): any
    context: true
}
```

Classes must have `static context = true` to be injectable.

## Quick Start

### Basic Effect with Cleanup

```typescript
import { EffectTree, Effect } from '@sky-modules/features/effect'

// Create root
const root = new EffectTree()

// Effect with cleanup
const effect = new Effect(() => {
    console.log('Effect started')

    const timer = setInterval(() => {
        console.log('Tick')
    }, 1000)

    // Return cleanup function
    return () => {
        clearInterval(timer)
        console.log('Effect cleaned up')
    }
}, root)

// Dispose (cleanup runs automatically)
await effect.dispose()
// Output:
// Effect started
// Tick
// Tick
// Effect cleaned up
```

### Parent-Child Hierarchy

```typescript
const root = new EffectTree()

// Parent effect
const parent = new Effect(() => {
    console.log('Parent initialized')
    return () => console.log('Parent disposed')
}, root)

// Child effects
const child1 = new Effect(() => {
    console.log('Child 1 initialized')
    return () => console.log('Child 1 disposed')
}, parent)

const child2 = new Effect(() => {
    console.log('Child 2 initialized')
    return () => console.log('Child 2 disposed')
}, parent)

// Dispose parent (children disposed automatically)
await parent.dispose()
// Output:
// Child 1 disposed
// Child 2 disposed
// Parent disposed
```

## Context Injection

Share state down the effect tree:

```typescript
// Define context class
class AppConfig {
    static context = true
    apiUrl: string = 'https://api.example.com'
    debugMode: boolean = false
}

class UserSession {
    static context = true
    userId: string = ''
    token: string = ''
}

// Create root and add contexts
const root = new EffectTree()
root.addContext(new AppConfig())
root.addContext(new UserSession())
root.commit()

// Access context in effects
const apiClient = new Effect(root, {
    onAppConfigContext(config: AppConfig) {
        console.log(`API URL: ${config.apiUrl}`)
    },

    onUserSessionContext(session: UserSession) {
        console.log(`User: ${session.userId}`)
    }
})

// Or access directly
const effect = new Effect(root)
const config = effect.context(AppConfig)
console.log(config?.apiUrl)
```

## Effect with Host Object

Effects can forward lifecycle events to a host object:

```typescript
class Component {
    effect: Effect

    constructor(parent: EffectDep) {
        // Pass `this` as host
        this.effect = new Effect(parent, this)
    }

    // Lifecycle hooks
    onUpdate(ev: Sky.UpdateEvent): void {
        console.log(`Update: ${ev.dt}`)
    }

    onGlobalMouseDown(ev: { x: number, y: number }): void {
        console.log(`Mouse: ${ev.x}, ${ev.y}`)
    }
}

const root = new EffectTree().registerUpdateEvents({})
const component = new Component(root)
// Component receives update and mouse events
```

## Context-Aware Dependencies

Create effects that depend on specific contexts:

```typescript
class DatabaseContext {
    static context = true
    connection: Connection
}

const root = new EffectTree()
const db = new DatabaseContext()
root.addContext(db)
root.commit()

// Effect depends on database context
const query = new Effect([root, DatabaseContext], {
    onDatabaseContextContext(db: DatabaseContext) {
        console.log('Database available')

        // Setup that needs database
        const subscription = db.connection.subscribe(data => {
            console.log('Data:', data)
        })

        // Return cleanup
        return () => {
            subscription.unsubscribe()
        }
    }
})
```

## Complete Example: Game Scene

```typescript
import { EffectTree, Effect } from '@sky-modules/features/effect'

// Contexts
class GameConfig {
    static context = true
    gravity: number = 9.8
    soundEnabled: boolean = true
}

class AssetManager {
    static context = true
    private assets = new Map<string, any>()

    load(name: string, asset: any): void {
        this.assets.set(name, asset)
    }

    get(name: string): any {
        return this.assets.get(name)
    }
}

// Create root effect tree
const root = new EffectTree()
    .registerUpdateEvents({})
    .registerMouseEvents({})

// Add contexts
const config = new GameConfig()
const assets = new AssetManager()
root.addContext(config)
root.addContext(assets)
root.commit()

// Scene effect
const scene = new Effect(() => {
    console.log('Scene loaded')
    return () => console.log('Scene unloaded')
}, root)

// Camera effect (child of scene)
class Camera {
    effect: Effect
    x: number = 0
    y: number = 0

    constructor(parent: EffectDep) {
        this.effect = new Effect(() => {
            console.log('Camera created')
            return () => console.log('Camera destroyed')
        }, parent, this)
    }

    onUpdate(ev: Sky.UpdateEvent): void {
        // Camera update logic
    }
}

const camera = new Camera(scene)

// Player effect (child of scene, uses context)
class Player {
    effect: Effect
    sprite: any

    constructor(parent: EffectDep) {
        this.effect = new Effect(parent, this)
    }

    onAssetManagerContext(assets: AssetManager): void {
        // Load player sprite
        this.sprite = assets.get('player')
        console.log('Player sprite loaded')
    }

    onGameConfigContext(config: GameConfig): void {
        console.log(`Gravity: ${config.gravity}`)
    }

    onUpdate(ev: Sky.UpdateEvent): void {
        // Player update logic
    }

    onGlobalMouseDown(ev: { x: number, y: number }): void {
        console.log(`Player sees click at ${ev.x}, ${ev.y}`)
    }
}

const player = new Player(scene)

// Enemy effect (child of scene)
const enemy = new Effect(() => {
    console.log('Enemy spawned')

    const ai = setInterval(() => {
        console.log('Enemy AI thinking...')
    }, 1000)

    return () => {
        clearInterval(ai)
        console.log('Enemy destroyed')
    }
}, scene)

// Dispose entire scene (cleans up everything)
await scene.dispose()
// Output:
// Enemy destroyed
// Player sprite unloaded
// Camera destroyed
// Scene unloaded
```

## Deferred Operations with commit()

Structural changes (add/remove parents, dependencies, contexts) are deferred until commit():

```typescript
const root = new EffectTree()

const parent = new Effect(root)
const child = new Effect(parent)

// Queue context addition
root.addContext(new MyContext())
// Context not yet available

// Process all queued operations
root.commit()
// Now context is available in all effects
```

**Why deferred?**
- Batch operations for efficiency
- Ensure consistent state during updates
- Prevent issues from mid-update structure changes

## Multiple Parents

Effects can have multiple parents (multiple ownership):

```typescript
const root = new EffectTree()

const system1 = new Effect(root)
const system2 = new Effect(root)

// Effect owned by both systems
const shared = new Effect(system1)
shared.addParent(system2)
root.commit()

// Dispose one parent - effect continues
await system1.dispose()
console.log(shared.disposed) // false

// Dispose last parent - effect disposed
await system2.dispose()
console.log(shared.disposed) // true
```

## Effect Iterators

Traverse effect trees:

```typescript
import { childrenIterator, parentsIterator } from '@sky-modules/features/effect'

const root = new EffectTree()
const parent = new Effect(root)
const child1 = new Effect(parent)
const child2 = new Effect(parent)

// Iterate children
for (const child of childrenIterator(parent)) {
    console.log('Child:', child)
}

// Iterate parents
for (const p of parentsIterator(child1)) {
    console.log('Parent:', p)
}
```

## Lifecycle Hooks

Effects can implement lifecycle hooks via host objects:

```typescript
class GameObject {
    effect: Effect

    constructor(parent: EffectDep) {
        this.effect = new Effect(parent, this)
    }

    // Called when context becomes available
    onMyContextContext(ctx: MyContext): Destructor | void {
        console.log('Context available')
        return () => console.log('Context removed')
    }

    // Update loop
    onUpdate(ev: Sky.UpdateEvent): void {
        console.log('Update')
    }

    // Animation frame
    onAnimationFrame(ev: Sky.UpdateEvent): void {
        console.log('Render')
    }

    // Mouse events
    onGlobalMouseDown(ev: { x: number, y: number }): void {
        console.log('Mouse down')
    }

    onGlobalMouseMove(ev: { x: number, y: number }): void {
        console.log('Mouse move')
    }

    // Keyboard events
    onGlobalKeyDown(ev: { code: string }): void {
        console.log('Key down:', ev.code)
    }

    // Gamepad events
    onGamepadButtonDown(ev: { gamepadIndex: number, buttonIndex: number }): void {
        console.log('Button pressed')
    }
}
```

## Best Practices

### Use Effects for Resource Management

```typescript
class ImageLoader {
    effect: Effect
    private image?: HTMLImageElement

    constructor(parent: EffectDep, url: string) {
        this.effect = new Effect(() => {
            // Acquire resource
            this.image = new Image()
            this.image.src = url

            // Return cleanup
            return () => {
                this.image = undefined
                console.log('Image unloaded')
            }
        }, parent, this)
    }
}
```

### Context for Dependency Injection

```typescript
// Instead of passing dependencies manually
class BadComponent {
    constructor(
        parent: EffectDep,
        api: ApiClient,
        config: Config,
        assets: AssetManager
    ) {
        // Too many parameters
    }
}

// Use context injection
class GoodComponent {
    effect: Effect

    constructor(parent: EffectDep) {
        this.effect = new Effect(parent, this)
    }

    onApiClientContext(api: ApiClient): void {
        // Use api
    }

    onConfigContext(config: Config): void {
        // Use config
    }

    onAssetManagerContext(assets: AssetManager): void {
        // Use assets
    }
}
```

### Dispose Explicitly

```typescript
// Always await dispose for async cleanup
await effect.dispose()

// Or use fire() for fire-and-forget
import { fire } from '@sky-modules/core/async'
fire(effect.dispose())
```

## Performance Considerations

### Batching with commit()

```typescript
// Bad: Multiple commits
root.addContext(context1)
root.commit()
root.addContext(context2)
root.commit()
root.addContext(context3)
root.commit()

// Good: Single commit
root.addContext(context1)
root.addContext(context2)
root.addContext(context3)
root.commit()
```

### Minimize Effect Depth

Deep hierarchies can impact performance:

```typescript
// Prefer flatter structures
const scene = new Effect(root)
const obj1 = new Effect(scene)
const obj2 = new Effect(scene)
const obj3 = new Effect(scene)

// Over deeply nested
const a = new Effect(root)
const b = new Effect(a)
const c = new Effect(b)
const d = new Effect(c) // Too deep
```

## Integration with ECS

Effects power the ECS system:

```typescript
import '@sky-modules/features/ecs/global'
import { EffectTree } from '@sky-modules/features/effect'

const root = new EffectTree().registerUpdateEvents({})

// Systems use effect tree
const systems = new Systems(root)
root.addContext(systems)
root.commit()

// Entities are effects
const entity = new Entity(root)
entity.effect.dispose() // Remove entity from all systems
```

## Debugging

```typescript
// Check if disposed
console.log(effect.disposed)

// Check if it's an effect
console.log(effect.isEffect) // true

// Access root
console.log(effect.root === effectTree) // true

// Check context availability
const hasContext = effect.hasContext(MyContext)
```

## Common Patterns

### Component Pattern

```typescript
class Component {
    effect: Effect

    constructor(parent: EffectDep) {
        this.effect = new Effect(parent, this)
    }

    onUpdate(ev: Sky.UpdateEvent): void {
        // Component logic
    }
}

const root = new EffectTree().registerUpdateEvents({})
const comp = new Component(root)
```

### Service Pattern

```typescript
class Service {
    static context = true
    effect: Effect

    constructor(parent: EffectDep) {
        this.effect = new Effect(parent, this)
    }

    doSomething(): void {
        // Service logic
    }
}

const root = new EffectTree()
const service = new Service(root)
root.addContext(service)
root.commit()

// Other effects can access service
const client = new Effect(root, {
    onServiceContext(service: Service) {
        service.doSomething()
    }
})
```

## Related Documentation

- [ECS System](../ecs/README.md) - Uses Effect for entity lifecycle
- [Main Features Overview](../README.md) - All features subsystems
- API documentation in source files via JSDoc

## Further Reading

- [React Effect Hook](https://react.dev/reference/react/useEffect) - Similar cleanup pattern
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) - Context pattern inspiration
- [Observer Pattern](https://refactoring.guru/design-patterns/observer) - Event system foundation
