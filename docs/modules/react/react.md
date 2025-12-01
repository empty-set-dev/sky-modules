# React Adapter

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  React utility module
</div>

React platform components and utilities for Sky Modules.

## Overview

The React adapter provides React-specific implementations and utilities for building universal applications with Sky Modules. It includes components, hooks, and app launchers optimized for React applications.

## Installation

```bash
npm install @sky-modules/react react react-dom
```

## Features

- **Box Component** - React implementation of the universal Box component
- **Universal App Launcher** - Boot React applications with routing
- **Vike Integration** - Server-side rendering with Vike
- **Type-safe** - Full TypeScript support

## Components

### Box

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

## Universal App Launcher

### UniversalReactAppLauncher

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

## Vike Integration

Server-side rendering support via Vike.

```tsx
import '@sky-modules/react/vike'
```

See [vike documentation](./vike/README.md) for details.

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

## Peer Dependencies

- `react` ^18.0.0
- `react-dom` ^18.0.0
- `react-router-dom` ^6.0.0 (if using UniversalReactAppLauncher)

## Architecture

The React adapter is designed to:
- Provide React-specific implementations of universal components
- Bootstrap applications with minimal boilerplate
- Integrate with Sky Modules ecosystem
- Support both CSR and SSR workflows

## Related Modules

- [@sky-modules/universal](../universal/) - Universal components (framework-agnostic)
- [@sky-modules/platform](../platform/) - Platform detection and utilities
- [@sky-modules/design](../design/) - Design system components

## Examples

See the [playground](../../playground/) directory for complete examples.
