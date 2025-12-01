# Svelte Adapter

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Svelte utility module
</div>

Svelte platform components and utilities for Sky Modules.

## Overview

The Svelte adapter provides Svelte-specific implementations of universal components compiled via Mitosis. Use this package to integrate Sky Modules components in Svelte applications.

## Installation

```bash
npm install @sky-modules/svelte svelte
```

## Features

- **Universal Components** - Svelte implementations of Sky Modules components
- **Mitosis-compiled** - Automatically generated from universal component definitions
- **Type-safe** - Full TypeScript support
- **Reactive** - Built on Svelte's reactive system

## Usage

### Basic Example

```svelte
<script lang="ts">
  import { Component } from '@sky-modules/svelte'
</script>

<Component>
  Content goes here
</Component>
```

## Component Compilation

Components in this package are compiled from Mitosis (`.lite.tsx`) source files located in the `universal/` directory. The compilation happens automatically during build.

**Build process:**
```bash
# Compile Mitosis components to Svelte
sky mitosis build <app-name>
```

## Peer Dependencies

- `svelte` ^4.0.0 || ^5.0.0

## Architecture

The Svelte adapter is part of the Sky Modules cross-framework component system:
1. Universal components defined in Mitosis
2. Compiled to Svelte during build
3. Published as Svelte-compatible package

## Related Modules

- [@sky-modules/universal](../universal/) - Universal component definitions
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/vue](../vue/) - Vue adapter
- [@sky-modules/solid](../solid/) - Solid adapter

## Examples

See the [playground](../../playground/) directory for complete examples.
