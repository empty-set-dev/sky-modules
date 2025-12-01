# Solid Adapter

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Solid utility module
</div>

SolidJS platform components and utilities for Sky Modules.

## Overview

The Solid adapter provides SolidJS-specific implementations of universal components compiled via Mitosis. Use this package to integrate Sky Modules components in Solid applications.

## Installation

```bash
npm install @sky-modules/solid solid-js
```

## Features

- **Universal Components** - Solid implementations of Sky Modules components
- **Mitosis-compiled** - Automatically generated from universal component definitions
- **Type-safe** - Full TypeScript support
- **Reactive** - Built on SolidJS fine-grained reactivity

## Usage

### Basic Example

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

## Component Compilation

Components in this package are compiled from Mitosis (`.lite.tsx`) source files located in the `universal/` directory. The compilation happens automatically during build.

**Build process:**
```bash
# Compile Mitosis components to Solid
sky mitosis build <app-name>
```

## Peer Dependencies

- `solid-js` ^1.0.0

## Architecture

The Solid adapter is part of the Sky Modules cross-framework component system:
1. Universal components defined in Mitosis
2. Compiled to SolidJS during build
3. Published as Solid-compatible package

## Why SolidJS?

SolidJS is used as the primary framework for:
- **Canvas JSX** - 2D canvas rendering with reactive scene graphs
- **High-performance UI** - Fine-grained reactivity without virtual DOM
- **Small bundle size** - Compiles to minimal JavaScript

## Related Modules

- [@sky-modules/universal](../universal/) - Universal component definitions
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/vue](../vue/) - Vue adapter
- [@sky-modules/canvas](../canvas/) - Canvas JSX rendering

## Examples

See the [playground](../../playground/) directory for complete examples.
