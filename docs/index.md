---
layout: home

hero:
  name: "Sky Modules"
  text: "Powerful TypeScript utilities for modern development"
  tagline: Modular, type-safe, and globally accessible utility functions
  image:
    src: /logo.svg
    alt: Sky Modules Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/empty-set-games/sky-modules
    - theme: alt
      text: Browse Modules
      link: /modules/

features:
  - icon: 🚀
    title: Type-Safe Modules
    details: Full TypeScript support with advanced type safety and IntelliSense
  - icon: 🌐
    title: Global Integration
    details: Seamlessly integrate utilities into global namespace for universal access
  - icon: 📦
    title: Modular Architecture
    details: Import only what you need with tree-shaking support
  - icon: 🔧
    title: Developer Experience
    details: Built with modern tooling - Vite, ESM, and comprehensive testing
  - icon: 🎯
    title: Production Ready
    details: Battle-tested utilities used in real-world applications
  - icon: 📚
    title: Comprehensive Docs
    details: Live examples, interactive playground, and detailed API documentation
---

## Quick Start

Install any Sky module from npm:

```bash
npm install @sky-modules/core/mergeNamespace
```

Use it in your project:

```typescript
import mergeNamespace from '@sky-modules/core/mergeNamespace'

const target = { func: () => 'hello' }
const source = { func: { newProp: 'world' } }

mergeNamespace(target, source)
// target.func() → 'hello'
// target.func.newProp → 'world'
```

## Featured Modules

::: tip Core Utilities
Essential utilities for object manipulation, namespace merging, and type checking
:::

::: tip React Components
Modern React hooks and components with TypeScript support
:::

::: tip Math & Algorithms
High-performance mathematical functions and algorithm implementations
:::

## Why Sky Modules?

Sky Modules provides a curated collection of utility functions designed for modern TypeScript applications. Each module is:

- **Independently publishable** - Use only what you need
- **Globally accessible** - Optional global namespace integration
- **Type-safe** - Full TypeScript support with strict typing
- **Well-tested** - Comprehensive test coverage with mutation testing
- **Documentation-first** - Interactive examples and detailed API docs

Ready to get started? [Install your first module →](/guide/installation)