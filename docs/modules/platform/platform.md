# @sky-modules/platform

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Platform utility module
</div>

Platform detection and configuration utilities for cross-platform applications.


## Installation

```bash
npm install @sky-modules/core
```

## Features

- **Platform Detection** - Detect runtime environment (Node.js, Web, Universal)
- **Architecture Detection** - Identify CPU architecture (arm64, x64, arm)
- **OS Detection** - Determine operating system (Mac OS, Windows, Linux, iOS, Android)
- **Side Detection** - Check if code runs on server or client side
- **Universal Router** - File-based routing with lazy loading and 404 handling

## Platform Constants

Global constants available throughout your application:

```typescript
// Available globally
const ARCH: 'unknown' | 'arm' | 'arm64' | 'x64' | 'web'
const PLATFORM: 'unknown' | 'node' | 'mobile' | 'desktop' | 'web'
const OS: 'unknown' | 'iOS' | 'Android' | 'Mac OS' | 'Windows' | 'Linux' | 'web'
const APP_PLATFORM_TARGET: 'unknown' | 'node' | 'web' | 'universal'
```

### Usage

```typescript
import '@sky-modules/platform'

console.log(PLATFORM) // 'node', 'web', 'mobile', 'desktop'
console.log(ARCH) // 'arm64', 'x64', 'arm', 'web'
console.log(OS) // 'Mac OS', 'Windows', 'Linux', 'web'
console.log(APP_PLATFORM_TARGET) // 'node', 'web', 'universal'
```

## Side Detection

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

## Universal Router

File-based routing for universal applications with lazy loading support.

### Basic Usage

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

### With 404 and Loading

```typescript
import NotFound from './screens/NotFound'
import Loading from './screens/Loading'

const router = new UniversalRouter(routes, {
    notFound: NotFound,
    loading: Loading
})
```

### Lazy Loading

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

### File-based Routing

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

### Route Parameters

```typescript
router.subscribe(match => {
    if (match) {
        // For route /users/:id
        const userId = match.params.id
        console.log('User ID:', userId)
    }
})
```

## Platform-specific Implementations

### Node.js

```typescript
import '@sky-modules/platform/node'

// Enables fancy console with colors
// Sets PLATFORM = 'desktop'
// Detects architecture and OS
```

### Web

```typescript
import '@sky-modules/platform/web'

// Sets PLATFORM = 'web'
// Sets APP_PLATFORM_TARGET = 'web'
```

### Universal

```typescript
import '@sky-modules/platform/universal'

// Detects Tauri, React Native, or Web
// Sets APP_PLATFORM_TARGET = 'universal'
```

## Implementation Details

All platform constants are defined as non-enumerable global properties using `Object.assign(global, ...)`.

Each implementation checks if constants are already initialized before overwriting them, allowing proper layering of platform-specific code.
