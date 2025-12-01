# ECS (Entity-Component-System)

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  ecs utility module
</div>

Data-oriented architecture pattern for building scalable games and simulations. Separates data (Components) from behavior (Systems) for optimal performance and flexibility.

## Overview

Entity-Component-System (ECS) is an architectural pattern that:

- **Entities** are unique identifiers that group components together
- **Components** are pure data containers with no logic
- **Systems** contain logic that operates on entities with specific component combinations

This separation enables:
- High performance through cache-friendly data iteration
- Flexible composition without deep inheritance hierarchies
- Easy addition/removal of features at runtime
- Clear separation of concerns

## Installation

```bash
npm install @sky-modules/features
```

Import global ECS classes:

```typescript
import '@sky-modules/features/ecs/global'
```

## Core Concepts

### Entity

Container for components. Entities have no behavior themselves - they just hold components.

```typescript
class Entity {
    readonly effect: Effect

    constructor(dep: EffectDep)
    has(name: string): boolean
    delete(name: string): this
}
```

**Key Features:**
- Lazy component initialization (components created on first access)
- Automatic system registration when components are added
- Automatic system deregistration when components are removed
- Integrated with Effect system for lifecycle management

### Component

Pure data container attached to entities.

```typescript
class Component {
    entity: Entity

    constructor(entity: Entity)
}
```

**Design Guidelines:**
- Components should only contain data, no behavior
- Keep components small and focused
- Components can reference their owning entity

### System

Logic that operates on entities with specific component combinations.

```typescript
abstract class System {
    entities: Entity[] = []
    static components: string[] = []  // Required components

    run(dt: number): void
    update?(ev: Sky.UpdateEvent): void
    onAddEntity?(entity: Entity): void
    onRemoveEntity?(entity: Entity): void
}
```

**System Lifecycle:**
- Systems automatically receive entities that match their component requirements
- `onAddEntity` called when entity gains all required components
- `onRemoveEntity` called when entity loses a required component
- `update` called every frame by Systems orchestrator

### Systems Orchestrator

Manages all systems and coordinates entity-system registration.

```typescript
class Systems {
    static context = true
    readonly effect: Effect

    constructor(dep: EffectDep)
}
```

## Complete Example: Simple Game

Here's a complete example showing entities, components, and systems working together:

```typescript
import '@sky-modules/features/ecs/global'
import { EffectTree } from '@sky-modules/features/effect'

// ===== Components (Data) =====

class PositionComponent extends Component {
    x: number = 0
    y: number = 0
}

class VelocityComponent extends Component {
    x: number = 0
    y: number = 0
}

class SpriteComponent extends Component {
    texture: string = ''
    width: number = 32
    height: number = 32
}

class HealthComponent extends Component {
    current: number = 100
    max: number = 100
}

class PlayerComponent extends Component {
    score: number = 0
}

// Register components
defineComponent('position', PositionComponent)
defineComponent('velocity', VelocityComponent)
defineComponent('sprite', SpriteComponent)
defineComponent('health', HealthComponent)
defineComponent('player', PlayerComponent)

// ===== Systems (Behavior) =====

// Movement system - updates positions based on velocity
class MovementSystem extends System {
    static components = ['position', 'velocity']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            entity.position.x += entity.velocity.x * ev.dt
            entity.position.y += entity.velocity.y * ev.dt
        })
    }
}

// Render system - draws sprites at positions
class RenderSystem extends System {
    static components = ['position', 'sprite']

    onAddEntity(entity: Entity): void {
        console.log(`Loading texture: ${entity.sprite.texture}`)
    }

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            // Draw sprite at entity.position
            console.log(`Draw ${entity.sprite.texture} at (${entity.position.x}, ${entity.position.y})`)
        })
    }

    onRemoveEntity(entity: Entity): void {
        console.log(`Unloading texture: ${entity.sprite.texture}`)
    }
}

// Health system - handles entity death
class HealthSystem extends System {
    static components = ['health']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            if (entity.health.current <= 0) {
                console.log('Entity died!')
                entity.effect.dispose()
            }
        })
    }
}

// Player input system - only operates on player entities
class PlayerInputSystem extends System {
    static components = ['player', 'velocity']

    protected onGlobalKeyDown(ev: { code: string }): void {
        // Find player entity
        const player = this.entities[0]
        if (!player) return

        const speed = 200
        switch (ev.code) {
            case 'ArrowLeft':
                player.velocity.x = -speed
                break
            case 'ArrowRight':
                player.velocity.x = speed
                break
            case 'ArrowUp':
                player.velocity.y = -speed
                break
            case 'ArrowDown':
                player.velocity.y = speed
                break
        }
    }

    protected onGlobalKeyUp(ev: { code: string }): void {
        const player = this.entities[0]
        if (!player) return

        switch (ev.code) {
            case 'ArrowLeft':
            case 'ArrowRight':
                player.velocity.x = 0
                break
            case 'ArrowUp':
            case 'ArrowDown':
                player.velocity.y = 0
                break
        }
    }
}

// Register systems
defineSystem('movement', MovementSystem)
defineSystem('render', RenderSystem)
defineSystem('health', HealthSystem)
defineSystem('playerInput', PlayerInputSystem)

// ===== Game Setup =====

// Create effect tree with update loop
const effectTree = new EffectTree()
    .registerUpdateEvents({})
    .registerEmitKeyboardEvents()

// Create and register systems
const systems = new Systems(effectTree)
effectTree.addContext(systems)
effectTree.commit()

// ===== Create Entities =====

// Player entity
const player = new Entity(effectTree)
player.position.x = 400
player.position.y = 300
player.velocity.x = 0
player.velocity.y = 0
player.sprite.texture = 'player.png'
player.health.current = 100
player.player.score = 0
// Player is now in: MovementSystem, RenderSystem, HealthSystem, PlayerInputSystem

// Enemy entity
const enemy = new Entity(effectTree)
enemy.position.x = 100
enemy.position.y = 100
enemy.velocity.x = 50
enemy.velocity.y = 50
enemy.sprite.texture = 'enemy.png'
enemy.health.current = 50
// Enemy is now in: MovementSystem, RenderSystem, HealthSystem

// Static decoration (no health, no velocity)
const tree = new Entity(effectTree)
tree.position.x = 200
tree.position.y = 200
tree.sprite.texture = 'tree.png'
// Tree is only in: RenderSystem
```

## Dynamic Component Manipulation

Components can be added and removed at runtime, with automatic system registration:

```typescript
const entity = new Entity(effectTree)

// Initially only has position
entity.position.x = 100
// Entity registered with systems requiring only 'position'

// Add velocity component
entity.velocity.x = 50
// Entity now also registered with MovementSystem (['position', 'velocity'])

// Remove velocity
entity.delete('velocity')
// Entity removed from MovementSystem, but still in position-only systems

// Check for components
if (entity.has('health')) {
    entity.health.current -= 10
}
```

## System Lifecycle Hooks

Systems can react to entity additions and removals:

```typescript
class ResourceSystem extends System {
    static components = ['sprite', 'position']

    private resources = new Map<Entity, WebGLTexture>()

    onAddEntity(entity: Entity): void {
        // Load resources when entity is added
        const texture = loadTexture(entity.sprite.texture)
        this.resources.set(entity, texture)
        console.log(`Loaded texture for entity`)
    }

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            const texture = this.resources.get(entity)
            // Render with loaded texture
        })
    }

    onRemoveEntity(entity: Entity): void {
        // Clean up resources when entity is removed
        const texture = this.resources.get(entity)
        if (texture) {
            disposeTexture(texture)
            this.resources.delete(entity)
        }
        console.log(`Unloaded texture for entity`)
    }
}
```

## Event Forwarding to Components

Entities automatically forward events to their components:

```typescript
class InputComponent extends Component {
    onGlobalMouseDown(ev: { x: number, y: number }): void {
        console.log(`Mouse clicked at ${ev.x}, ${ev.y}`)
    }

    onUpdate(ev: Sky.UpdateEvent): void {
        console.log(`Update called with dt: ${ev.dt}`)
    }
}

defineComponent('input', InputComponent)

const entity = new Entity(effectTree)
entity.input  // Component receives all events fired on entity
```

## Best Practices

### Component Design

**Do:**
```typescript
// Small, focused components
class PositionComponent extends Component {
    x: number = 0
    y: number = 0
}

class HealthComponent extends Component {
    current: number = 100
    max: number = 100
}
```

**Don't:**
```typescript
// Large, monolithic components
class GameObjectComponent extends Component {
    x: number = 0
    y: number = 0
    health: number = 100
    velocity: number = 0
    sprite: string = ''
    // ... too much data in one component
}
```

### System Design

**Do:**
```typescript
// Systems operate on specific component combinations
class PhysicsSystem extends System {
    static components = ['position', 'velocity', 'collider']

    update(ev: Sky.UpdateEvent): void {
        // Focused physics logic
    }
}
```

**Don't:**
```typescript
// Systems shouldn't check for optional components
class BadSystem extends System {
    static components = ['position']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            // Checking for components defeats the purpose
            if (entity.has('velocity')) {
                // Should be a separate system
            }
        })
    }
}
```

### Entity Composition

**Do:**
```typescript
// Build entities from small components
const enemy = new Entity(effectTree)
enemy.position.x = 100
enemy.velocity.x = 50
enemy.sprite.texture = 'enemy.png'
enemy.ai.state = 'patrol'
enemy.health.current = 50
```

**Don't:**
```typescript
// Creating entity subclasses (loses ECS benefits)
class EnemyEntity extends Entity {
    constructor(dep: EffectDep) {
        super(dep)
        // Hard-coded behavior
    }
}
```

## Performance Considerations

### Cache-Friendly Iteration

Systems iterate over entities linearly, which is cache-friendly:

```typescript
class OptimizedSystem extends System {
    static components = ['position', 'velocity']

    update(ev: Sky.UpdateEvent): void {
        // Linear iteration is fast
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i]
            entity.position.x += entity.velocity.x * ev.dt
            entity.position.y += entity.velocity.y * ev.dt
        }
    }
}
```

### Avoid Entity Lookups

Store references instead of searching:

```typescript
class PlayerSystem extends System {
    static components = ['player']

    private playerEntity?: Entity

    onAddEntity(entity: Entity): void {
        this.playerEntity = entity
    }

    onRemoveEntity(entity: Entity): void {
        if (entity === this.playerEntity) {
            this.playerEntity = undefined
        }
    }

    update(ev: Sky.UpdateEvent): void {
        if (this.playerEntity) {
            // Direct access, no search
            console.log(this.playerEntity.player.score)
        }
    }
}
```

### Component Pooling

For frequently created/destroyed entities, consider pooling:

```typescript
class BulletPoolSystem extends System {
    static components = ['bullet']

    private pool: Entity[] = []

    createBullet(): Entity {
        let bullet = this.pool.pop()
        if (!bullet) {
            bullet = new Entity(effectTree)
            bullet.bullet // Initialize component
        }
        return bullet
    }

    destroyBullet(bullet: Entity): void {
        // Return to pool instead of disposing
        this.pool.push(bullet)
    }
}
```

## When to Use ECS

**Good Use Cases:**
- Games with many similar objects (enemies, bullets, particles)
- Simulations with diverse entity types
- Systems requiring high performance iteration
- Projects benefiting from runtime composition

**Consider Alternatives When:**
- Few entities with complex, unique behavior
- Deep object hierarchies are natural fit
- Performance is not critical
- Team unfamiliar with ECS patterns

## Integration with Effect System

ECS is fully integrated with the Effect system:

```typescript
// Entity lifecycle tied to effect
const entity = new Entity(effectTree)
entity.position.x = 100

// Dispose entity (automatically removes from all systems)
entity.effect.dispose()

// Context-aware entities
effectTree.addContext(gameConfig)
effectTree.commit()

const entity2 = new Entity(effectTree)
entity2.effect.context(GameConfig) // Access shared context
```

## Common Patterns

### Entity Prefabs

Create entity templates:

```typescript
function createEnemy(effectTree: EffectTree, x: number, y: number): Entity {
    const enemy = new Entity(effectTree)
    enemy.position.x = x
    enemy.position.y = y
    enemy.velocity.x = 50
    enemy.sprite.texture = 'enemy.png'
    enemy.health.current = 50
    enemy.ai.state = 'patrol'
    return enemy
}

const enemy1 = createEnemy(effectTree, 100, 100)
const enemy2 = createEnemy(effectTree, 200, 150)
```

### System Communication

Systems can communicate through shared components:

```typescript
// Damage component acts as message
class DamageComponent extends Component {
    amount: number = 0
    source?: Entity
}

defineComponent('damage', DamageComponent)

class CombatSystem extends System {
    static components = ['damage', 'health']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            entity.health.current -= entity.damage.amount
            entity.delete('damage') // Clear message
        })
    }
}
```

### State Machines in Components

```typescript
class AIComponent extends Component {
    state: 'idle' | 'patrol' | 'chase' | 'attack' = 'idle'
    target?: Entity
}

class AISystem extends System {
    static components = ['ai', 'position']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            switch (entity.ai.state) {
                case 'idle':
                    // Idle behavior
                    break
                case 'patrol':
                    // Patrol behavior
                    break
                case 'chase':
                    // Chase behavior
                    break
            }
        })
    }
}
```

## Debugging

Access systems for inspection:

```typescript
// Systems context provides access to all systems
const movementSystem = systems['movement'] as MovementSystem
console.log(`Movement system has ${movementSystem.entities.length} entities`)

// Inspect entity components
const entity = new Entity(effectTree)
entity.position.x = 100
console.log(Object.keys(entity)) // ['position', 'effect']
```

## Related Documentation

- [Effect System](../effect/README.md) - Lifecycle management for entities
- [Main Features Overview](../README.md) - All features subsystems
- API documentation in source files via JSDoc

## Further Reading

- [Data-Oriented Design](https://www.dataorienteddesign.com/dodbook/)
- [ECS Back and Forth](https://skypjack.github.io/2019-02-14-ecs-baf-part-1/)
- [Understanding Component-Entity-Systems](https://www.gamedev.net/articles/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/)
