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

- **platform**
    - [.](#.)

- **react**
    - [.](#.)

- **solid**
    - [.](#.)

- **svelte**
    - [.](#.)

- **universal**
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


## platform

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/platform/.)

### Platform Module

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

### React Adapter

React platform components and utilities for Sky Modules.

#### Overview

The React adapter provides React-specific implementations and utilities for building universal applications with Sky Modules. It includes components, hooks, and app launchers optimized for React applications.

```bash
npm install @sky-modules/react react react-dom
```

#### Features

- **Box Component** - React implementation of the universal Box component
- **Universal App Launcher** - Boot React applications with routing
- **Vike Integration** - Server-side rendering with Vike
- **Type-safe** - Full TypeScript support

#### Components

##### Box

React implementation of the universal Box component with CSS-in-JS styling.

```tsx
import { Box } from '@sky-modules/react'

function MyComponent() {
  return (
    <Box
      styles={{
        padding: '20px',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}
    >
      Content goes here
    </Box>
  )
}
```

#### Universal App Launcher

##### UniversalReactAppLauncher

Bootstrap React applications with automatic routing setup.

```tsx
import UniversalReactAppLauncher from '@sky-modules/react/UniversalReactAppLauncher'
import '@sky-modules/react/UniversalReactAppLauncher.global'

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
- Automatic `<BrowserRouter>` setup
- Screen routing with `react-router-dom`
- Type-safe screen imports
- Root element mounting

**Requirements:**
- `<div id="root"></div>` in HTML
- `~screens/index` module with routes
- `~project/App` module

#### Vike Integration

Server-side rendering support via Vike.

```tsx
import '@sky-modules/react/vike'
```

See [vike documentation](./vike/README.md) for details.

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

#### Peer Dependencies

- `react` ^18.0.0
- `react-dom` ^18.0.0
- `react-router-dom` ^6.0.0 (if using UniversalReactAppLauncher)

#### Architecture

The React adapter is designed to:
- Provide React-specific implementations of universal components
- Bootstrap applications with minimal boilerplate
- Integrate with Sky Modules ecosystem
- Support both CSR and SSR workflows

#### Related Modules

- [@sky-modules/universal](../universal/) - Universal components (framework-agnostic)
- [@sky-modules/platform](../platform/) - Platform detection and utilities
- [@sky-modules/design](../design/) - Design system components

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
