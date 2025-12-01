# behavior

Reactive programming primitives for animation loops, behaviors, and state machines.

## Installation

```bash
npm install @sky-modules/behavior
```

## Features

- **FrameLoop** - Synchronized animation frame management with requestAnimationFrame
- **motion** - Animation primitives from the Motion library
- **useMachine** - Finite state machine integration for Mitosis components (robot3)
- **Behavior** - Reactive behavior system with namespace support

## Usage

### Animation Frame Loop

The `FrameLoop` class provides centralized animation loop management with automatic lifecycle control:

```typescript
import { frameLoop, onFrame } from '@sky-modules/behavior'

// Subscribe to frame updates
const unsubscribe = onFrame((deltaTime, totalTime) => {
  console.log(`Delta: ${deltaTime}s, Total: ${totalTime}s`)
  updateAnimation(deltaTime)
})

// Clean up when done
unsubscribe()
```

**Features:**
- Automatic start/stop based on subscribers
- Accurate delta time and total elapsed time
- Error handling for callbacks
- Global singleton instance

**Advanced usage:**

```typescript
import FrameLoop from '@sky-modules/behavior/FrameLoop'

// Create custom loop instance
const customLoop = new FrameLoop()

customLoop.subscribe((dt, total) => {
  // Custom animation logic
})

customLoop.start()  // Manually control
customLoop.stop()
```

### State Machines with useMachine

Cross-framework state machine hook using robot3:

```typescript
import { useMachine } from '@sky-modules/behavior/useMachine'
import { createMachine, state, transition } from 'robot3'

const toggleMachine = createMachine({
  inactive: state(
    transition('toggle', 'active')
  ),
  active: state(
    transition('toggle', 'inactive')
  )
})

function ToggleComponent() {
  const [service, send] = useMachine(toggleMachine)

  return (
    <button onClick={() => send('toggle')}>
      {service.machine.current}
    </button>
  )
}
```

**Complex state machine example:**

```typescript
const trafficLightMachine = createMachine({
  red: state(
    transition('next', 'green')
  ),
  green: state(
    transition('next', 'yellow')
  ),
  yellow: state(
    transition('next', 'red')
  )
})

function TrafficLight() {
  const [service, send] = useMachine(trafficLightMachine)

  useEffect(() => {
    const timer = setInterval(() => send('next'), 3000)
    return () => clearInterval(timer)
  }, [])

  return <div className={`light ${service.machine.current}`} />
}
```

### Motion Library

The behavior module re-exports the Motion library for animation primitives:

```typescript
import { motion } from '@sky-modules/behavior'

// Use Motion animation utilities
// (Documentation depends on Motion library API)
```

### Behavior Namespace

TypeScript namespace for reactive behavior patterns:

```typescript
import '@sky-modules/behavior/Behavior/global'

// Access global Behavior namespace
// Provides SlotRootProps interface for behavior controllers
```

## API

### FrameLoop

**Class:** `FrameLoop`

Animation loop manager synchronized with requestAnimationFrame.

**Methods:**
- `start(): void` - Starts the animation loop
- `stop(): void` - Stops the animation loop
- `subscribe(callback: (deltaTime, totalTime) => void): () => void` - Adds callback, returns unsubscribe function
- `unsubscribe(callback): void` - Removes callback

**Instance:**
- `frameLoop` - Global singleton instance

**Function:**
- `onFrame(callback): () => void` - Convenience function wrapping frameLoop.subscribe()
- `onFrame.unsubscribe(callback): void` - Direct unsubscribe method

### useMachine

**Function:** `useMachine<T>(machine: Machine<T>): [Service<T>, SendFunction]`

Mitosis hook for robot3 state machines.

**Returns:**
- `[0]` - Current machine service (contains state)
- `[1]` - Send function to dispatch events

**Compiles to:**
- React, Vue, Solid, Svelte, Qwik, Angular

## Files

### FrameLoop.ts

**Purpose:** Animation frame loop management

**Key exports:**
- `FrameLoop` - Class managing animation callbacks
- `frameLoop` - Global singleton instance
- `onFrame()` - Subscribe to frame updates

### motion.ts

**Purpose:** Motion library re-export

**Key exports:**
- `* from 'motion'` - All Motion library exports

### useMachine/useMachine.lite.ts

**Purpose:** State machine hook for Mitosis components

**Key exports:**
- `useMachine()` - Hook for robot3 integration

### Behavior/Behavior.namespace.ts

**Purpose:** TypeScript namespace for behavior patterns

**Key exports:**
- `Behavior` namespace - Global namespace with SlotRootProps interface

## Related Modules

- [@sky-modules/features/effect](../features/effect/) - Effect system for reactive behaviors
- [@sky-modules/helpers/Loop](../helpers/Loop/) - Asynchronous interval loops
- [@sky-modules/utilities/Timer](../utilities/Timer/) - Time measurement utilities

## Implementation Notes

### Frame Timing

- Delta time is calculated in seconds (converted from milliseconds)
- Total time tracks elapsed time since loop start
- Uses `performance.now()` for high-resolution timing
- Loop stops automatically when no subscribers remain

### State Machine Integration

- Works with robot3 finite state machines
- Automatically re-renders on state changes via Mitosis useState
- Type-safe event dispatching with TypeScript generics
- Supports all robot3 features (guards, immediate transitions, etc.)

### Performance Considerations

- FrameLoop uses a Set for O(1) callback management
- Error handling prevents one failing callback from stopping the loop
- Callbacks are executed synchronously in subscription order
- Consider debouncing expensive operations in frame callbacks

### Best Practices

1. **Always unsubscribe** - Prevent memory leaks by calling the unsubscribe function
2. **Minimize frame work** - Keep frame callbacks lightweight for smooth 60fps
3. **Use delta time** - Scale animations by deltaTime for frame-rate independence
4. **State machines for UI** - Use useMachine for complex component states
5. **Singleton pattern** - Use global `frameLoop` for app-wide animations

### Globalify Pattern

Several exports use the globalify pattern:
- `Behavior` namespace becomes globally accessible
- Enables consistent API across the framework
- Import global variants via `/global` paths

## Examples

### Game Loop

```typescript
import { onFrame } from '@sky-modules/behavior'
import { Effect, EffectTree } from '@sky-modules/features/effect'

class Game {
  readonly effect: Effect
  private entities: Entity[] = []

  constructor(root: EffectTree) {
    this.effect = new Effect(root, this)

    // Game update loop
    onFrame((dt, total) => {
      this.update(dt)
      this.render()
    })
  }

  update(dt: number) {
    this.entities.forEach(entity => entity.update(dt))
  }

  render() {
    this.entities.forEach(entity => entity.render())
  }
}
```

### Multi-step Wizard

```typescript
import { useMachine } from '@sky-modules/behavior/useMachine'
import { createMachine, state, transition, guard } from 'robot3'

const wizardMachine = createMachine({
  personal: state(
    transition('next', 'contact',
      guard((ctx) => validatePersonalInfo(ctx))
    )
  ),
  contact: state(
    transition('next', 'review'),
    transition('back', 'personal')
  ),
  review: state(
    transition('submit', 'complete'),
    transition('back', 'contact')
  ),
  complete: state()
})

function WizardForm() {
  const [service, send] = useMachine(wizardMachine)
  const currentStep = service.machine.current

  return (
    <div>
      {currentStep === 'personal' && <PersonalInfoStep />}
      {currentStep === 'contact' && <ContactInfoStep />}
      {currentStep === 'review' && <ReviewStep />}
      {currentStep === 'complete' && <SuccessMessage />}

      <button onClick={() => send('back')}>Back</button>
      <button onClick={() => send('next')}>Next</button>
    </div>
  )
}
```

### Animation Controller

```typescript
import { frameLoop } from '@sky-modules/behavior'

class AnimationController {
  private animations = new Map<string, Animation>()
  private unsubscribe: (() => void) | null = null

  start() {
    this.unsubscribe = frameLoop.subscribe((dt) => {
      this.animations.forEach(anim => anim.update(dt))
    })
  }

  stop() {
    this.unsubscribe?.()
    this.unsubscribe = null
  }

  addAnimation(name: string, animation: Animation) {
    this.animations.set(name, animation)
  }

  removeAnimation(name: string) {
    this.animations.delete(name)
  }
}
```
