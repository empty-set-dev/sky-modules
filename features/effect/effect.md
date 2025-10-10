# Effect System

A reactive effect system for managing hierarchical lifecycle, event handling, and dependency tracking in applications.

## Overview

The Effect system provides a foundation for reactive programming with automatic cleanup, context propagation, and event handling. It's designed for building scalable applications where components need to manage their lifecycle and dependencies efficiently.

## Core Classes

### `BaseOfEffect`

The abstract base class that provides core functionality for all effects.

**Key Features:**
- Automatic lifecycle management with disposal
- Context system for dependency injection
- Event emission with capturing and bubbling
- Parent-child relationships

**Methods:**
- `dispose(): Promise<void>` - Disposes the effect and all its children
- `addContext(context: any): this` - Adds a context to the effect
- `context<T>(Context: T): InstanceType<T>` - Retrieves a context instance
- `emit(eventName: string, event: object): this` - Emits an event down the hierarchy
- `emitReversed(eventName: string, event: object): this` - Emits an event up the hierarchy

### `Effect`

The main effect class that extends `BaseOfEffect` with dependency management.

**Constructor:**
```typescript
// Simple effect with callback
new Effect(dep: EffectDep, host?: object)

// Effect with callback and cleanup
new Effect(
  callback: () => () => Promise<void> | void,
  dep: EffectDep,
  host?: object
)
```

**Key Features:**
- Parent-child relationships with automatic cleanup
- Dependency tracking and management
- Context propagation and lifecycle management
- Automatic disposal when dependencies are removed

**Methods:**
- `addParent(parent: BaseOfEffect): this` - Adds a parent effect
- `removeParent(parent: BaseOfEffect): this` - Removes a parent effect
- `addDep(dep: EffectDep): this` - Adds a dependency
- `removeDep(dep: EffectDep): this` - Removes a dependency
- `isChildOf(parent: BaseOfEffect): boolean` - Checks parent relationship

### `EffectThree`

The root effect class that manages the entire effect tree and provides global event handling.

**Key Features:**
- Animation frame and timer management
- Mouse, keyboard, and gamepad input handling
- Global event coordination
- Batch processing of effect operations

**Event Registration Methods:**
- `registerUpdateEvents({ before?, after? })` - Registers update loop events
- `registerMouseEvents({ before?, after? })` - Registers mouse input events
- `registerEmitKeyboardEvents(before?, after?)` - Registers keyboard events
- `registerGamepadEvents({ before?, after? })` - Registers gamepad events
- `registerRenderEvents({ before?, after? })` - Registers render loop events

**State Properties:**
- `isLeftMousePressed: boolean` - Left mouse button state
- `isMiddleMousePressed: boolean` - Middle mouse button state
- `isRightMousePressed: boolean` - Right mouse button state
- `isPressed: Record<string, boolean>` - Keyboard key states
- `gamepadStates: Record<number, Gamepad>` - Connected gamepad states

## Type Definitions

### `EffectDep`

Defines the dependency types for effects:

```typescript
type EffectDep = BaseOfEffect | [BaseOfEffect, ContextConstructor]
```

### `ContextConstructor`

Type for context constructors that can be used with the effect system:

```typescript
type ContextConstructor = { new (...args: any[]): any; context: true }
```

## Usage Examples

### Basic Effect Creation

```typescript
import Effect from '@sky-modules/features/effect/Effect'
import EffectThree from '@sky-modules/features/effect/EffectThree'

// Create root effect
const root = new EffectThree()

// Create child effect with cleanup
const effect = new Effect(() => {
  console.log('Effect started')

  // Return cleanup function
  return () => {
    console.log('Effect cleaned up')
  }
}, root)
```

### Context System

```typescript
class MyContext {
  static context = true

  constructor(public value: string) {}
}

// Add context to effect
const contextInstance = new MyContext('hello')
root.addContext(contextInstance)

// Access context in child effects
const childEffect = new Effect(root)
const context = childEffect.context(MyContext) // Returns MyContext instance
```

### Event Handling

```typescript
class MyComponent {
  onUpdate(event: { dt: number }) {
    console.log('Update:', event.dt)
  }

  onGlobalMouseMove(event: { x: number, y: number }) {
    console.log('Mouse:', event.x, event.y)
  }
}

const component = new MyComponent()
const effect = new Effect(root, component)

// Register global events
root.registerUpdateEvents()
root.registerMouseEvents()
```

### Dependency Management

```typescript
// Create effects with dependencies
const parentEffect = new Effect(root)
const childEffect = new Effect(parentEffect)

// Add additional dependencies
childEffect.addDep(someOtherEffect)

// Remove dependencies
childEffect.removeDep(someOtherEffect)
```

### Gamepad Support

```typescript
root.registerGamepadEvents({
  before: () => console.log('Before gamepad update'),
  after: () => console.log('After gamepad update')
})

// Check gamepad state
const gamepad = root.getGamepad(0) // Get first gamepad
const isButtonPressed = root.isGamepadButtonPressed(0, 0) // Check button A
```

## Event System

The effect system provides comprehensive event handling:

### Update Events
- `beforeUpdate` - Before frame update
- `update` - Main update loop
- `afterUpdate` - After frame update

### Input Events
- `onGlobalMouseMove` - Mouse movement
- `onGlobalMouseDown` - Mouse button press
- `onGlobalMouseUp` - Mouse button release
- `onGlobalKeyDown` - Key press
- `onGlobalKeyUp` - Key release
- `onGamepadButtonDown` - Gamepad button press
- `onGamepadAxisMove` - Gamepad stick movement

### Render Events
- `beforeRender` - Before rendering
- `render` - Main render loop
- `afterRender` - After rendering

## Lifecycle Management

Effects automatically manage their lifecycle:

1. **Creation** - Effect is created and added to parent
2. **Initialization** - Contexts are resolved and propagated
3. **Active** - Effect receives events and updates
4. **Disposal** - Effect and all children are cleaned up

The system ensures that:
- Child effects are disposed when parents are disposed
- Contexts are properly cleaned up
- Event handlers are removed
- Memory leaks are prevented

## Best Practices

1. **Always provide cleanup functions** when creating effects with side effects
2. **Use contexts** for dependency injection rather than global state
3. **Batch operations** using the commit() method for better performance
4. **Structure effects hierarchically** to mirror your application architecture
5. **Use typed contexts** for better development experience

## Thread Safety

The effect system is designed for single-threaded environments but provides:
- Batched operations to prevent race conditions
- Proper disposal ordering to prevent dangling references
- Event capturing to control event propagation