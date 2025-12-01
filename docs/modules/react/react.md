# React

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  React utility module
</div>

React platform components and utilities for Sky Modules.

## Overview

The React adapter provides React-specific implementations and utilities for building universal applications with Sky Modules. It includes components, Vike SSR integration, and app launchers optimized for React applications.

## Installation

```bash
npm install @sky-modules/react react react-dom
```

## Features

- **Box Component** - Universal polymorphic component with Panda CSS and Tailwind support
- **Universal App Launcher** - Bootstrap React applications with automatic routing
- **Vike Integration** - Server-side rendering and streaming
- **Type-safe** - Full TypeScript support with polymorphic types

## Components

### Box

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

## Universal App Launcher

### UniversalReactAppLauncher

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

## Vike Integration

Server-side rendering support via Vike framework.

### Setup

```ts
// +config.ts
import reactVike from '@sky-modules/react/vike/config'

export default {
  extends: [reactVike]
}
```

### Features

- **Streaming SSR** - HTML streaming for better performance
- **Automatic Hydration** - Seamless client-side takeover
- **React 18 Support** - Modern React features
- **Type-safe** - Full TypeScript support

### Implementation Details

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

## Usage Patterns

### Basic Application

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

### With Routing

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

## Files

### Box.implementation.tsx

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

### UniversalReactAppLauncher.tsx

**Purpose:** Bootstrap React applications with automatic routing

**Key exports:**
- `UniversalReactAppLauncher` - Class for launching React apps

**Features:**
- React 18 concurrent rendering (`createRoot`)
- Automatic BrowserRouter setup
- Screen routing integration
- Type-safe App component interface

### global/UniversalReactAppLauncher.ts

**Purpose:** Global module registration for UniversalReactAppLauncher

**Usage:**
```tsx
import '@sky-modules/react/global/UniversalReactAppLauncher'

new UniversalReactAppLauncher(App) // Now global
```

### vike/+onRenderClient.tsx

**Purpose:** Vike client-side rendering hook

**Features:**
- Hydrates server-rendered HTML on first render
- Updates DOM on navigation
- Console logging for debugging

### vike/+onRenderHtml.tsx

**Purpose:** Vike server-side rendering hook

**Features:**
- Streams HTML for better performance
- Includes HTML shell with meta tags
- Sets up root and modal-root containers
- User-agent detection

### vike/config.ts

**Purpose:** Vike configuration preset for React

**Features:**
- Pre-configured SSR hooks
- Version requirements
- Extends base Vike config

### Internal.ts

**Purpose:** Internal utilities (not for external use)

**Contents:**
- `PageContext` - React context for Vike integration

## Peer Dependencies

- `react` ^18.0.0
- `react-dom` ^18.0.0
- `react-router-dom` ^6.0.0 (if using UniversalReactAppLauncher)
- `vike` >=0.4.182 (if using Vike integration)

## Architecture

The React adapter is designed to:
- Provide React-specific implementations of universal components
- Bootstrap applications with minimal boilerplate
- Integrate with Sky Modules ecosystem
- Support both CSR and SSR workflows
- Offer multiple styling approaches (Panda CSS, Tailwind, CSS-in-JS)

## Related Modules

- [@sky-modules/platform](../platform/) - Platform detection and utilities
- [@sky-modules/vike](../vike/) - Base Vike configuration
- [@sky-modules/core](../core/) - Core utilities (globalify, etc.)

## Examples

See the [playground](../../playground/) directory for complete examples.
