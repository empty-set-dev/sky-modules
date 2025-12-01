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

- **design**
    - [.](#.)

- **svelte**
    - [.](#.)

- **Core Modules**
    - [.](#.)
    - [env](#env)

- **universal**
    - [.](#.)

- **vue**
    - [.](#.)

- **platform**
    - [.](#.)

- **solid**
    - [.](#.)

- **canvas**
    - [.](#.)

- **react**
    - [.](#.)


## design

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/design/.)

### Design System

Design system components, tokens, and styling utilities for Sky Modules.

#### Overview

The design module provides a comprehensive design system built on Panda CSS, including design tokens, component recipes, brand themes, and layout utilities.

#### Features

- **Design Tokens** - Colors, spacing, typography, shadows
- **Component Recipes** - Reusable style patterns
- **Brand System** - Multi-brand theming support
- **Layout Components** - Box, Layout, Grid
- **Panda CSS** - Zero-runtime CSS-in-JS
- **Type-safe** - Full TypeScript support

```bash
npm install @sky-modules/design
```

#### Structure

```
design/
├── Box/              # Universal box component
├── Layout/           # Layout components
├── Brand/            # Brand configuration
├── Design/           # Design utilities
├── DesignSystem/     # Core design system
├── brands/           # Brand themes
├── colors/           # Color palettes
├── lib/              # Utility libraries
└── recipe.ts         # Style recipes
```

#### Design Tokens

##### Colors

```typescript
import { colors } from '@sky-modules/design/colors'

// Access color palette
colors.blue[500]    // #3b82f6
colors.gray[100]    // #f3f4f6
```

##### Spacing

```typescript
import { spacing } from '@sky-modules/design'

// Consistent spacing scale
spacing[4]   // 1rem (16px)
spacing[8]   // 2rem (32px)
```

#### Components

##### Box

Universal container component with CSS-in-JS styling.

```tsx
import { Box } from '@sky-modules/design'

<Box
  styles={{
    padding: '4',
    background: 'blue.500',
    borderRadius: '8px',
    display: 'flex',
    gap: '2'
  }}
>
  Content
</Box>
```

##### Layout

Responsive layout component.

```tsx
import { Layout } from '@sky-modules/design'

<Layout
  sidebar={<Sidebar />}
  main={<Main />}
/>
```

#### Brand System

Multi-brand theming support for white-label applications.

```typescript
import { Brand } from '@sky-modules/design'

// Define brand
const myBrand = new Brand({
  name: 'MyApp',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6'
  },
  typography: {
    fontFamily: 'Inter, sans-serif'
  }
})

// Apply brand
myBrand.apply()
```

##### Brand Configuration

```typescript
interface BrandConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent?: string
    background?: string
    text?: string
  }
  typography?: {
    fontFamily?: string
    fontSize?: Record<string, string>
  }
  spacing?: Record<string, string>
  borderRadius?: Record<string, string>
}
```

#### Panda CSS Integration

The design system uses Panda CSS for styling:

```tsx
import { css } from 'styled-system/css'

<div className={css({
  padding: '4',
  bg: 'blue.500',
  color: 'white',
  borderRadius: 'md'
})}>
  Styled element
</div>
```

##### Recipes

Reusable style patterns:

```typescript
import { recipe } from '@sky-modules/design/recipe'

const buttonRecipe = recipe({
  base: {
    padding: '2 4',
    borderRadius: 'md',
    fontWeight: 'semibold'
  },
  variants: {
    variant: {
      primary: {
        bg: 'blue.500',
        color: 'white'
      },
      secondary: {
        bg: 'gray.200',
        color: 'gray.900'
      }
    },
    size: {
      sm: { fontSize: 'sm', padding: '1 3' },
      md: { fontSize: 'md', padding: '2 4' },
      lg: { fontSize: 'lg', padding: '3 6' }
    }
  }
})

// Usage
<button className={buttonRecipe({ variant: 'primary', size: 'md' })}>
  Click me
</button>
```

#### Design System API

##### DesignSystem

Core design system class:

```typescript
import { DesignSystem } from '@sky-modules/design'

const ds = new DesignSystem({
  tokens: {
    colors: { /* ... */ },
    spacing: { /* ... */ },
    typography: { /* ... */ }
  }
})

// Use design system
ds.getColor('primary')
ds.getSpacing(4)
```

#### CSS Output

The design system generates CSS files:

- `index.css` - Main stylesheet
- `tailwind-tokens.css` - Tailwind-compatible tokens
- `index.scss` - SCSS version

#### Customization

##### Custom Tokens

```typescript
import { defineConfig } from '@sky-modules/design'

export default defineConfig({
  tokens: {
    colors: {
      brand: {
        50: '#eff6ff',
        100: '#dbeafe',
        // ...
        900: '#1e3a8a'
      }
    },
    spacing: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    }
  }
})
```

##### Custom Recipes

```typescript
import { defineRecipe } from '@sky-modules/design/recipe'

export const cardRecipe = defineRecipe({
  base: {
    padding: '6',
    borderRadius: 'lg',
    boxShadow: 'md',
    background: 'white'
  },
  variants: {
    elevated: {
      true: { boxShadow: 'xl' },
      false: { boxShadow: 'none' }
    }
  }
})
```

#### Typography

##### Font Families

```typescript
fontFamily: {
  sans: 'Inter, system-ui, sans-serif',
  mono: 'JetBrains Mono, monospace',
  display: 'Cal Sans, sans-serif'
}
```

##### Font Sizes

```typescript
fontSize: {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem'
}
```

#### Best Practices

##### 1. Use Design Tokens

```tsx
// ✅ Good - uses design tokens
<Box styles={{ padding: '4', bg: 'blue.500' }} />

// ❌ Avoid - hardcoded values
<Box styles={{ padding: '16px', bg: '#3b82f6' }} />
```

##### 2. Use Recipes for Patterns

```tsx
// ✅ Good - reusable recipe
<button className={buttonRecipe({ variant: 'primary' })} />

// ❌ Avoid - inline styles
<button style={{ background: 'blue', padding: '8px' }} />
```

##### 3. Leverage Type Safety

```typescript
// ✅ Good - type-safe
<Box styles={{ bg: 'blue.500' }} /> // TypeScript autocomplete

// ❌ Avoid - string literals
<Box styles={{ background: 'blue' }} /> // No type checking
```

#### Integration with Frameworks

The design system works with all framework adapters:

```tsx
// React
import { Box } from '@sky-modules/react'

// Vue
import { Box } from '@sky-modules/vue'

// Solid
import { Box } from '@sky-modules/solid'
```

#### Related Modules

- [@sky-modules/universal](../universal/) - Universal components
- [@sky-modules/canvas](../canvas/) - Canvas rendering
- [@sky-modules/react](../react/) - React adapter

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


## Core Modules

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/core/.)

### @sky-modules/core

**Distributed Reactive Runtime** - A powerful TypeScript framework for building real-time, distributed applications with automatic state synchronization.

#### 🌟 What is Sky Core?

Sky Core is not just a utility library - it's a complete runtime system that combines:

- **Reactive Programming** (like MobX) - automatic dependency tracking
- **Network Synchronization** (like Colyseus) - efficient state sharing
- **Schema System** (like Zod) - typed data structures with reactivity
- **Serialization** - preserve class instances across network/disk

All in one seamless framework with **zero configuration**.

#### 🎯 Use Cases

Perfect for building:

- 🎮 **Multiplayer games** - sync player state in real-time
- 📝 **Collaborative editors** - like Figma, Google Docs
- 💬 **Real-time chat** - with presence and state
- 📊 **Live dashboards** - automatic updates
- 🔄 **Offline-first apps** - with automatic sync
- 🌐 **Distributed systems** - share state across servers

#### 🚀 Quick Start

```typescript
import '@sky-modules/core/define'

// Define a shared class
@define('app.User')
class User {
    @string name
    @number x = 0
    @number y = 0

    move(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }
}

// Create an instance
const user = new User()
user.name = 'Anna'

// Share it over the network
share(user, (updates, pretty) => {
    // Send updates to other clients
    websocket.send(updates)

    console.log('Changed:', pretty.set)
    // Changed: [['app.User', 123, { x: 10, y: 20 }]]
})

// Changes are automatically tracked
user.move(10, 20) // Updates sent automatically!
```

#### 🏗️ Architecture

Sky Core provides three levels of reactivity:

##### 1. Local Reactivity (like MobX)

Automatic dependency tracking and re-execution:

```typescript
@define('app.Counter')
class Counter {
    @number count = 0

    increment() {
        this.count++
    }
}

const counter = new Counter()

// Automatically tracks dependencies
reaction(() => {
    console.log('Count:', counter.count)
})

counter.increment() // Console: "Count: 1"
counter.increment() // Console: "Count: 2"
```

##### 2. Network Synchronization

Efficient state sharing across network:

```typescript
// Server
const gameState = new GameState()

share(gameState, (updates) => {
    // Broadcast only changes (not entire state!)
    clients.forEach(client => {
        client.send(updates)
    })
})

// Client
websocket.on('message', (updates) => {
    // Apply updates from server
    apply(localGameState, updates)
})
```

**Updates are optimized:**
```typescript
// Instead of sending entire object (100+ KB):
{ player: { x: 100, y: 200, health: 80, ... } }

// Send only what changed (< 1 KB):
[[UPDATE_TYPE.SET, [[playerId, [[0, 100], [1, 200]]]]]]
```

##### 3. Persistence

Serialize objects with class metadata:

```typescript
// Save to disk/database
const json = save(user)
// {
//   __class: 'app.User',
//   __id: 123,
//   name: 'Anna',
//   x: 10,
//   y: 20
// }

// Load from disk/database
const restored = load(json)
// Automatically restores User class instance!
restored instanceof User // true
restored.move(5, 5) // Works!
```

#### 📦 Core Modules

##### Public API

- **Array** - Useful array extensions (`last()`, `remove()`, `shuffle()`)
- **bind** - Automatic method binding decorator
- **mergeNamespace** - Merge object namespaces
- **not** - Type-safe null/undefined checks

##### Runtime System

- **define** - Class registry for serialization
- **plain/schema** - Typed reactive data structures
- **share/observe** - Network synchronization
- **reaction** - Dependency tracking
- **hooks** - Event middleware system
- **EventEmitter** - Type-safe events
- **globalify** - Global namespace management

#### 🎮 Example: Multiplayer Game

```typescript
@define('game.Player')
class Player {
    @string name
    @number x = 0
    @number y = 0
    @number health = 100

    move(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }

    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - amount)
    }
}

@define('game.GameState')
class GameState {
    @array(Player) players = []

    addPlayer(name: string): Player {
        const player = new Player()
        player.name = name
        this.players.push(player)
        return player
    }
}

// Server
const game = new GameState()

share(game, (updates, pretty) => {
    // Broadcast to all clients
    io.emit('game:update', updates)

    // Log for debugging
    console.log('Game updated:', pretty)
})

// Client joins
const player = game.addPlayer('Anna')
// Automatically synced to all clients!

// Player moves
player.move(10, 20)
// Only movement data sent, not entire player object
```

#### 📝 Example: Real-time Collaboration

```typescript
@define('doc.TextDocument')
class TextDocument {
    @string title = ''
    @string content = ''
    @array(User) collaborators = []

    updateContent(newContent: string) {
        this.content = newContent
    }
}

// Share document
const doc = new TextDocument()
doc.title = 'My Document'

share(doc, (updates) => {
    // Send to all collaborators
    doc.collaborators.forEach(user => {
        sendToUser(user, updates)
    })
})

// User types
doc.updateContent('Hello, world!')
// Only content change sent to other users
```

#### 🔧 Schema System

Define typed, reactive data structures:

```typescript
// Simple types
@string name
@number age
@boolean active

// Optional types
@optional.string nickname
@optional.number score

// Nullable types
@nullable.string avatar

// Objects
@object(Address) address
@array(Friend) friends

// Functions
@func onUpdate
```

Custom schemas:

```typescript
const AddressSchema = {
    street: string,
    city: string,
    country: string
}

@define('app.User')
class User {
    @string name
    @object(AddressSchema) address
}

// Type-safe!
const user = new User()
user.address = {
    street: '123 Main St',
    city: 'Moscow',
    country: 'Russia'
}
```

#### 🔍 How It Works

##### Define System

Every class/function is registered in a global registry:

```typescript
@define('app.MyClass')
class MyClass { }

// Internally stores:
{
    'app.MyClass': {
        name: 'app.MyClass',
        value: MyClass,
        [idSymbol]: 1,
        [uidSymbol]: 'app.MyClass',
        [typeSymbol]: 'class'
    }
}
```

This enables:
- Serialization with class metadata
- Hot module replacement
- Network synchronization
- Debugging and introspection

##### Reactive Properties

When you use decorators like `@string`, `@number`, they create getters/setters that:

1. Track reads (for `reaction()`)
2. Track writes (for `share()`)
3. Batch updates efficiently
4. Observe nested objects

```typescript
// This:
@number count

// Becomes:
get count() {
    // Track dependency if inside reaction()
    return this._count
}
set count(value) {
    // Notify share() listeners
    // Queue update to network
    this._count = value
}
```

##### Update Protocol

Changes are encoded efficiently:

```typescript
UpdateOfShared.Type.SET: [
    objectId,           // Which object changed
    [
        [propertyIndex, newValue],  // Which properties changed
        [propertyIndex, newValue],
    ]
]
```

Example:
```typescript
// Change: player.x = 100, player.y = 200
// Encoded as:
[UPDATE_TYPE.SET, [[playerId, [[0, 100], [1, 200]]]]]
// ~20 bytes instead of ~100+ bytes
```

#### 🎓 Best Practices

##### 1. Always use @define for shared classes

```typescript
// ✅ Good
@define('app.User')
class User { }

// ❌ Bad - can't serialize
class User { }
```

##### 2. Use typed decorators

```typescript
// ✅ Good - type-safe and reactive
@string name
@number age

// ❌ Bad - no reactivity
name: string = ''
age: number = 0
```

##### 3. Batch updates when possible

```typescript
// ✅ Good - single update
function movePlayer(dx: number, dy: number) {
    player.x += dx
    player.y += dy
} // One network update

// ❌ Bad - two updates
player.x += dx  // Network update
player.y += dy  // Another network update
```

##### 4. Use namespaces for organization

```typescript
@define('game.entities.Player')
@define('game.entities.Enemy')
@define('game.systems.Physics')
```

#### 📚 API Reference

See individual module documentation:

- [Array](./Array/Array.md) - Array extensions
- [bind](./bind/bind.md) - Method binding decorator
- [mergeNamespace](./mergeNamespace/mergeNamespace.md) - Namespace merging
- [not](./not/not.md) - Null/undefined utilities

#### 🔜 Roadmap

- [ ] DevTools Chrome extension
- [ ] React hooks integration
- [ ] Conflict resolution for offline sync
- [ ] Optimistic updates
- [ ] Time-travel debugging
- [ ] Performance profiling tools

#### 📄 License

MIT

#### 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

---

**Made with ❤️ for building real-time, distributed applications**

[← Back to Table of Contents](#table-of-contents)

---

### env

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/core/env)

Access environment variables with support for both Node.js and browser environments.

```typescript
import env from '@sky-modules/core/env'
```

#### API

##### env

An object containing environment variables accessible across all platforms.

```typescript
interface Env {}

const env: Env
```

**Type:** Extensible global interface for environment variables

**Resolution:**
- Node.js: Uses `process.env`
- Browser: Uses `import.meta.env`

#### Usage

##### Accessing Variables

```typescript
import env from '@sky-modules/core/env'

console.log(env.NODE_ENV)
console.log(env.API_URL)
console.log(env.SECRET_KEY)
```

##### Environment Detection

```typescript
import env from '@sky-modules/core/env'

const isDevelopment = env.NODE_ENV === 'development'
const apiUrl = env.API_URL || 'http://localhost:3000'
```

##### Type-safe Environment Variables

```typescript
declare global {
  interface Env {
    DATABASE_URL: string
    JWT_SECRET: string
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  }
}

import env from '@sky-modules/core/env'

const connection = connect(env.DATABASE_URL)
const secret = env.JWT_SECRET
```

[← Back to Table of Contents](#table-of-contents)

---


## universal

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/universal/.)

### Universal Components

Framework-agnostic UI components for Sky Modules, compiled to multiple frameworks via Mitosis.

#### Overview

The universal module contains component definitions written in Mitosis that compile to React, Vue, Solid, Svelte, Qwik, and Angular. Write once, run everywhere.

#### Features

- **Write Once** - Single source for all framework implementations
- **Mitosis-based** - Use familiar JSX syntax
- **Type-safe** - Full TypeScript support
- **Framework Output** - Compiles to 6+ frameworks
- **Design System** - Integrated with Panda CSS

#### Component Structure

```
universal/
├── Popover/           # Popover component
├── SlotRoot/          # Slot pattern implementation
├── Mitosis/           # Mitosis utilities
├── buttons/           # Button components
├── forms/             # Form components
├── layout/            # Layout components
└── typography/        # Typography components
```

#### Writing Universal Components

##### Basic Component

```tsx
// MyComponent.lite.tsx
import { useStore } from '@builder.io/mitosis'

export default function MyComponent(props) {
  const state = useStore({
    count: 0
  })

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => state.count++}>
        Increment
      </button>
    </div>
  )
}
```

##### With Styles

```tsx
// MyComponent.lite.tsx
import './MyComponent.lite.css'

export default function MyComponent(props) {
  return (
    <div class="my-component">
      {props.children}
    </div>
  )
}
```

```css
/* MyComponent.lite.css */
.my-component {
  padding: 1rem;
  background: #f0f0f0;
}
```

#### Compilation

Components are compiled during build time:

```bash
### Compile for specific app
sky mitosis build <app-name>

### Watch mode for development
sky mitosis dev <app-name>

### Force rebuild (ignore cache)
sky mitosis build <app-name> --force
```

#### Component Patterns

##### Props

```tsx
interface MyComponentProps {
  title: string
  onClose?: () => void
}

export default function MyComponent(props: MyComponentProps) {
  return <div>{props.title}</div>
}
```

##### State Management

```tsx
import { useStore } from '@builder.io/mitosis'

export default function Counter() {
  const state = useStore({
    count: 0,
    increment() {
      state.count++
    }
  })

  return (
    <button onClick={state.increment}>
      Count: {state.count}
    </button>
  )
}
```

##### Slots/Children

```tsx
export default function Container(props) {
  return (
    <div class="container">
      <header>{props.header}</header>
      <main>{props.children}</main>
      <footer>{props.footer}</footer>
    </div>
  )
}
```

#### Framework Output

Each framework adapter gets its own compiled version:

- **@sky-modules/react** - React components
- **@sky-modules/vue** - Vue 3 components
- **@sky-modules/solid** - SolidJS components
- **@sky-modules/svelte** - Svelte components
- **@sky-modules/qwik** - Qwik components
- **@sky-modules/angular** - Angular components

#### Design System Integration

Components integrate with Panda CSS for styling:

```tsx
import { css } from 'styled-system/css'

export default function StyledComponent() {
  return (
    <div class={css({ padding: '4', bg: 'blue.500' })}>
      Styled with Panda CSS
    </div>
  )
}
```

#### Available Components

##### Layout
- **Container** - Responsive layout container
- **Grid** - CSS Grid layout
- **Stack** - Vertical/horizontal stack

##### Forms
- **Input** - Text input field
- **Button** - Action button
- **Checkbox** - Checkbox input
- **Select** - Dropdown select

##### UI Elements
- **Popover** - Tooltip/popover overlay
- **Modal** - Dialog modal
- **Card** - Content card

#### Best Practices

##### 1. Keep Components Simple

```tsx
// ✅ Good - simple, focused
function Button(props) {
  return <button>{props.children}</button>
}

// ❌ Avoid - too complex for Mitosis
function ComplexButton(props) {
  // Heavy state management
  // Framework-specific APIs
}
```

##### 2. Use Mitosis-compatible Features

```tsx
// ✅ Good - Mitosis-compatible
const state = useStore({ count: 0 })

// ❌ Avoid - framework-specific
const [count, setCount] = useState(0) // React-specific
```

##### 3. Avoid Framework-specific APIs

```tsx
// ✅ Good - universal
<div onClick={() => handleClick()}>Click</div>

// ❌ Avoid - React-specific
<div onClick={(e) => e.preventDefault()}>Click</div>
```

#### Limitations

Mitosis has some limitations:
- No conditional hooks
- Limited ref support
- No context API (use props drilling or composition)
- No advanced lifecycle methods

See [Mitosis documentation](https://github.com/BuilderIO/mitosis) for details.

#### Related Modules

- [@sky-modules/design](../design/) - Design system and tokens
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/vue](../vue/) - Vue adapter
- [@sky-modules/solid](../solid/) - Solid adapter

#### Examples

See the [playground](../../playground/) directory for complete examples.

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


## canvas

### .

[← Back to Table of Contents](#table-of-contents) • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/canvas/.)

A 2D rendering system for drawing shapes, text, and complex graphics with HTML5 Canvas API.

```bash
npm install @sky-modules/core
```

#### Usage

```typescript
import { Canvas } from '@sky-modules/core'
```

#### Features

- **High-level drawing API** - Simplified methods for common drawing operations
- **Pixel ratio support** - Automatic scaling for high-DPI displays
- **Scene graph rendering** - Hierarchical object management
- **Material system** - Different rendering styles (fill, stroke, gradient, pattern)
- **Geometry system** - Reusable shape definitions
- **JSX support** - Declarative scene composition
- **Transform system** - Position, rotation, scale with world coordinates
- **Utility functions** - Extended drawing capabilities (hexagons, text measurement)

#### Basic Usage

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
const geometry = new RectGeometry(100, 50, 0, 0)
const material = new BasicMaterial({ color: '#ff0000' })
const mesh = new Mesh(geometry, material)

mesh.position.set(400, 300)
scene.add(mesh)

// Render
canvas.render(scene)
```

#### Canvas API

##### Constructor

```typescript
new Canvas(parameters: CanvasParameters)
```

**Parameters:**
- `size(): [number, number]` - Function returning canvas dimensions
- `canvas?: HTMLCanvasElement` - Optional existing canvas element
- `pixelRatio?: number` - Pixel ratio for high-DPI displays (default: `window.devicePixelRatio`)

##### Drawing Methods

###### Path Operations
- `beginPath()` - Start a new path
- `closePath()` - Close current path
- `moveTo(x, y)` - Move to coordinates
- `lineTo(x, y)` - Draw line to coordinates
- `arcTo(x1, y1, x2, y2, radius)` - Draw arc between points
- `arc(x, y, radius, startAngle, endAngle, counterclockwise?)` - Draw circular arc
- `ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise?)` - Draw elliptical arc
- `quadraticCurveTo(cpx, cpy, x, y)` - Draw quadratic curve
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` - Draw cubic Bézier curve
- `rect(x, y, width, height)` - Add rectangle to path

###### Fill and Stroke
- `fill()` - Fill current path
- `stroke()` - Stroke current path
- `clip()` - Use current path as clipping region

###### Rectangles
- `fillRect(x, y, width, height)` - Fill rectangle
- `strokeRect(x, y, width, height)` - Stroke rectangle
- `clearRect(x, y, width, height)` - Clear rectangle area

###### Text
- `fillText(text, x, y, maxWidth?)` - Fill text
- `strokeText(text, x, y, maxWidth?)` - Stroke text
- `measureText(text)` - Measure text dimensions

###### Transformations
- `save()` - Save current state
- `restore()` - Restore saved state
- `scale(x, y)` - Scale transformation
- `rotate(angle)` - Rotate transformation
- `translate(x, y)` - Translate transformation
- `transform(a, b, c, d, e, f)` - Apply transformation matrix
- `setTransform(a, b, c, d, e, f)` - Set transformation matrix
- `resetTransform()` - Reset to identity matrix

###### Styling
- `setFillStyle(style)` - Set fill color/gradient/pattern
- `setStrokeStyle(style)` - Set stroke color/gradient/pattern
- `setLineWidth(width)` - Set line width
- `setLineCap(cap)` - Set line cap style
- `setLineJoin(join)` - Set line join style
- `setMiterLimit(limit)` - Set miter limit
- `setLineDash(segments)` - Set line dash pattern
- `setLineDashOffset(offset)` - Set line dash offset
- `setFont(font)` - Set text font
- `setTextAlign(align)` - Set text alignment
- `setTextBaseline(baseline)` - Set text baseline
- `setGlobalAlpha(alpha)` - Set global opacity
- `setGlobalCompositeOperation(operation)` - Set blend mode

###### Shadows
- `setShadowBlur(blur)` - Set shadow blur
- `setShadowColor(color)` - Set shadow color
- `setShadowOffsetX(offset)` - Set shadow X offset
- `setShadowOffsetY(offset)` - Set shadow Y offset

###### Scene Rendering
- `render(scene)` - Render scene graph
- `clear()` - Clear entire canvas
- `onResize()` - Update canvas size

#### Utility Functions

##### drawHexagon

Draw hexagons or hexagon segments:

```typescript
canvas.drawHexagon({
    x: 100,
    y: 100,
    radius: 50,
    angle: 0,           // Optional rotation
    sides: [0, 1, 2],   // Optional: specific sides only
    color: '#ff0000',   // Optional fill color
    strokeColor: '#000', // Optional stroke color
    strokeWidth: 2      // Optional stroke width
})
```

##### measureText

Advanced text measurement with styling:

```typescript
const metrics = canvas.measureText({
    text: 'Hello World',
    font: '16px Arial',
    textAlign: 'center',    // Optional
    textBaseline: 'middle'  // Optional
})
```

#### Scene Graph

##### Scene

Root container for renderable objects:

```typescript
const scene = new Scene()
scene.setBackground('#ffffff')
scene.add(mesh)
scene.remove(mesh)
```

##### Object2D

Base class for all renderable objects:

```typescript
object.position.set(x, y)
object.rotation = angle
object.scale.set(sx, sy)
object.visible = true
object.add(child)
object.remove(child)
object.traverse(callback)
```

##### Mesh

Combines geometry and material for rendering:

```typescript
const mesh = new Mesh(geometry, material)
mesh.position.set(100, 100)
mesh.render(ctx, pixelRatio)
```

##### Group

Container for organizing objects:

```typescript
const group = new Group()
group.add(mesh1)
group.add(mesh2)
group.position.set(50, 50) // Affects all children
```

#### Geometry System

##### RectGeometry

```typescript
new RectGeometry(width, height, x?, y?)
```

##### CircleGeometry

```typescript
new CircleGeometry(radius, x?, y?, startAngle?, endAngle?, counterclockwise?)
```

##### EllipseGeometry

```typescript
new EllipseGeometry(radiusX, radiusY, x?, y?, rotation?, startAngle?, endAngle?, counterclockwise?)
```

##### PathGeometry

```typescript
const path = new PathGeometry()
path.moveTo(0, 0)
path.lineTo(100, 100)
path.quadraticCurveTo(150, 50, 200, 100)
path.closePath()
```

#### Material System

##### BasicMaterial

Solid color fill:

```typescript
new BasicMaterial({
    color: '#ff0000',
    opacity: 0.8
})
```

##### StrokeMaterial

Outline rendering:

```typescript
new StrokeMaterial({
    color: '#000000',
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
    lineDash: [5, 5],
    lineDashOffset: 0,
    opacity: 1.0
})
```

##### GradientMaterial

Gradient fill:

```typescript
const gradient = ctx.createLinearGradient(0, 0, 100, 100)
gradient.addColorStop(0, '#ff0000')
gradient.addColorStop(1, '#0000ff')

new GradientMaterial({
    gradient,
    opacity: 1.0
})
```

##### PatternMaterial

Pattern fill:

```typescript
const pattern = ctx.createPattern(image, 'repeat')

new PatternMaterial({
    pattern,
    opacity: 1.0
})
```

#### JSX Support

Declarative scene composition:

```typescript
import { CanvasJSXRenderer } from '@sky-modules/canvas'

const renderer = new CanvasJSXRenderer({
    container: document.body
})

renderer.render(
    <scene background="#f0f0f0">
        <mesh position={[400, 300]} rotation={Math.PI / 4}>
            <rectGeometry width={100} height={50} />
            <basicMaterial color="#ff0000" />
        </mesh>

        <group position={[200, 200]}>
            <mesh>
                <circleGeometry radius={25} />
                <strokeMaterial color="#0000ff" lineWidth={3} />
            </mesh>
        </group>
    </scene>
)
```

#### Pixel Ratio Handling

All coordinate values are automatically scaled by the pixel ratio:

```typescript
const canvas = new Canvas({
    size: () => [400, 300],
    pixelRatio: 2  // 2x scaling for retina displays
})

// Drawing at (100, 100) will actually draw at (200, 200) on the canvas
canvas.fillRect(100, 100, 50, 50)
```

#### Performance Tips

1. **Batch operations** - Group multiple drawing calls between save/restore
2. **Reuse objects** - Clone geometries and materials instead of creating new ones
3. **Visibility culling** - Set `visible: false` for off-screen objects
4. **Transform optimization** - Avoid unnecessary transformations
5. **Material caching** - Reuse materials with same properties

#### Browser Support

- Modern browsers with HTML5 Canvas support
- ES2015+ environment
- TypeScript 4.0+

#### Related

- [Geometry](./Geometry.md) - Shape definitions
- [Material](./Material.md) - Rendering styles
- [Object2D](./Object2D.md) - Transform system

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
