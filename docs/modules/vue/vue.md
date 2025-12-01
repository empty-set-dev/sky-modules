# Vue Adapter

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Vue utility module
</div>

<PlaygroundLink id="vue" label="Open Vue Playground" />


Vue platform components and utilities for Sky Modules.

## Overview

The Vue adapter provides Vue-specific implementations of universal components compiled via Mitosis. Use this package to integrate Sky Modules components in Vue applications.

## Installation

```bash
npm install @sky-modules/vue vue
```

## Features

- **Universal Components** - Vue implementations of Sky Modules components
- **Mitosis-compiled** - Automatically generated from universal component definitions
- **Type-safe** - Full TypeScript support
- **Vue 3** - Built for Vue 3 Composition API

## Usage

### Basic Example

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

## Component Compilation

Components in this package are compiled from Mitosis (`.lite.tsx`) source files located in the `universal/` directory. The compilation happens automatically during build.

**Build process:**
```bash
# Compile Mitosis components to Vue
sky mitosis build <app-name>
```

## Peer Dependencies

- `vue` ^3.0.0

## Architecture

The Vue adapter is part of the Sky Modules cross-framework component system:
1. Universal components defined in Mitosis
2. Compiled to Vue during build
3. Published as Vue-compatible package

## Related Modules

- [@sky-modules/universal](../universal/) - Universal component definitions
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/solid](../solid/) - Solid adapter
- [@sky-modules/design](../design/) - Design system

## Examples

See the [playground](../../playground/) directory for complete examples.
