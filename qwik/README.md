# Qwik Adapter

Qwik platform components and utilities for Sky Modules.

## Overview

The Qwik adapter provides Qwik-specific implementations of universal components compiled via Mitosis. Use this package to integrate Sky Modules components in Qwik applications.

## Installation

```bash
npm install @sky-modules/qwik @builder.io/qwik
```

## Features

- **Universal Components** - Qwik implementations of Sky Modules components
- **Mitosis-compiled** - Automatically generated from universal component definitions
- **Type-safe** - Full TypeScript support
- **Resumable** - Built on Qwik's resumability paradigm

## Usage

### Basic Example

```tsx
import { component$ } from '@builder.io/qwik'
import { Component } from '@sky-modules/qwik'

export default component$(() => {
  return (
    <Component>
      Content goes here
    </Component>
  )
})
```

## Component Compilation

Components in this package are compiled from Mitosis (`.lite.tsx`) source files located in the `universal/` directory. The compilation happens automatically during build.

**Build process:**
```bash
# Compile Mitosis components to Qwik
sky mitosis build <app-name>
```

## Peer Dependencies

- `@builder.io/qwik` ^1.0.0

## Architecture

The Qwik adapter is part of the Sky Modules cross-framework component system:
1. Universal components defined in Mitosis
2. Compiled to Qwik during build
3. Published as Qwik-compatible package

## Why Qwik?

Qwik's resumability makes it ideal for:
- **Instant page loads** - Zero hydration overhead
- **Progressive interactivity** - Load code only when needed
- **Edge-first** - Optimized for edge deployment

## Related Modules

- [@sky-modules/universal](../universal/) - Universal component definitions
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/vue](../vue/) - Vue adapter
- [@sky-modules/solid](../solid/) - Solid adapter

## Examples

See the [playground](../../playground/) directory for complete examples.
