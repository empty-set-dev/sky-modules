# jsx

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Jsx utility module
</div>

Universal JSX runtime enabling cross-framework component development with Solid.js reactivity.

## Installation

```bash
npm install sky-jsx
```

## Features

- **Universal JSX Runtime** - Platform-agnostic JSX that works with any renderer
- **Solid.js Reactivity** - Full access to Solid.js reactive primitives (createSignal, createEffect, etc.)
- **Cross-Framework Support** - Works with Canvas, Three.js, native UI, or custom renderers
- **Custom Renderer** - Built on Solid.js universal renderer API
- **Mitosis Integration** - useController hook for external state management
- **Zero DOM Dependency** - Produces JSX objects, not DOM nodes
- **TypeScript Support** - Complete type definitions

## Usage

### Basic Reactive Component

```typescript
import { createSignal } from 'sky-jsx/jsx-universal'

function Counter() {
    const [count, setCount] = createSignal(0)

    return (
        <div>
            <text>Count: {count()}</text>
            <button onClick={() => setCount(count() + 1)}>
                Increment
            </button>
        </div>
    )
}
```

### With Canvas Renderer

```typescript
import { createSignal, createEffect } from 'sky-jsx/jsx-universal'
import { CanvasRenderer } from '@sky-modules/canvas'

function AnimatedCircle() {
    const [radius, setRadius] = createSignal(50)

    createEffect(() => {
        console.log('Radius changed:', radius())
    })

    return (
        <circle
            x={200}
            y={200}
            radius={radius()}
            fill="red"
            onClick={() => setRadius(radius() + 10)}
        />
    )
}

const renderer = new CanvasRenderer()
renderer.render(<AnimatedCircle />)
```

### Reactive State Management

```typescript
import {
    createSignal,
    createEffect,
    createMemo,
    batch
} from 'sky-jsx/jsx-universal'

function TodoList() {
    const [todos, setTodos] = createSignal([])
    const [filter, setFilter] = createSignal('all')

    // Computed value
    const filteredTodos = createMemo(() => {
        const list = todos()
        const f = filter()

        if (f === 'completed') return list.filter(t => t.done)
        if (f === 'active') return list.filter(t => !t.done)
        return list
    })

    // Effect runs when dependencies change
    createEffect(() => {
        console.log('Filtered todos:', filteredTodos().length)
    })

    const addTodo = (text) => {
        // Batch multiple updates
        batch(() => {
            setTodos([...todos(), { text, done: false }])
            setFilter('all')
        })
    }

    return (
        <div>
            {filteredTodos().map(todo => (
                <div>{todo.text}</div>
            ))}
        </div>
    )
}
```

### Using useController Hook

```typescript
import useController from 'sky-jsx/useController'
import { onMount } from '@builder.io/mitosis'

// Controller with onChange/dispose pattern
class CanvasController {
    width = 800
    height = 600

    private listeners = []

    onChange(callback) {
        this.listeners.push(callback)
    }

    resize(width, height) {
        this.width = width
        this.height = height
        this.listeners.forEach(fn => fn())
    }

    dispose() {
        this.listeners = []
    }
}

// Use in Mitosis component
function CanvasComponent() {
    const [controller, setController] = useController()

    onMount(() => {
        const ctrl = new CanvasController()
        setController(ctrl)

        window.addEventListener('resize', () => {
            ctrl.resize(window.innerWidth, window.innerHeight)
        })
    })

    return (
        <div>
            Canvas: {controller?.width} x {controller?.height}
        </div>
    )
}
```

### Context API

```typescript
import { createContext, useContext } from 'sky-jsx/jsx-universal'

const ThemeContext = createContext('light')

function ThemedComponent() {
    const theme = useContext(ThemeContext)

    return (
        <div>
            Current theme: {theme}
        </div>
    )
}

function App() {
    return (
        <ThemeContext.Provider value="dark">
            <ThemedComponent />
        </ThemeContext.Provider>
    )
}
```

### Class Components

```typescript
import JSX from 'sky-jsx'

class MyComponent implements JSX.Component {
    props: { name: string }

    constructor(props: { name: string }) {
        this.props = props
    }

    render(): JSX.Element {
        return <div>Hello {this.props.name}</div>
    }
}

// Class components are supported by jsx-universal renderer
<MyComponent name="World" />
```

## API

### jsx-universal.ts

Main universal renderer module built on Solid.js.

**Exports:**
- `render` - Render JSX to a container
- `createComponent` - Create component instances
- `createElement` - Create JSX elements
- `createSignal` - Reactive state
- `createEffect` - Side effects
- `createMemo` - Computed values
- `createRoot` - Root reactive scope
- `onMount` - Mount lifecycle
- `onCleanup` - Cleanup lifecycle
- `batch` - Batch updates
- `untrack` - Escape reactivity
- `on` - Explicit dependencies
- `createContext` - Context provider/consumer
- `useContext` - Access context
- `Fragment` - Fragment element

**Features:**
- Custom Solid.js renderer producing JSX objects instead of DOM
- Handles both function components and class components
- Preserves reactivity through getter functions
- Compatible with any downstream renderer

### JSX.ts

Type definitions and re-exports of Solid.js primitives.

**Exports:**
- All Solid.js reactive primitives from `solid-js`
- JSX type definitions

**Types:**
- `JSX.FC<P>` - Function component type
- `JSX.ComponentClass<P>` - Class component type
- `JSX.Component<P>` - Component instance interface
- `JSX.Node` - Valid JSX children
- `JSX.Element` - JSX element object
- `JSX.Return` - Component return type

### jsx-runtime.ts

Production JSX transformation runtime.

**Exports:**
- `jsx(type, props)` - Create JSX element
- `Fragment` - Fragment element type

**Usage:**
Configure TypeScript to use this runtime:
```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "sky-jsx"
    }
}
```

### jsx-dev-runtime.ts

Development JSX transformation runtime.

**Exports:**
- `jsxDEV(type, props)` - Create JSX element with dev info
- `Fragment` - Fragment element type

**Usage:**
Automatically used in development mode when `jsxImportSource` is configured.

### useController

Mitosis hook for controller lifecycle management.

**Interface:**
```typescript
interface Controller {
    onChange(callback: () => void): void
    dispose(): void | PromiseLike<void>
}

function useController<T extends Controller>(): [
    controller: T | null,
    setController: (controller: T) => void
]
```

**Features:**
- Automatically registers change callback on mount
- Automatically disposes controller on unmount
- Triggers component re-render when controller changes
- Compatible with any controller implementing the interface

**Example:**
```typescript
import useController, { Controller } from 'sky-jsx/useController'

class MyController implements Controller {
    private changeCallbacks = []

    onChange(callback: () => void) {
        this.changeCallbacks.push(callback)
    }

    notifyChange() {
        this.changeCallbacks.forEach(cb => cb())
    }

    dispose() {
        this.changeCallbacks = []
    }
}

function Component() {
    const [ctrl, setCtrl] = useController<MyController>()

    onMount(() => {
        setCtrl(new MyController())
    })

    return <div>Controller: {ctrl ? 'ready' : 'not ready'}</div>
}
```

## Files

### jsx-universal.ts
**Purpose:** Custom Solid.js universal renderer
**Key Exports:**
- `createComponent` - Component instantiation
- `render`, `effect`, `memo` - Rendering utilities
- `createElement`, `createTextNode` - Element creation
- `insertNode`, `removeNode` - DOM-like operations
- All Solid.js reactive primitives

**Features:**
- Creates JSX objects instead of DOM nodes
- Handles class vs function component distinction
- Preserves reactive getters from babel-preset-solid
- Provides minimal DOM-like API for Solid.js renderer

### JSX.ts
**Purpose:** Type definitions and Solid.js re-exports
**Exports:**
- JSX namespace with component types
- All Solid.js exports for reactive primitives

### jsx-runtime.ts
**Purpose:** Production JSX transformation
**Exports:**
- `jsx()` function for JSX element creation
- `Fragment` for fragment support

### jsx-dev-runtime.ts
**Purpose:** Development JSX transformation
**Exports:**
- `jsxDEV()` function with development features
- `Fragment` for fragment support

### useController/useController.lite.ts
**Purpose:** Mitosis hook for controller management
**Exports:**
- `useController<T>()` hook
- `Controller` interface

**Features:**
- Automatic onChange registration
- Automatic disposal
- Component re-render triggering
- Compatible with Mitosis compilation

## Related Modules

- [@sky-modules/canvas](/modules/canvas/canvas) - 2D canvas renderer using this JSX runtime
- [@sky-modules/three](/modules/three/three) - 3D Three.js renderer
- [@sky-modules/react](/modules/react/react) - React integration utilities

## Implementation Notes

### Why Solid.js?

Solid.js was chosen for the universal JSX runtime because:

1. **True Reactivity** - Fine-grained reactivity without virtual DOM
2. **Universal Renderer API** - Built-in support for custom renderers
3. **Compile-Time Optimizations** - babel-preset-solid wraps reactive props in getters
4. **Small Size** - Minimal runtime overhead
5. **Familiar API** - Similar to React hooks
6. **TypeScript Support** - Excellent type definitions

### Architecture

```
JSX Syntax
    ↓ (Babel/TypeScript transform)
jsx() / jsxDEV() calls
    ↓ (Creates JSX objects)
{type, props, children}
    ↓ (Solid.js universal renderer)
Custom renderer operations
    ↓ (Canvas/Three/Custom renderer)
Actual rendering
```

### Reactivity Model

Solid.js uses a fine-grained reactivity model:

1. **Signals** - Reactive state (`createSignal`)
2. **Effects** - Side effects that run when dependencies change (`createEffect`)
3. **Memos** - Cached computed values (`createMemo`)
4. **Tracking** - Automatic dependency tracking
5. **Batching** - Group updates to minimize re-renders

```typescript
const [count, setCount] = createSignal(0)

// Effect auto-tracks count() usage
createEffect(() => {
    console.log('Count is:', count())
})

// Memo auto-tracks and caches result
const doubled = createMemo(() => count() * 2)

// Update triggers effect and memo
setCount(5) // Logs: "Count is: 5", doubled() === 10
```

### Renderer Integration

To use this JSX runtime with a custom renderer:

1. **Accept JSX Elements** - Your renderer receives `{type, props, children}` objects
2. **Handle Reactive Props** - Props may be getter functions, call them to get values
3. **Track Changes** - Use Solid.js effects to re-render on changes
4. **Create Elements** - Convert JSX elements to your target format

Example:
```typescript
class CustomRenderer {
    render(element: JSX.Element) {
        const { type, props } = element

        // Props might be reactive getters
        const getValue = (prop) => {
            return typeof prop === 'function' ? prop() : prop
        }

        // Use effect to track changes
        createEffect(() => {
            const x = getValue(props.x)
            const y = getValue(props.y)
            // Render with current values
            this.drawElement(type, x, y)
        })
    }
}
```

### Class vs Function Components

The renderer distinguishes between class and function components:

```typescript
// Function component - called directly
function Func(props) {
    return <div>{props.name}</div>
}

// Class component - instantiated with 'new'
class Class {
    constructor(props) {
        this.props = props
    }
    render() {
        return <div>{this.props.name}</div>
    }
}

// Renderer handles both:
// Func(props) vs new Class(props)
```

### useController Pattern

The useController hook implements a common pattern for external state:

1. **Controller** - External object with state (Canvas, Three.js scene, etc.)
2. **onChange** - Notification when controller state changes
3. **dispose** - Cleanup when component unmounts
4. **Component Re-render** - Trigger UI update on change

This pattern bridges imperative controllers with reactive UI components.

### Best Practices

```typescript
// Good - use signals for reactive state
const [count, setCount] = createSignal(0)

// Bad - regular variables aren't reactive
let count = 0

// Good - use createMemo for computed values
const doubled = createMemo(() => count() * 2)

// Bad - recompute on every access
const doubled = () => count() * 2

// Good - batch related updates
batch(() => {
    setCount(5)
    setName('Alice')
    setEnabled(true)
})

// Bad - multiple separate updates
setCount(5)
setName('Alice')
setEnabled(true)

// Good - use untrack to prevent dependencies
createEffect(() => {
    console.log('Count:', count())
    // untrack prevents other() from being tracked
    console.log('Other:', untrack(other))
})

// Good - explicit dependencies with on()
createEffect(on(count, () => {
    console.log('Count changed')
}))
```

### Performance Tips

1. **Use createMemo** - Cache expensive computations
2. **Batch updates** - Group state changes to reduce effects
3. **Use on()** - Make effect dependencies explicit
4. **Avoid unnecessary effects** - Use derived state with memos instead
5. **Untrack when appropriate** - Prevent unwanted dependency tracking

### Limitations

1. **No automatic DOM rendering** - Requires custom renderer
2. **Solid.js-specific** - Tied to Solid.js reactivity model
3. **Babel preset needed** - For optimal reactivity, needs babel-preset-solid
4. **Learning curve** - Different from React mental model
