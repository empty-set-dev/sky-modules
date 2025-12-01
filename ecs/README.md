# ECS Physics Module

3D physics component and system for entity-component-system architecture.

## Installation

```bash
npm install @sky-modules/ecs
```

## Features

- **Physics3 Component**: Position, velocity, acceleration tracking
- **Physics3System**: Automatic physics simulation per frame
- **Friction Support**: Both constant and percentage-based friction
- **Vector3 Integration**: Uses `@sky-modules/math/Vector3` for 3D math
- **Delta Time**: Frame-rate independent physics

## Quick Start

```typescript
import '@sky-modules/ecs/Physics3'

// Create entity with physics
const entity = new Entity()
entity.physics3.position.set(0, 0, 0)
entity.physics3.velocity.set(1, 0, 0)
entity.physics3.acceleration.set(0, 0, -9.8) // Gravity

// Set friction
entity.physics3.friction = (5).asMetersPerSecond
entity.physics3.linearFriction = (1).asPercentsPerMillisecond
```

## API Reference

### Physics3 Component

Component for 3D physics simulation on entities.

#### Properties

- **position**: `Vector3` - Current position in 3D space
- **velocity**: `Vector3` - Velocity vector (units per second)
- **acceleration**: `Vector3` - Acceleration vector (units per second squared)
- **friction**: `MetersPerSecond` - Constant friction force opposing motion
- **linearFriction**: `PercentsPerMillisecond` - Percentage-based friction (0-100%)

### Physics3System

System that updates all entities with `physics3` component.

#### Update Process

Each frame, the system:
1. Applies acceleration to velocity: `velocity += acceleration * dt`
2. Applies velocity to position: `position += velocity * dt`
3. Applies constant friction (stops when velocity is small)
4. Applies linear friction (exponential decay)

#### Friction Behavior

**Constant Friction** (`friction`):
- Opposes motion direction
- Stops object when velocity becomes too small
- Units: meters per second

**Linear Friction** (`linearFriction`):
- Percentage-based velocity reduction
- Applied exponentially: `velocity *= (1 - friction/100)^(dt*1000)`
- Units: percent per millisecond

## Examples

### Basic Movement

```typescript
import '@sky-modules/ecs/Physics3'

const entity = new Entity()

// Set initial position and velocity
entity.physics3.position.set(0, 0, 0)
entity.physics3.velocity.set(5, 0, 0)

// Physics system updates automatically
// After 1 second: position = (5, 0, 0)
```

### Gravity Simulation

```typescript
const entity = new Entity()
entity.physics3.position.set(0, 0, 10)
entity.physics3.acceleration.set(0, 0, -9.8) // Earth gravity

// Object falls with constant acceleration
```

### Friction Example

```typescript
const entity = new Entity()
entity.physics3.velocity.set(10, 0, 0)

// Constant friction - slows down linearly
entity.physics3.friction = (2).asMetersPerSecond

// Linear friction - slows down exponentially (1% per ms)
entity.physics3.linearFriction = (1).asPercentsPerMillisecond
```

### Combined Physics

```typescript
const player = new Entity()

// Initial state
player.physics3.position.set(0, 0, 0)
player.physics3.velocity.set(0, 0, 0)

// Apply forces
function applyPlayerInput(direction: Vector3, force: number) {
    player.physics3.acceleration
        .copy(direction)
        .normalize()
        .multiplyScalar(force)
}

// Ground friction
player.physics3.friction = (10).asMetersPerSecond
player.physics3.linearFriction = (0.5).asPercentsPerMillisecond

// Gravity when in air
if (!isGrounded) {
    player.physics3.acceleration.z = -9.8
}
```

## Integration

### With ECS from features/

This module uses the ECS system from `@sky-modules/features/ecs`:

```typescript
import '@sky-modules/features/ecs/global' // Required
import '@sky-modules/ecs/Physics3'

// Component and system are automatically registered
```

### Type Augmentation

The module extends global types:

```typescript
declare global {
    interface Entity {
        physics3: Physics3
    }

    interface Systems {
        Physics3System: Physics3System
    }
}
```

## Related Modules

- **[@sky-modules/math/Vector3](../math/Vector3)** - 3D vector math
- **[@sky-modules/features/ecs](../features/ecs)** - Entity-component-system
- **[@sky-modules/utilities/Time](../utilities/Time)** - Time units

## Performance Notes

- Physics updates run every frame via system update
- Vector3 operations create temporary objects (consider optimization for large entity counts)
- Delta time ensures consistent physics regardless of frame rate

## License

MIT
