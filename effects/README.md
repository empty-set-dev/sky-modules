# Effects Module

DOM effects, input controllers, and utility mixins for interactive applications.

## Installation

```bash
npm install @sky-modules/effects
```

## Features

- **Input Controllers**: WASD, Mouse, Camera, Screen edge scrolling
- **DOM Effects**: Timeout, Interval, Event listeners with automatic cleanup
- **Smart Utilities**: Pointer lock management, fullscreen handling
- **Mixins**: Enable/disable and visibility control patterns
- **Effect Lifecycle**: Automatic resource cleanup on disposal

## Quick Start

```typescript
import WasdController2D from '@sky-modules/effects/controllers/WasdController2D'

const controller = new WasdController2D([effect], {
    force: () => playerSpeed,
    onChange: () => console.log('Input changed')
})

const acceleration = controller.acceleration // Normalized 2D vector
```

## Controllers

### WasdController2D

Keyboard controller for 2D movement with WASD keys.

```typescript
const wasd = new WasdController2D([effect], {
    force: () => 100,              // Force multiplier
    direction: () => cameraAngle,  // Direction offset (radians)
    onChange: () => updatePlayer()
})

// Get normalized acceleration vector
const accel = wasd.acceleration
player.velocity.add(accel.multiplyScalar(deltaTime))
```

### MouseController

Tracks mouse position in normalized device coordinates (-1 to 1) for 3D applications.

```typescript
const mouse = new MouseController([effect], {
    onUpdate: () => console.log('Mouse moved')
})

// Get normalized mouse position
console.log(mouse.mouse) // Vector2(-1 to 1, -1 to 1)

// Project to 3D world space
const worldPos = mouse.getCameraProjectionXY({
    camera: perspectiveCamera,
    z: 0 // Project to z=0 plane
})
```

### ThirdPersonCameraController

Orbital camera controller for third-person view with mouse control.

```typescript
const camera = new ThirdPersonCameraController([effect], {
    camera: perspectiveCamera,
    getTarget: () => player.position,
    distance: () => 10,
    z: () => 2, // Look 2 units above target
    minAngle: () => -Math.PI / 4,
    maxAngle: () => Math.PI / 3,
    hasPointerLock: true
})

// Camera automatically follows target and responds to mouse
```

### ScreenMoveController2D

Screen edge scrolling for 2D camera (RTS-style).

```typescript
const camera = new Vector2()
const edgeScroll = new ScreenMoveController2D([effect], { camera })

// Camera scrolls when mouse near edges
edgeScroll.enabled = true // Enable/disable
```

## Smart Utilities

### SmartPointerLock

Automatic pointer lock management with re-locking support.

```typescript
const smartLock = new SmartPointerLock([effect])

// User clicks -> pointer lock requested
// User presses ESC -> unlocked, waits 2s for re-lock
console.log(smartLock.isLocked) // Current state
```

### Timeout

Effect-based timeout with automatic cleanup.

```typescript
new Timeout([effect], () => {
    console.log('Executed after 1 second')
}, (1).seconds)
```

## DOM Effects

Standard DOM effects with automatic cleanup via Effect system.

### Global Effects

```typescript
import '@sky-modules/effects/dom/standard-effects'

// Window event listener
new WindowEventListener('keydown', (ev) => {
    console.log('Key pressed:', ev.key)
}, [effect])

// Document event listener
new DocumentEventListener('click', () => {
    console.log('Document clicked')
}, [effect])

// Animation frame
new AnimationFrame(() => {
    console.log('Next frame')
}, [effect])

// Continuous animation frames
new AnimationFrames(() => {
    render() // Called every frame
}, [effect])

// Interval
new Interval(() => {
    console.log('Every second')
}, (1).seconds, [effect])

// Pointer lock
const pointerLock = new PointerLock([effect])
await pointerLock.whenLocked

// Fullscreen
const fullscreen = new Fullscreen([effect])
await fullscreen.whenRequested
```

### Property Effect

Assign value with automatic cleanup:

```typescript
await property(
    myObject,    // Value to assign
    target,      // Target object
    'key',       // Property key
    [effect]     // Effect dependency
)
```

### Array Effect

Add to array with automatic removal:

```typescript
const items = []
inArray(item, items, [effect])
// Item removed when effect disposed
```

## Mixins

### EnabledMixin

Add enable/disable functionality to any class.

```typescript
import EnabledMixin from '@sky-modules/effects/mixins/EnabledMixin'

@mixin(EnabledMixin)
class MyController {
    readonly effect: Effect

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)
        EnabledMixin.super(this)
    }

    protected onUpdate(ev: Sky.UpdateEvent) {
        // Only called when enabled
    }
}

const controller = new MyController([effect])
controller.enabled = false // Disable event processing
```

### VisibilityMixin

Filter events based on visibility (for renderables).

```typescript
import { VisibilityMixin } from '@sky-modules/effects/mixins/VisibilityMixin'

@mixin(VisibilityMixin)
class MyRenderable {
    readonly effect: Effect

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)
        VisibilityMixin.super(this)
    }

    protected onRender() {
        // Only called when visible
    }

    protected onUpdate(ev: Sky.UpdateEvent) {
        // Always called (update events not filtered)
    }
}

const renderable = new MyRenderable([effect])
renderable.visible = false // Hide (skip render events)
```

## Examples

### Complete Game Input

```typescript
import WasdController2D from '@sky-modules/effects/controllers/WasdController2D'
import MouseController from '@sky-modules/effects/controllers/MouseController'
import SmartPointerLock from '@sky-modules/effects/SmartPointerLock'

class GameInput {
    readonly effect: Effect
    wasd: WasdController2D
    mouse: MouseController
    pointerLock: SmartPointerLock

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)

        this.wasd = new WasdController2D([this.effect])
        this.mouse = new MouseController([this.effect])
        this.pointerLock = new SmartPointerLock([this.effect])
    }

    protected onUpdate(ev: Sky.UpdateEvent) {
        if (this.pointerLock.isLocked) {
            const movement = this.wasd.acceleration
            player.velocity.add(movement.multiplyScalar(ev.dt))
        }
    }
}
```

### RTS Camera Control

```typescript
import ScreenMoveController2D from '@sky-modules/effects/controllers/ScreenMoveController2D'
import MouseController from '@sky-modules/effects/controllers/MouseController'

class RTSCamera {
    readonly effect: Effect
    position = new Vector2()
    edgeScroll: ScreenMoveController2D
    mouse: MouseController

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)

        this.edgeScroll = new ScreenMoveController2D([this.effect], {
            camera: this.position
        })

        this.mouse = new MouseController([this.effect])
    }

    getWorldPosition(): Vector2 {
        return this.mouse.getCameraProjectionXY({
            camera: orthographicCamera,
            z: 0
        })
    }
}
```

## Integration Notes

### Effect System

All controllers and utilities use the Effect system from `@sky-modules/features/effect` for lifecycle management.

### Automatic Cleanup

When an effect is disposed, all associated resources are automatically cleaned up:
- Event listeners removed
- Timeouts/intervals cleared
- Pointer lock released
- Fullscreen exited

### Context Requirements

Some controllers require specific contexts:
- **MouseController**: Requires `Sky.Renderer` context
- **ThirdPersonCameraController**: Uses pointer lock if available

## Related Modules

- **[@sky-modules/features/effect](../features/effect)** - Effect system
- **[@sky-modules/math/Vector2](../math/Vector2)** - 2D vectors
- **[@sky-modules/math/Vector3](../math/Vector3)** - 3D vectors
- **[@sky-modules/utilities/Time](../utilities/Time)** - Time units

## License

MIT
