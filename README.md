# Sky Modules

Powerful TypeScript utility modules for modern development

## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { mergeNamespace, globalify } from '@sky-modules/core'

// Merge objects with type safety
const result = mergeNamespace(obj1, obj2)

// Add to global namespace
globalify({ myUtility: someFunction })
```

## Modules


### Table of Contents

- **canvas**
    - [.](#.)

- **Core Modules**
    - [.](#.)

- **design**
    - [.](#.)

- **features**
    - [.](#.)

- **jsx**
    - [.](#.)

- **math**
    - [.](#.)

- **platform**
    - [.](#.)

- **react**
    - [.](#.)

- **solid**
    - [.](#.)

- **svelte**
    - [.](#.)

- **three**
    - [.](#.)

- **universal**
    - [.](#.)

- **vike**
    - [.](#.)

- **vue**
    - [.](#.)


## canvas

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/canvas/.)

### @sky-modules/canvas

A 2D rendering system for drawing shapes, text, and complex graphics with HTML5 Canvas API.

```bash
npm install @sky-modules/canvas
```

#### Features

- **High-level drawing API** - Simplified methods for common drawing operations
- **Pixel ratio support** - Automatic scaling for high-DPI displays
- **Scene graph rendering** - Hierarchical object management
- **Material system** - Different rendering styles (fill, stroke, gradient, pattern)
- **Geometry system** - Reusable shape definitions
- **JSX support** - Declarative scene composition with React-like syntax
- **Transform system** - Position, rotation, scale with world coordinates

#### Quick Start

```typescript
import Canvas, { Scene, Mesh, RectGeometry, BasicMaterial } from '@sky-modules/canvas'

// Create canvas
const canvas = new Canvas({
    size: () => [800, 600],
    pixelRatio: window.devicePixelRatio
})

// Create scene
const scene = new Scene()
scene.setBackground('#f0f0f0')

// Create a rectangle
const geometry = new RectGeometry(100, 50)
const material = new BasicMaterial({ color: '#ff0000' })
const mesh = new Mesh(geometry, material)

mesh.position.set(400, 300)
scene.add(mesh)

// Render
canvas.render(scene)
```

#### JSX Support

Use declarative JSX syntax for scene composition:

```tsx
import { Canvas, Scene, Rect, Circle } from '@sky-modules/canvas/jsx'

<Canvas size={[800, 600]} pixelRatio={2}>
    <Scene background="#ffffff">
        <Rect
            width={100}
            height={50}
            x={400}
            y={300}
            fill="#ff0000"
        />
        <Circle
            radius={25}
            x={200}
            y={200}
            fill="#00ff00"
        />
    </Scene>
</Canvas>
```

#### Core Components

##### Canvas
Main rendering context with automatic pixel ratio handling.

##### Scene
Container for renderable objects with background and transform support.

##### Mesh
Combines geometry and material for rendering.

##### Geometries
- **RectGeometry** - Rectangles and squares
- **CircleGeometry** - Circles and arcs
- **PathGeometry** - Custom paths
- **TextGeometry** - Rendered text

##### Materials
- **BasicMaterial** - Solid colors
- **GradientMaterial** - Linear and radial gradients
- **PatternMaterial** - Image patterns
- **StrokeMaterial** - Strokes with various styles

#### Use Cases

Perfect for:

- 📊 **Data visualization** - Charts, graphs, and diagrams
- 🎮 **2D games** - Sprites, animations, and particle systems
- 🎨 **Drawing applications** - Interactive canvases and editors
- 📐 **Geometric visualizations** - Shapes, patterns, and fractals

#### Module Structure

##### Core Rendering
- **[core/](./core/)** - Scene graph, rendering engine, and object primitives
  - `CanvasRenderer.ts` - Main rendering engine with fluent API
  - `Scene.ts` - Root scene graph container
  - `Mesh.ts` - Renderable object (geometry + material)
  - `Group.ts` - Container for organizing objects
  - `Object2D.ts` - Base class with transforms and hierarchy
  - `Raycaster.ts` - Mouse picking and hit testing
  - `UniversalCanvasAppLauncher.tsx` - Cross-platform app launcher
  - **[renderers/](./core/renderers/)** - Specialized renderers
    - `ScrollbarRenderer.ts` - Scrollbar rendering for overflow containers
    - `ScrollbarConfig.ts` - Scrollbar configuration
  - **[styles/](./core/styles/)** - Style management
    - `StyleManager.ts` - Canvas context style management with pixel ratio scaling
  - **[utils/](./core/utils/)** - Utilities
    - `PerformanceProfiler.ts` - Performance monitoring and profiling

##### Shapes & Drawing Styles
- **[geometries/](./geometries/)** - Shape definitions (what to draw)
  - `Geometry.ts` - Abstract base class
  - `RectGeometry.ts` - Rectangles and squares
  - `CircleGeometry.ts` - Circles and arcs
  - `EllipseGeometry.ts` - Elliptical shapes
  - `PathGeometry.ts` - Custom paths with fluent API
  - `PolylineGeometry.ts` - Multi-point lines and polygons
  - `SplineGeometry.ts` - Smooth curves (Catmull-Rom splines)
  - `TextGeometry.ts` - Text rendering

- **[materials/](./materials/)** - Drawing styles (how to draw)
  - `Material.ts` - Abstract base class with common properties
  - `BasicMaterial.ts` - Solid color fills
  - `StrokeMaterial.ts` - Outlines and strokes
  - `GradientMaterial.ts` - Linear/radial/conic gradients
  - `StrokeGradientMaterial.ts` - Gradient strokes
  - `FillStrokeMaterial.ts` - Combined fill and stroke
  - `PatternMaterial.ts` - Repeating pattern fills

##### JSX System
- **[jsx/](./jsx/)** - Declarative JSX rendering
  - `jsx.tsx` - Main JSX implementation (primitives and components)
  - **[box/](./jsx/box/)** - CSS-like Box component
    - `Box.implementation.tsx` - Flexbox container with CSS support
    - `styles-parser.ts` - CSS property parsing
    - `twrn.ts` - Tailwind-to-React-Native style conversion
    - `tokens.ts` - Design system tokens
  - **[utils/](./jsx/utils/)** - JSX utilities
    - `AnimationLoop.ts` - Render loop management
    - `ObjectManager.ts` - Object lifecycle and caching
    - `GeometryMaterialManager.ts` - Geometry/Material factory
    - `ScrollManager.ts` - Scroll interaction handling
    - `JSXPerformanceProfiler.ts` - JSX performance monitoring

##### CSS Rendering
- **[rendering/](./rendering/)** - CSS-to-Canvas conversion
  - `renderCSSToCanvas.ts` - Main CSS renderer
  - `wrapText.ts` - Text wrapping utilities
  - **[utils/](./rendering/utils/)** - Rendering utilities
    - `parsing.ts` - CSS value parsing
    - `drawing.ts` - Drawing helpers
    - `text.ts` - Text rendering utilities
    - `layout.ts` - Flexbox layout engine

##### Mitosis Component
- **[Canvas/](./Canvas/)** - Cross-framework Canvas component
  - `Canvas.lite.tsx` - Mitosis Canvas component

#### Documentation

For complete API reference and examples, visit:
- [Full Documentation](https://empty-set-dev.github.io/sky-modules/modules/canvas)
- [Core README](./core/README.md) - Core rendering classes
- [Geometries README](./geometries/README.md) - Shape definitions
- [Materials README](./materials/README.md) - Drawing styles
- [JSX README](./jsx/README.md) - JSX system specification
- [Renderers README](./core/renderers/README.md) - Specialized renderers
- [Styles README](./core/styles/README.md) - Style management

#### License

ISC License - see the [LICENSE](../LICENSE) file for details.

[← Back to Table of Contents](#table-of-contents)

---


## Core Modules

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/core/.)

### @sky-modules/core

Core utilities and runtime for Sky Modules framework - a distributed reactive system for building real-time applications.

```bash
npm install @sky-modules/core
```

#### What's Included

The core package provides:

- **Reactive Runtime** - Automatic dependency tracking and state synchronization
- **Network Synchronization** - Real-time state sharing across clients
- **Schema System** - Typed data structures with reactivity decorators
- **Serialization** - Preserve class instances across network/storage
- **Utility Functions** - Common helpers for modern TypeScript development

#### Key Features

##### Distributed Reactivity

Build applications where state automatically synchronizes across multiple clients in real-time - perfect for multiplayer games, collaborative editors, and live dashboards.

##### Type-Safe Schemas

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

##### Automatic Change Tracking

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

#### Core Modules

The package includes these sub-modules:

- **env** - Cross-platform environment variable access
- **define** - Schema definition and decorators
- **reaction** - Reactive computations
- **share** - Network synchronization
- **serialize** - Class instance serialization

And many more utility modules for arrays, objects, functions, and async operations.

#### Use Cases

Perfect for building:

- 🎮 Multiplayer games with real-time state sync
- 📝 Collaborative editors (like Figma, Google Docs)
- 💬 Real-time chat applications
- 📊 Live dashboards with automatic updates
- 🔄 Offline-first apps with sync
- 🌐 Distributed systems

#### Documentation

For complete documentation, examples, and API reference, visit the [full documentation](https://empty-set-dev.github.io/sky-modules).

#### Quick Example

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

#### License

ISC License - see the [LICENSE](../../LICENSE) file for details.

[← Back to Table of Contents](#table-of-contents)

---


## design

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/design/.)

### @sky-modules/design

Design system components, tokens, and styling utilities built on Panda CSS.

```bash
npm install @sky-modules/design
```

#### Features

- **Design Tokens** - Colors, spacing, typography, shadows
- **Component Recipes** - Reusable style patterns
- **Brand System** - Multi-brand theming support
- **Layout Components** - Box, Layout, Grid
- **Panda CSS** - Zero-runtime CSS-in-JS with atomic CSS
- **Type-safe** - Full TypeScript support

#### Quick Start

##### Using Design Tokens

```typescript
import { css } from '@sky-modules/design/css'

const styles = css({
    backgroundColor: 'primary.500',
    padding: '4',
    borderRadius: 'md',
    color: 'white'
})
```

##### Box Component

Universal box component with design system integration:

```tsx
import { Box } from '@sky-modules/design'

<Box
    backgroundColor="primary.500"
    padding="4"
    borderRadius="md"
    color="white"
>
    Content here
</Box>
```

##### Brand System

Configure multiple brand themes:

```typescript
import { Brand } from '@sky-modules/design'

Brand.configure({
    default: {
        primary: '#007bff',
        secondary: '#6c757d'
    },
    darkMode: {
        primary: '#0056b3',
        secondary: '#5a6268'
    }
})
```

#### Design Tokens

##### Colors
- Semantic colors (primary, secondary, success, warning, error)
- Neutral palette (gray.50 - gray.900)
- Brand-specific colors

##### Spacing
- Consistent spacing scale (1 - 16)
- rem-based units for accessibility

##### Typography
- Font families, sizes, weights
- Line heights and letter spacing

#### Components

The package includes styled components built with the design system:

- **Box** - Fundamental building block with all CSS properties
- **Layout** - Flex and grid layouts
- **Typography** - Headings, text, and paragraphs

#### Panda CSS Integration

The design system is built on Panda CSS, providing:

- **Zero runtime** - Styles extracted at build time
- **Atomic CSS** - Optimized CSS output
- **Type safety** - Autocomplete for all design tokens
- **Recipes** - Reusable component variants

#### Modules

The design system is organized into focused modules:

##### Core Components

- **[Box](./Box)** - Universal polymorphic component with Panda CSS, Tailwind, and full CSS properties support
- **[Layout](./Layout)** - Platform-agnostic layout computation engine (Canvas, Three.js, DOM)

##### Design System

- **[Brand](./Brand)** - TypeScript interfaces for brand design tokens (colors, typography, spacing, components)
- **[DesignSystem](./DesignSystem)** - Cross-framework design system provider for brand theming and runtime switching
- **[Design](./Design)** - Design system utilities and type helpers for building component libraries

##### Pre-configured Assets

- **[brands](./brands)** - Pre-configured brand definitions (reset, sky brands)
- **[colors](./colors)** - Color manipulation utilities (powered by Culori)
- **[lib](./lib)** - SCSS/CSS utility mixins for common design patterns

#### Module Overview

##### Box
Universal polymorphic component that works across all frameworks (React, Vue, Solid, Svelte, Qwik, Angular):
```tsx
<Box as="button" padding="4" backgroundColor="primary.500" onClick={handleClick}>
  Styled Button
</Box>
```

##### Brand
Type-safe brand definitions with foundation, semantic, layout, and component tokens:
```typescript
const myBrand: Brand = {
  name: 'my-brand',
  foundation: { colors: {...}, typography: {...} },
  semantic: { colors: {...}, animations: {...} },
  layout: { container: {...} }
}
```

##### DesignSystem
Runtime brand and theme management:
```tsx
<DesignSystemProvider brand="sky" initialTheme="dark">
  <App />
</DesignSystemProvider>
```

##### Layout
Compute layout positions for any rendering target:
```typescript
const layout = computeLayout({
  styles: { display: 'flex', width: 500, gap: 10 },
  children: [...]
})
// Use computed positions for Canvas, Three.js, etc.
```

#### Documentation

For detailed documentation on each module:

- [Box Documentation](./Box/README.md) - Component usage and API
- [Brand Documentation](./Brand/README.md) - Brand token definitions
- [DesignSystem Documentation](./DesignSystem/README.md) - Runtime theming
- [Design Documentation](./Design/README.md) - Utility types and helpers
- [Layout Documentation](./Layout/README.md) - Layout engine API
- [brands Documentation](./brands/README.md) - Pre-configured brands
- [colors Documentation](./colors/README.md) - Color utilities
- [lib Documentation](./lib/README.md) - SCSS/CSS utilities

Full documentation: [https://empty-set-dev.github.io/sky-modules/modules/design](https://empty-set-dev.github.io/sky-modules/modules/design)

#### License

ISC License - see the [LICENSE](../LICENSE) file for details.

[← Back to Table of Contents](#table-of-contents)

---


## features

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/features/.)

### Features Module

High-level architectural patterns and systems for building complex applications with reactive state management, effect-based lifecycle control, and Entity-Component-System architecture.

```bash
npm install @sky-modules/features
```

#### Overview

The features module provides three complementary subsystems:

- **ECS (Entity-Component-System)** - Data-oriented architecture for game development and complex simulations
- **Effect System** - Hierarchical lifecycle and dependency management with automatic cleanup
- **Reactive System** - Observable state management with automatic change tracking

#### Quick Start

##### ECS (Entity-Component-System)

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

##### Effect System

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

##### Reactive System

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

#### Subsystems

##### [ECS (Entity-Component-System)](./ecs/README.md)

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

##### [Effect System](./effect/README.md)

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

##### Reactive System

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

#### Integration

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

#### Architecture Patterns

##### Component-Based Architecture (ECS)

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

##### Hierarchical Lifecycle Management (Effect)

Build nested structures with automatic cleanup:

```typescript
const scene = new Effect(effectTree)

// Child effects are disposed when parent is disposed
const camera = new Effect(scene)
const lights = new Effect(scene)

// Dispose entire scene hierarchy
scene.dispose() // Automatically disposes camera and lights
```

##### Context Propagation (Effect)

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

#### Performance Considerations

- **ECS**: O(n) iteration over entities in systems, cache-friendly data layout
- **Effect System**: Deferred operations via commit() for batching
- **Reactive**: Lazy evaluation, minimal overhead when not observed

#### Related Modules

- `@sky-modules/core` - Core utilities used throughout
- `@sky-modules/math` - Vector and math utilities for game development
- `@sky-modules/platform` - Platform detection and abstractions

#### TypeScript Support

Full TypeScript support with generic types:

```typescript
// Type-safe component access
const entity = new Entity(effectTree)
const position: PositionComponent = entity.position

// Type-safe effect dependencies
const effect = new Effect<MyContext>([parent, MyContext])
```

#### Documentation

- [ECS Guide](./ecs/README.md) - Comprehensive ECS architecture guide
- [Effect System Guide](./effect/README.md) - Effect lifecycle and patterns
- API documentation available via JSDoc in source files

#### License

MIT

[← Back to Table of Contents](#table-of-contents)

---


## jsx

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/jsx/.)

Universal JSX runtime enabling cross-framework component development with Solid.js reactivity.

```bash
npm install sky-jsx
```

#### Features

- **Universal JSX Runtime** - Platform-agnostic JSX that works with any renderer
- **Solid.js Reactivity** - Full access to Solid.js reactive primitives (createSignal, createEffect, etc.)
- **Cross-Framework Support** - Works with Canvas, Three.js, native UI, or custom renderers
- **Custom Renderer** - Built on Solid.js universal renderer API
- **Mitosis Integration** - useController hook for external state management
- **Zero DOM Dependency** - Produces JSX objects, not DOM nodes
- **TypeScript Support** - Complete type definitions

#### Usage

##### Basic Reactive Component

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

##### With Canvas Renderer

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

##### Reactive State Management

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

##### Using useController Hook

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

##### Context API

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

##### Class Components

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

#### API

##### jsx-universal.ts

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

##### JSX.ts

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

##### jsx-runtime.ts

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

##### jsx-dev-runtime.ts

Development JSX transformation runtime.

**Exports:**
- `jsxDEV(type, props)` - Create JSX element with dev info
- `Fragment` - Fragment element type

**Usage:**
Automatically used in development mode when `jsxImportSource` is configured.

##### useController

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

#### Files

##### jsx-universal.ts
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

##### JSX.ts
**Purpose:** Type definitions and Solid.js re-exports
**Exports:**
- JSX namespace with component types
- All Solid.js exports for reactive primitives

##### jsx-runtime.ts
**Purpose:** Production JSX transformation
**Exports:**
- `jsx()` function for JSX element creation
- `Fragment` for fragment support

##### jsx-dev-runtime.ts
**Purpose:** Development JSX transformation
**Exports:**
- `jsxDEV()` function with development features
- `Fragment` for fragment support

##### useController/useController.lite.ts
**Purpose:** Mitosis hook for controller management
**Exports:**
- `useController<T>()` hook
- `Controller` interface

**Features:**
- Automatic onChange registration
- Automatic disposal
- Component re-render triggering
- Compatible with Mitosis compilation

#### Related Modules

- [@sky-modules/canvas](/canvas) - 2D canvas renderer using this JSX runtime
- [@sky-modules/three](/three) - 3D Three.js renderer
- [@sky-modules/react](/react) - React integration utilities

#### Implementation Notes

##### Why Solid.js?

Solid.js was chosen for the universal JSX runtime because:

1. **True Reactivity** - Fine-grained reactivity without virtual DOM
2. **Universal Renderer API** - Built-in support for custom renderers
3. **Compile-Time Optimizations** - babel-preset-solid wraps reactive props in getters
4. **Small Size** - Minimal runtime overhead
5. **Familiar API** - Similar to React hooks
6. **TypeScript Support** - Excellent type definitions

##### Architecture

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

##### Reactivity Model

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

##### Renderer Integration

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

##### Class vs Function Components

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

##### useController Pattern

The useController hook implements a common pattern for external state:

1. **Controller** - External object with state (Canvas, Three.js scene, etc.)
2. **onChange** - Notification when controller state changes
3. **dispose** - Cleanup when component unmounts
4. **Component Re-render** - Trigger UI update on change

This pattern bridges imperative controllers with reactive UI components.

##### Best Practices

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

##### Performance Tips

1. **Use createMemo** - Cache expensive computations
2. **Batch updates** - Group state changes to reduce effects
3. **Use on()** - Make effect dependencies explicit
4. **Avoid unnecessary effects** - Use derived state with memos instead
5. **Untrack when appropriate** - Prevent unwanted dependency tracking

##### Limitations

1. **No automatic DOM rendering** - Requires custom renderer
2. **Solid.js-specific** - Tied to Solid.js reactivity model
3. **Babel preset needed** - For optimal reactivity, needs babel-preset-solid
4. **Learning curve** - Different from React mental model

[← Back to Table of Contents](#table-of-contents)

---


## math

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/math/.)

Mathematical utilities and vector operations for 2D/3D graphics and scientific computing.

```bash
npm install @sky-modules/math
```

#### Features

- **Vector2** - 2D vector class with mathematical operations (from Three.js)
- **Vector3** - 3D vector class with mathematical operations (from Three.js)
- **Three.js Math Types** - Complete TypeScript definitions for Three.js math library
- **Global Extensions** - Optional global namespace pollution for convenience
- **Zero Dependencies** - Re-exports from Three.js math without additional overhead

#### Usage

##### Basic Vector Operations

```typescript
import { Vector2, Vector3 } from '@sky-modules/math'

// 2D vectors
const v2 = new Vector2(10, 20)
const v2_copy = v2.clone()
v2_copy.add(new Vector2(5, 5)) // (15, 25)

// 3D vectors
const v3 = new Vector3(1, 2, 3)
const length = v3.length() // ~3.74
const normalized = v3.clone().normalize() // Unit vector
```

##### Vector Math

```typescript
import { Vector3 } from '@sky-modules/math'

const v1 = new Vector3(1, 0, 0)
const v2 = new Vector3(0, 1, 0)

// Dot product
const dot = v1.dot(v2) // 0

// Cross product
const cross = v1.clone().cross(v2) // (0, 0, 1)

// Distance between vectors
const distance = v1.distanceTo(v2) // ~1.41

// Linear interpolation
const lerp = v1.clone().lerp(v2, 0.5) // (0.5, 0.5, 0)
```

##### Global Extensions

```typescript
// Import global extensions to use without imports
import '@sky-modules/math/global'

// Now Vector2 and Vector3 are globally available
const vec = new Vector2(10, 20)
const vec3 = new Vector3(1, 2, 3)
```

##### Three.js Math Types

The module includes complete TypeScript definitions for all Three.js math classes:

```typescript
import type {
    Box2,
    Box3,
    Color,
    Euler,
    Matrix3,
    Matrix4,
    Quaternion,
    Sphere,
    Plane,
    Ray,
    // ... and more
} from '@sky-modules/math/three'
```

#### API

##### Vector2

**Source:** `@sky-modules/math/three/Vector2`

**Key Methods:**
- `new Vector2(x?, y?)` - Create 2D vector
- `add(v)` - Add vector
- `sub(v)` - Subtract vector
- `multiply(v)` - Multiply by vector
- `multiplyScalar(s)` - Multiply by scalar
- `divide(v)` - Divide by vector
- `divideScalar(s)` - Divide by scalar
- `dot(v)` - Dot product
- `cross(v)` - Cross product (returns scalar)
- `length()` - Vector magnitude
- `lengthSq()` - Squared magnitude (faster)
- `normalize()` - Convert to unit vector
- `distanceTo(v)` - Distance to another vector
- `distanceToSquared(v)` - Squared distance (faster)
- `lerp(v, alpha)` - Linear interpolation
- `clone()` - Create copy
- `equals(v)` - Equality check

##### Vector3

**Source:** `@sky-modules/math/three/Vector3`

**Key Methods:**
- `new Vector3(x?, y?, z?)` - Create 3D vector
- `add(v)` - Add vector
- `sub(v)` - Subtract vector
- `multiply(v)` - Multiply by vector
- `multiplyScalar(s)` - Multiply by scalar
- `divide(v)` - Divide by vector
- `divideScalar(s)` - Divide by scalar
- `dot(v)` - Dot product
- `cross(v)` - Cross product (returns vector)
- `length()` - Vector magnitude
- `lengthSq()` - Squared magnitude (faster)
- `normalize()` - Convert to unit vector
- `distanceTo(v)` - Distance to another vector
- `distanceToSquared(v)` - Squared distance (faster)
- `lerp(v, alpha)` - Linear interpolation
- `applyMatrix3(m)` - Apply 3x3 matrix transformation
- `applyMatrix4(m)` - Apply 4x4 matrix transformation
- `applyQuaternion(q)` - Apply quaternion rotation
- `clone()` - Create copy
- `equals(v)` - Equality check

#### Files

##### Vector2/index.ts
**Purpose:** Re-exports Vector2 from Three.js math library
**Exports:** `Vector2` (default export)

##### Vector2/global/Vector2.ts
**Purpose:** Global namespace extension for Vector2
**Features:**
- Makes Vector2 available globally without imports
- Uses globalify utility for safe global registration

##### Vector3/index.ts
**Purpose:** Re-exports Vector3 from Three.js math library
**Exports:** `Vector3` (default export)

##### Vector3/global/Vector3.ts
**Purpose:** Global namespace extension for Vector3
**Features:**
- Makes Vector3 available globally without imports
- Uses globalify utility for safe global registration

##### three/*.d.ts
**Purpose:** TypeScript type definitions for Three.js math classes
**Key Exports:**
- `Box2`, `Box3` - Axis-aligned bounding boxes
- `Color` - RGB color with conversion utilities
- `Euler` - Euler angle rotation
- `Matrix2`, `Matrix3`, `Matrix4` - Matrix transformations
- `Quaternion` - Quaternion rotation
- `Sphere`, `Spherical` - Spherical coordinates and shapes
- `Plane` - Infinite plane
- `Ray` - Ray for raycasting
- `Triangle` - Triangle geometry
- `MathUtils` - Mathematical utility functions
- And more...

#### Related Modules

- [@sky-modules/three](/three) - Three.js 3D rendering with JSX support
- [@sky-modules/canvas](/canvas) - 2D canvas rendering with vector support

#### Implementation Notes

##### Architecture

The module is a thin wrapper around Three.js math library:
1. **Vector2/Vector3** are direct re-exports from `three/src/math/`
2. **Type definitions** provide full TypeScript support
3. **Global extensions** use the `globalify` utility for safe namespace pollution
4. **Zero overhead** - no additional abstractions or transformations

##### Why Three.js Math?

Three.js math classes are:
- Battle-tested in production 3D applications
- Highly optimized for performance
- Feature-complete with extensive operations
- Well-documented and maintained
- Compatible with WebGL and Canvas APIs

##### Module Structure

```
math/
├── Vector2/
│   ├── index.ts              # Re-export from three
│   └── global/
│       ├── Vector2.ts        # Global extension
│       └── index.ts
├── Vector3/
│   ├── index.ts              # Re-export from three
│   └── global/
│       ├── Vector3.ts        # Global extension
│       └── index.ts
├── three/
│   ├── Vector2.d.ts          # Type definitions
│   ├── Vector3.d.ts
│   └── ...                   # Other math types
├── global/
│   └── index.ts              # All global extensions
└── index.ts                  # Main entry point
```

##### Performance Considerations

1. **Use `lengthSq()` and `distanceToSquared()` when possible** - Avoids expensive sqrt() operation
2. **Reuse vectors** - Use `set()`, `copy()`, or modify in-place to avoid allocations
3. **Normalize sparingly** - Normalization involves division by length (sqrt + divide)
4. **Chain operations** - Methods return `this` for fluent API

##### Best Practices

```typescript
// Good - reuse vectors
const temp = new Vector3()
for (const point of points) {
    temp.copy(point).normalize()
    // use temp...
}

// Bad - create many vectors
for (const point of points) {
    const normalized = point.clone().normalize()
    // use normalized...
}

// Good - use squared distance
if (v1.distanceToSquared(v2) < threshold * threshold) {
    // ...
}

// Bad - unnecessary sqrt
if (v1.distanceTo(v2) < threshold) {
    // ...
}
```

[← Back to Table of Contents](#table-of-contents)

---


## platform

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/platform/.)

### @sky-modules/platform

Platform detection and configuration utilities for cross-platform applications.

#### Features

- **Platform Detection** - Detect runtime environment (Node.js, Web, Universal)
- **Architecture Detection** - Identify CPU architecture (arm64, x64, arm)
- **OS Detection** - Determine operating system (Mac OS, Windows, Linux, iOS, Android)
- **Side Detection** - Check if code runs on server or client side
- **Universal Router** - File-based routing with lazy loading and 404 handling

#### Platform Constants

Global constants available throughout your application:

```typescript
// Available globally
const ARCH: 'unknown' | 'arm' | 'arm64' | 'x64' | 'web'
const PLATFORM: 'unknown' | 'node' | 'mobile' | 'desktop' | 'web'
const OS: 'unknown' | 'iOS' | 'Android' | 'Mac OS' | 'Windows' | 'Linux' | 'web'
const APP_PLATFORM_TARGET: 'unknown' | 'node' | 'web' | 'universal'
```

##### Usage

```typescript
import '@sky-modules/platform'

console.log(PLATFORM) // 'node', 'web', 'mobile', 'desktop'
console.log(ARCH) // 'arm64', 'x64', 'arm', 'web'
console.log(OS) // 'Mac OS', 'Windows', 'Linux', 'web'
console.log(APP_PLATFORM_TARGET) // 'node', 'web', 'universal'
```

#### Side Detection

Determine if code is running on server or client side:

```typescript
import { runsOnSide, runsOnServerSide, runsOnClientSide } from '@sky-modules/platform'

if (runsOnServerSide) {
    // Server-side code
    console.log('Running on server')
}

if (runsOnClientSide) {
    // Client-side code
    console.log('Running in browser')
}
```

#### Universal Router

File-based routing for universal applications with lazy loading support.

##### Basic Usage

```typescript
import { UniversalRouter, createRoutesFromScreens } from '@sky-modules/platform/universal/router'

// Import all screen components
const screens = import.meta.glob('./screens/**/*.tsx', { eager: true })

// Create routes from screen files
const routes = createRoutesFromScreens(screens)

// Create router instance
const router = new UniversalRouter(routes)

// Subscribe to route changes
router.subscribe(match => {
    if (match) {
        console.log('Current route:', match.path)
        console.log('Route params:', match.params)
        console.log('Is loading:', match.isLoading)
        // Render match.Component
    }
})

// Navigate programmatically
router.navigate('/users/123')

// Clean up when done
router.destroy()
```

##### With 404 and Loading

```typescript
import NotFound from './screens/NotFound'
import Loading from './screens/Loading'

const router = new UniversalRouter(routes, {
    notFound: NotFound,
    loading: Loading
})
```

##### Lazy Loading

```typescript
// screens/users/[id].tsx - Dynamic import
export default async () => {
    const Component = await import('./HeavyComponent')
    return Component.default
}

// Or with import.meta.glob
const screens = import.meta.glob('./screens/**/*.tsx') // No eager option

const routes = createRoutesFromScreens(screens)
```

The router automatically detects lazy components by checking if calling the component returns a Promise. When a lazy component is loading:
- If a `loading` component is provided, it will be shown immediately
- The `RouteMatch` will have `isLoading: true`
- Once loaded, the component is cached and `isLoading` becomes `false`

##### File-based Routing

File structure maps to routes:

```
screens/
  index.tsx          → /
  about.tsx          → /about
  users/
    index.tsx        → /users
    [id].tsx         → /users/:id
  posts/
    [slug].tsx       → /posts/:slug
```

##### Route Parameters

```typescript
router.subscribe(match => {
    if (match) {
        // For route /users/:id
        const userId = match.params.id
        console.log('User ID:', userId)
    }
})
```

#### Platform-specific Implementations

##### Node.js

```typescript
import '@sky-modules/platform/node'

// Enables fancy console with colors
// Sets PLATFORM = 'desktop'
// Detects architecture and OS
```

##### Web

```typescript
import '@sky-modules/platform/web'

// Sets PLATFORM = 'web'
// Sets APP_PLATFORM_TARGET = 'web'
```

##### Universal

```typescript
import '@sky-modules/platform/universal'

// Detects Tauri, React Native, or Web
// Sets APP_PLATFORM_TARGET = 'universal'
```

#### Implementation Details

All platform constants are defined as non-enumerable global properties using `Object.assign(global, ...)`.

Each implementation checks if constants are already initialized before overwriting them, allowing proper layering of platform-specific code.

[← Back to Table of Contents](#table-of-contents)

---


## react

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/react/.)

React platform components and utilities for Sky Modules.

#### Overview

The React adapter provides React-specific implementations and utilities for building universal applications with Sky Modules. It includes components, Vike SSR integration, and app launchers optimized for React applications.

```bash
npm install @sky-modules/react react react-dom
```

#### Features

- **Box Component** - Universal polymorphic component with Panda CSS and Tailwind support
- **Universal App Launcher** - Bootstrap React applications with automatic routing
- **Vike Integration** - Server-side rendering and streaming
- **Type-safe** - Full TypeScript support with polymorphic types

#### Components

##### Box

Universal polymorphic component with multiple styling approaches:

```tsx
import { Box } from '@sky-modules/react'

// Panda CSS props
<Box padding="4" backgroundColor="primary.500">
  Styled with Panda
</Box>

// Tailwind classes via sx
<Box sx="hover:shadow-lg transition-all">
  Tailwind styling
</Box>

// Mixed approaches
<Box padding="4" sx="hover:bg-blue-100" className="custom">
  Combined styles
</Box>

// AsChild pattern - merge props into child
<Box asChild padding="4">
  <button>Styled button</button>
</Box>

// Polymorphic rendering
<Box as="section" padding="8">
  Semantic HTML
</Box>
```

**Features:**
- Polymorphic `as` prop for any HTML element or component
- Panda CSS props (padding, margin, colors, etc.)
- Tailwind utility classes via `sx` prop
- Standard `className` support
- `asChild` pattern for prop merging
- Full TypeScript support with type inference
- Global availability via `globalify()`

#### Universal App Launcher

##### UniversalReactAppLauncher

Bootstrap React applications with automatic routing setup.

```tsx
import UniversalReactAppLauncher from '@sky-modules/react/UniversalReactAppLauncher'

function App({ screen }) {
  return (
    <div className="app">
      <nav>Navigation</nav>
      <main>{screen}</main>
    </div>
  )
}

// Launch application
new UniversalReactAppLauncher(App)
```

**Features:**
- React 18 concurrent rendering
- Automatic `<BrowserRouter>` setup
- React Router DOM v6 integration
- Screen routing with `react-router-dom`
- Type-safe screen imports

**Requirements:**
- `<div id="root"></div>` in HTML
- `~screens/index` module exporting `RouteObject[]`
- `~project/App` module

**Global Usage:**
```tsx
import '@sky-modules/react/global/UniversalReactAppLauncher'

// Now available globally
new UniversalReactAppLauncher(App)
```

#### Vike Integration

Server-side rendering support via Vike framework.

##### Setup

```ts
// +config.ts
import reactVike from '@sky-modules/react/vike/config'

export default {
  extends: [reactVike]
}
```

##### Features

- **Streaming SSR** - HTML streaming for better performance
- **Automatic Hydration** - Seamless client-side takeover
- **React 18 Support** - Modern React features
- **Type-safe** - Full TypeScript support

##### Implementation Details

The Vike integration provides:

**Server-side (`+onRenderHtml`):**
- Renders React components to HTML stream
- Includes HTML shell with meta tags
- Sets up root and modal-root containers
- User-agent detection for SSR

**Client-side (`+onRenderClient`):**
- First render: hydrates server-rendered HTML
- Subsequent renders: updates DOM efficiently
- Console logging for debugging

#### Usage Patterns

##### Basic Application

```tsx
// main.tsx
import '@sky-modules/platform/web'
import UniversalReactAppLauncher from '@sky-modules/react/UniversalReactAppLauncher'
import App from './App'

new UniversalReactAppLauncher(App)
```

```tsx
// App.tsx
import type { FC, ReactNode } from 'react'

const App: FC<{ screen: ReactNode }> = ({ screen }) => {
  return (
    <div className="app-layout">
      <header>My App</header>
      <main>{screen}</main>
      <footer>Footer</footer>
    </div>
  )
}

export default App
```

##### With Routing

```tsx
// screens/index.ts
import { RouteObject } from 'react-router-dom'
import Home from './Home'
import About from './About'

const screens: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> }
]

export default screens
```

#### Files

##### Box.implementation.tsx

**Purpose:** Universal polymorphic Box component implementation

**Key exports:**
- `Box` - Polymorphic component with Panda CSS + Tailwind support
- `BoxProps<T>` - Polymorphic type for Box props
- `mergeBoxProps()` - Utility for merging Box props

**Features:**
- Global availability via `globalify()`
- `sx` prop for Tailwind classes
- `asChild` pattern for prop merging
- Full TypeScript support with type inference
- Combines Panda CSS, Tailwind, and standard className

##### UniversalReactAppLauncher.tsx

**Purpose:** Bootstrap React applications with automatic routing

**Key exports:**
- `UniversalReactAppLauncher` - Class for launching React apps

**Features:**
- React 18 concurrent rendering (`createRoot`)
- Automatic BrowserRouter setup
- Screen routing integration
- Type-safe App component interface

##### global/UniversalReactAppLauncher.ts

**Purpose:** Global module registration for UniversalReactAppLauncher

**Usage:**
```tsx
import '@sky-modules/react/global/UniversalReactAppLauncher'

new UniversalReactAppLauncher(App) // Now global
```

##### vike/+onRenderClient.tsx

**Purpose:** Vike client-side rendering hook

**Features:**
- Hydrates server-rendered HTML on first render
- Updates DOM on navigation
- Console logging for debugging

##### vike/+onRenderHtml.tsx

**Purpose:** Vike server-side rendering hook

**Features:**
- Streams HTML for better performance
- Includes HTML shell with meta tags
- Sets up root and modal-root containers
- User-agent detection

##### vike/config.ts

**Purpose:** Vike configuration preset for React

**Features:**
- Pre-configured SSR hooks
- Version requirements
- Extends base Vike config

##### Internal.ts

**Purpose:** Internal utilities (not for external use)

**Contents:**
- `PageContext` - React context for Vike integration

#### Peer Dependencies

- `react` ^18.0.0
- `react-dom` ^18.0.0
- `react-router-dom` ^6.0.0 (if using UniversalReactAppLauncher)
- `vike` >=0.4.182 (if using Vike integration)

#### Architecture

The React adapter is designed to:
- Provide React-specific implementations of universal components
- Bootstrap applications with minimal boilerplate
- Integrate with Sky Modules ecosystem
- Support both CSR and SSR workflows
- Offer multiple styling approaches (Panda CSS, Tailwind, CSS-in-JS)

#### Related Modules

- [@sky-modules/platform](../platform/) - Platform detection and utilities
- [@sky-modules/vike](../vike/) - Base Vike configuration
- [@sky-modules/core](../core/) - Core utilities (globalify, etc.)

#### Examples

See the [playground](../../playground/) directory for complete examples.

[← Back to Table of Contents](#table-of-contents)

---


## solid

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/solid/.)

### Solid Adapter

SolidJS platform components and utilities for Sky Modules.

#### Overview

The Solid adapter provides SolidJS-specific implementations of universal components compiled via Mitosis. Use this package to integrate Sky Modules components in Solid applications.

```bash
npm install @sky-modules/solid solid-js
```

#### Features

- **Universal Components** - Solid implementations of Sky Modules components
- **Mitosis-compiled** - Automatically generated from universal component definitions
- **Type-safe** - Full TypeScript support
- **Reactive** - Built on SolidJS fine-grained reactivity

#### Usage

##### Basic Example

```tsx
import { Component } from '@sky-modules/solid'

function App() {
  return (
    <Component>
      Content goes here
    </Component>
  )
}
```

#### Component Compilation

Components in this package are compiled from Mitosis (`.lite.tsx`) source files located in the `universal/` directory. The compilation happens automatically during build.

**Build process:**
```bash
### Compile Mitosis components to Solid
sky mitosis build <app-name>
```

#### Peer Dependencies

- `solid-js` ^1.0.0

#### Architecture

The Solid adapter is part of the Sky Modules cross-framework component system:
1. Universal components defined in Mitosis
2. Compiled to SolidJS during build
3. Published as Solid-compatible package

#### Why SolidJS?

SolidJS is used as the primary framework for:
- **Canvas JSX** - 2D canvas rendering with reactive scene graphs
- **High-performance UI** - Fine-grained reactivity without virtual DOM
- **Small bundle size** - Compiles to minimal JavaScript

#### Related Modules

- [@sky-modules/universal](../universal/) - Universal component definitions
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/vue](../vue/) - Vue adapter
- [@sky-modules/canvas](../canvas/) - Canvas JSX rendering

#### Examples

See the [playground](../../playground/) directory for complete examples.

[← Back to Table of Contents](#table-of-contents)

---


## svelte

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/svelte/.)

### Svelte Adapter

Svelte platform components and utilities for Sky Modules.

#### Overview

The Svelte adapter provides Svelte-specific implementations of universal components compiled via Mitosis. Use this package to integrate Sky Modules components in Svelte applications.

```bash
npm install @sky-modules/svelte svelte
```

#### Features

- **Universal Components** - Svelte implementations of Sky Modules components
- **Mitosis-compiled** - Automatically generated from universal component definitions
- **Type-safe** - Full TypeScript support
- **Reactive** - Built on Svelte's reactive system

#### Usage

##### Basic Example

```svelte
<script lang="ts">
  import { Component } from '@sky-modules/svelte'
</script>

<Component>
  Content goes here
</Component>
```

#### Component Compilation

Components in this package are compiled from Mitosis (`.lite.tsx`) source files located in the `universal/` directory. The compilation happens automatically during build.

**Build process:**
```bash
### Compile Mitosis components to Svelte
sky mitosis build <app-name>
```

#### Peer Dependencies

- `svelte` ^4.0.0 || ^5.0.0

#### Architecture

The Svelte adapter is part of the Sky Modules cross-framework component system:
1. Universal components defined in Mitosis
2. Compiled to Svelte during build
3. Published as Svelte-compatible package

#### Related Modules

- [@sky-modules/universal](../universal/) - Universal component definitions
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/vue](../vue/) - Vue adapter
- [@sky-modules/solid](../solid/) - Solid adapter

#### Examples

See the [playground](../../playground/) directory for complete examples.

[← Back to Table of Contents](#table-of-contents)

---


## three

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/three/.)

Three.js 3D rendering module with JSX support for declarative scene creation.

```bash
npm install @sky-modules/three
```

#### Features

- **JSX Syntax** - Declarative Three.js scene creation with React-like JSX
- **ThreeJSXRenderer** - Complete renderer with animation loop and controls
- **Automatic WebGL Setup** - No manual renderer configuration needed
- **Mouse Controls** - Built-in orbit-like camera controls
- **Animation Loop** - Automatic requestAnimationFrame management
- **Update Callbacks** - Per-object update hooks for animations
- **Shadow Support** - Built-in shadow map configuration
- **Responsive** - Automatic window resize handling

#### Usage

##### Basic Scene

```typescript
import { ThreeJSXRenderer } from '@sky-modules/three/jsx'

const renderer = new ThreeJSXRenderer()

renderer.render(
    <scene background={0x111111}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={0x00ff00} />
        </mesh>
    </scene>
)
```

##### Animated Objects

```typescript
renderer.render(
    <scene>
        <mesh
            position={[0, 0, 0]}
            onUpdate={(mesh, time, delta) => {
                // time: elapsed time in seconds
                // delta: time since last frame
                mesh.rotation.x = time
                mesh.rotation.y = time * 0.5
            }}
        >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={0xff0000} />
        </mesh>
    </scene>
)
```

##### Custom Camera

```typescript
renderer.render(
    <>
        <camera
            position={[10, 10, 10]}
            fov={60}
            lookAt={[0, 0, 0]}
        />
        <scene>
            {/* scene content */}
        </scene>
    </>
)
```

##### Complex Scene

```typescript
renderer.render(
    <scene background={0x222222} fog={{ color: 0x222222, near: 10, far: 50 }}>
        {/* Lighting */}
        <ambientLight color={0x404040} intensity={0.5} />
        <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow={true}
        />
        <pointLight
            position={[-5, 5, -5]}
            color={0xff0000}
            intensity={0.5}
            distance={20}
            decay={2}
        />

        {/* Objects */}
        <group position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
            <mesh position={[-2, 0, 0]} castShadow={true}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={0x00ff00}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>

            <mesh position={[2, 0, 0]} castShadow={true}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshPhysicalMaterial
                    color={0x0000ff}
                    transmission={0.9}
                    thickness={1}
                    roughness={0.1}
                />
            </mesh>
        </group>

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color={0x808080} />
        </mesh>

        {/* Grid helper */}
        <gridHelper />
    </scene>
)
```

##### Lines and Shapes

```typescript
renderer.render(
    <scene>
        {/* Simple line */}
        <line
            points={[
                [0, 0, 0],
                [1, 1, 0],
                [2, 0, 0]
            ]}
            color={0xff0000}
            linewidth={2}
        />

        {/* Closed loop */}
        <lineLoop
            points={[
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]}
            color={0x00ff00}
        />

        {/* Line segments */}
        <lineSegments
            points={[
                [0, 0, 0], [1, 1, 1],
                [2, 0, 0], [3, 1, 1]
            ]}
            color={0x0000ff}
        />
    </scene>
)
```

##### Lifecycle Management

```typescript
const renderer = new ThreeJSXRenderer(document.getElementById('container'))

// Render is automatic, but you can control animation loop
renderer.stop()  // Pause rendering
renderer.start() // Resume rendering

// Clean up when done
renderer.dispose() // Stop animation, clear scene, dispose WebGL resources
```

#### API

##### ThreeJSXRenderer

Main renderer class for JSX-based Three.js scenes.

**Constructor:**
```typescript
new ThreeJSXRenderer(container?: HTMLElement)
```
- `container` - HTML element to mount the canvas (default: document.body)

**Properties:**
- `scene: Three.Scene` - The Three.js scene
- `camera: Three.PerspectiveCamera` - The camera
- `renderer: Three.WebGLRenderer` - The WebGL renderer
- `clock: Three.Clock` - Clock for animation timing

**Methods:**

###### `render(element: JSX.Element | JSX.Element[])`
Renders JSX elements to the Three.js scene.

```typescript
renderer.render(<scene>...</scene>)
```

###### `start()`
Starts the animation loop. Called automatically in constructor.

###### `stop()`
Stops the animation loop to save CPU/GPU resources.

###### `dispose()`
Cleans up all resources (scene, renderer, event listeners).

##### JSX Elements

###### `<scene>`
Root scene container.

**Props:**
- `background?: string | number` - Scene background color
- `fog?: { color?: string | number; near?: number; far?: number }` - Scene fog

###### `<camera>`
Camera configuration.

**Props:**
- `position?: [number, number, number]` - Camera position
- `rotation?: [number, number, number]` - Camera rotation
- `fov?: number` - Field of view
- `aspect?: number` - Aspect ratio
- `near?: number` - Near clipping plane
- `far?: number` - Far clipping plane
- `lookAt?: [number, number, number]` - Point to look at

###### `<mesh>`
3D mesh object.

**Props:**
- `position?: [number, number, number]` - Object position
- `rotation?: [number, number, number]` - Object rotation (radians)
- `scale?: [number, number, number]` - Object scale
- `castShadow?: boolean` - Cast shadows
- `receiveShadow?: boolean` - Receive shadows
- `visible?: boolean` - Visibility
- `userData?: any` - Custom data
- `onUpdate?: (mesh: Three.Mesh, time: number, delta: number) => void` - Animation callback

**Children:** Must include one geometry and one material

###### `<group>`
Object grouping.

**Props:**
- `position?: [number, number, number]`
- `rotation?: [number, number, number]`
- `scale?: [number, number, number]`
- `visible?: boolean`

###### Lights

**`<ambientLight>`**
- `color?: string | number` - Light color (default: 0xffffff)
- `intensity?: number` - Light intensity (default: 1)

**`<directionalLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `castShadow?: boolean` - Enable shadow casting

**`<pointLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `distance?: number` - Max light distance (0 = infinite)
- `decay?: number` - Light decay rate (default: 2)

**`<spotLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `target?: [number, number, number]` - Point to illuminate
- `angle?: number` - Light cone angle (default: PI/3)
- `penumbra?: number` - Light edge softness (0-1)
- `decay?: number`
- `distance?: number`

###### Geometries

All geometries use the `args` prop for constructor arguments.

**`<boxGeometry>`**
- `args?: [width?, height?, depth?, widthSegments?, heightSegments?, depthSegments?]`

**`<sphereGeometry>`**
- `args?: [radius?, widthSegments?, heightSegments?, phiStart?, phiLength?, thetaStart?, thetaLength?]`

**`<cylinderGeometry>`**
- `args?: [radiusTop?, radiusBottom?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?]`

**`<planeGeometry>`**
- `args?: [width?, height?, widthSegments?, heightSegments?]`

**`<coneGeometry>`**
- `args?: [radius?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?]`

**`<torusGeometry>`**
- `args?: [radius?, tube?, radialSegments?, tubularSegments?, arc?]`

###### Materials

**`<meshBasicMaterial>`**
Unlit material.
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `side?: Three.Side`

**`<meshStandardMaterial>`**
Physically-based material (PBR).
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `metalness?: number` (0-1)
- `roughness?: number` (0-1)
- `emissive?: string | number`
- `emissiveIntensity?: number`
- `side?: Three.Side`

**`<meshPhongMaterial>`**
Shiny material with specular highlights.
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `shininess?: number`
- `specular?: string | number`
- `side?: Three.Side`

**`<meshPhysicalMaterial>`**
Advanced PBR material.
- All `meshStandardMaterial` props, plus:
- `clearcoat?: number` - Clearcoat layer (0-1)
- `clearcoatRoughness?: number`
- `transmission?: number` - Transparency (0-1)
- `thickness?: number` - Refraction thickness
- `ior?: number` - Index of refraction

###### Lines

**`<line>`** - Connected line segments
**`<lineLoop>`** - Closed line loop
**`<lineSegments>`** - Disconnected line segments

**Props:**
- `points?: Array<[number, number, number]>` - Line vertices
- `color?: string | number`
- `linewidth?: number` (note: may not work on all platforms)

###### Helpers

**`<gridHelper>`**
Renders a ground grid (10x10 by default).

#### Files

##### jsx.tsx

**Purpose:** Main ThreeJSXRenderer implementation
**Key Exports:**
- `ThreeJSXRenderer` - Main renderer class

**Features:**
- JSX element type definitions in global namespace
- Complete scene rendering from JSX
- Animation loop with update callbacks
- Mouse orbit controls (drag to rotate, scroll to zoom)
- Automatic resource cleanup
- Shadow mapping support
- Window resize handling

**Architecture:**
The renderer follows a virtual DOM pattern:
1. JSX elements are transformed to objects with `type`, `props`, `children`
2. `render()` clears previous scene and processes new elements
3. Elements are converted to Three.js objects and added to scene graph
4. Animation loop calls update callbacks and renders each frame
5. `dispose()` cleans up geometries, materials, and renderer

#### Related Modules

- [@sky-modules/math](/math) - Vector and matrix math utilities
- [@sky-modules/canvas](/canvas) - 2D canvas rendering
- [@sky-modules/jsx](/jsx) - Universal JSX runtime

#### Implementation Notes

##### Controls

The built-in mouse controls provide basic orbit camera functionality:
- **Left click + drag** - Rotate camera around origin
- **Mouse wheel** - Zoom in/out (scales camera distance)

The camera always looks at the origin (0, 0, 0) by default.

##### Performance

The renderer uses several optimizations:
- **Automatic cleanup** - Geometries and materials are disposed when scene is cleared
- **Update callbacks** - Only objects with `onUpdate` are tracked
- **Single animation loop** - All updates happen in one requestAnimationFrame
- **Shadow map caching** - Shadow maps are configured once at initialization

##### Limitations

1. **No texture support yet** - Materials only support colors, not texture maps
2. **Fixed shadow map size** - 2048x2048, not configurable
3. **Simple controls** - No damping, panning, or advanced orbit features
4. **No post-processing** - No bloom, SSAO, or other effects
5. **Static JSX** - No automatic reactivity, must call `render()` again for changes

##### Future Enhancements

Possible improvements:
- Texture loading and management
- Custom controls system
- Post-processing effects
- Instanced rendering support
- Reactive JSX with automatic updates
- Loading progress and error handling
- Multiple scene support
- VR/AR support

##### Best Practices

```typescript
// Good - reuse renderer
const renderer = new ThreeJSXRenderer()
function updateScene() {
    renderer.render(<scene>...</scene>)
}

// Bad - create new renderer each time
function updateScene() {
    const renderer = new ThreeJSXRenderer() // Memory leak!
    renderer.render(<scene>...</scene>)
}

// Good - use onUpdate for animations
<mesh onUpdate={(mesh, time) => {
    mesh.rotation.y = time
}}>

// Bad - mutate objects outside renderer
const mesh = new Three.Mesh()
setInterval(() => {
    mesh.rotation.y += 0.01 // Won't work with JSX renderer
}, 16)

// Good - dispose when done
useEffect(() => {
    const renderer = new ThreeJSXRenderer()
    return () => renderer.dispose()
}, [])

// Bad - forget to dispose
const renderer = new ThreeJSXRenderer()
// component unmounts - memory leak!
```

[← Back to Table of Contents](#table-of-contents)

---


## universal

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/universal/.)

### @sky-modules/universal

Framework-agnostic UI components compiled to multiple frameworks via Mitosis.

```bash
npm install @sky-modules/universal
```

#### Features

- **Write Once, Run Anywhere** - Single source compiles to React, Vue, Solid, Svelte, Qwik, and Angular
- **Mitosis-based** - Use familiar JSX syntax
- **Type-safe** - Full TypeScript support
- **Framework Output** - Automatic compilation to 6+ frameworks
- **Design System** - Integrated with Panda CSS tokens

#### How It Works

Universal components are written in Mitosis (.lite.tsx files) and automatically compiled to framework-specific implementations during build time.

```
Component.lite.tsx → Mitosis → React/Vue/Solid/Svelte/Qwik/Angular
```

#### Quick Start

##### Writing a Universal Component

```tsx
// Button.lite.tsx
import { useStore } from '@builder.io/mitosis'

export default function Button(props) {
    const state = useStore({
        count: 0
    })

    return (
        <button onClick={() => state.count++}>
            {props.label}: {state.count}
        </button>
    )
}
```

##### Using in Your Framework

After compilation, use the component in your chosen framework:

**React:**
```tsx
import { Button } from '@sky-modules/universal/react'

<Button label="Click me" />
```

**Vue:**
```vue
<script setup>
import { Button } from '@sky-modules/universal/vue'
</script>

<template>
    <Button label="Click me" />
</template>
```

**Solid:**
```tsx
import { Button } from '@sky-modules/universal/solid'

<Button label="Click me" />
```

#### Available Components

The universal module includes:

- **Popover** - Accessible popover component
- **SlotRoot** - Slot pattern implementation
- **Buttons** - Button variants and styles
- **Forms** - Form input components
- **Layout** - Layout utilities
- **Typography** - Text components

#### Component Structure

```
universal/
├── Component/
│   ├── Component.lite.tsx       # Mitosis source
│   ├── Component.lite.css       # Styles
│   └── index.lite.ts            # Exports
```

#### Compilation

Components are automatically compiled during the build process using Sky Modules CLI:

```bash
sky mitosis build <app-name>
```

Output is generated in your app's `x/` directory with framework-specific implementations.

#### Use Cases

Perfect for:

- **Component libraries** - Share components across framework projects
- **Design systems** - Maintain single source of truth
- **Multi-framework apps** - Support multiple frontend stacks
- **Migration projects** - Gradual framework transitions

#### Documentation

For Mitosis syntax, component patterns, and compilation guides, visit the [full documentation](https://empty-set-dev.github.io/sky-modules/modules/universal).

#### License

ISC License - see the [LICENSE](../LICENSE) file for details.

[← Back to Table of Contents](#table-of-contents)

---


## vike

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/vike/.)

### @sky-modules/vike

Vike SSR integration with cross-framework support via Mitosis.

```bash
npm install @sky-modules/vike
```

#### Features

- PageContext provider and hook (Mitosis-based)
- SSR control configuration
- Async data fetching during SSR

#### Modules

This package has separate modules:

- **vike/PageContext** - Context provider and hook
- **vike/config** - SSR configuration helpers
- **vike/async-data** - Server-side data fetching

#### Usage

##### PageContext

Provide and consume Vike PageContext in components:

```tsx
import PageContextProvider from '@sky-modules/vike/PageContext'
import usePageContext from '@sky-modules/vike/PageContext/usePageContext'

// In layout
export default function Layout({ pageContext, children }) {
  return (
    <PageContextProvider value={pageContext}>
      {children}
    </PageContextProvider>
  )
}

// In component
function MyComponent() {
  const pageContext = usePageContext()

  return <div>Current URL: {pageContext.urlPathname}</div>
}
```

**Global usage:**

```tsx
import '@sky-modules/vike/PageContext/global'

<PageContextProvider value={pageContext}>
  <App />
</PageContextProvider>
```

##### SSR Effect

Control SSR per-page:

```ts
// +config.ts
import ssrEffect from '@sky-modules/vike/config/ssrEffect'

export default {
  meta: {
    ssr: {
      env: { config: true },
      effect: ssrEffect
    }
  }
}
```

```ts
// +Page.ts - Disable SSR for specific page
export const ssr = false // Client-side only rendering
```

##### Async Data

Fetch data during SSR:

```ts
// +Page.ts
export const config = {
  'async-data': [
    async (pageContext, signal) => {
      const user = await fetchUser(pageContext.routeParams.id, signal)
      return { user }
    }
  ]
}

// In component
function UserPage() {
  const { data } = usePageContext()
  return <div>{data.user.name}</div>
}
```

#### API

##### PageContextProvider

Mitosis component that provides PageContext to children.

**Props:**
- `value: Vike.PageContext` - PageContext from Vike
- `children?: Mitosis.Children` - Child components

##### usePageContext()

Hook to access PageContext in components.

**Returns:** `Vike.PageContext`

##### ssrEffect

Vike config effect for SSR control.

**Parameters:**
- `configDefinedAt: string` - Config location
- `configValue: boolean` - SSR enabled/disabled

**Returns:** Meta configuration for Page environment

##### onBeforeRenderHtml

Async data fetching hook for SSR.

**Parameters:**
- `pageContext: PageContextServer` - Server-side context
- `html: string` - HTML string

**Returns:** `Promise<string>` - HTML string (unchanged)

#### Implementation Notes

- PageContext uses Mitosis context, works in all frameworks
- Components compile to React, Vue, Solid, Svelte, Qwik, Angular
- SSR effect controls client/server Page loading
- Async data runs in parallel with AbortController support
- All exports available globally via `global/` imports

#### Related Modules

- [@sky-modules/universal](../universal/) - Universal components
- [@sky-modules/platform](../platform/) - Platform detection

[← Back to Table of Contents](#table-of-contents)

---


## vue

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/vue/.)

### Vue Adapter

Vue platform components and utilities for Sky Modules.

#### Overview

The Vue adapter provides Vue-specific implementations of universal components compiled via Mitosis. Use this package to integrate Sky Modules components in Vue applications.

```bash
npm install @sky-modules/vue vue
```

#### Features

- **Universal Components** - Vue implementations of Sky Modules components
- **Mitosis-compiled** - Automatically generated from universal component definitions
- **Type-safe** - Full TypeScript support
- **Vue 3** - Built for Vue 3 Composition API

#### Usage

##### Basic Example

```vue
<script setup lang="ts">
import { Component } from '@sky-modules/vue'
</script>

<template>
  <Component>
    Content goes here
  </Component>
</template>
```

#### Component Compilation

Components in this package are compiled from Mitosis (`.lite.tsx`) source files located in the `universal/` directory. The compilation happens automatically during build.

**Build process:**
```bash
### Compile Mitosis components to Vue
sky mitosis build <app-name>
```

#### Peer Dependencies

- `vue` ^3.0.0

#### Architecture

The Vue adapter is part of the Sky Modules cross-framework component system:
1. Universal components defined in Mitosis
2. Compiled to Vue during build
3. Published as Vue-compatible package

#### Related Modules

- [@sky-modules/universal](../universal/) - Universal component definitions
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/solid](../solid/) - Solid adapter
- [@sky-modules/design](../design/) - Design system

#### Examples

See the [playground](../../playground/) directory for complete examples.

[← Back to Table of Contents](#table-of-contents)

---


## Development

```bash
# Clone the repository
git clone https://github.com/empty-set-dev/sky-modules.git
cd sky-modules

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Documentation

- 📖 [Full Documentation](https://empty-set-dev.github.io/sky-modules)
- 🎮 [Usage Examples](https://empty-set-dev.github.io/sky-modules/playground)
- 🛠️ [API Reference](https://empty-set-dev.github.io/sky-modules/modules)

## License

ISC License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Empty Set Dev
