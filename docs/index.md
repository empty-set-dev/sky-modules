---
layout: home

hero:
  name: "Sky Modules"
  text: "TypeScript Utilities"
  tagline: "Powerful, type-safe utility modules for modern development"
  image:
    src: /logo.svg
    alt: Sky Modules
  actions:
    - theme: brand
      text: View Modules
      link: /modules/
    - theme: alt
      text: View on GitHub
      link: https://github.com/empty-set-dev/sky-modules

features:
  - icon: 🚀
    title: Modern TypeScript
    details: Built with cutting-edge TypeScript features, providing excellent type safety and developer experience.

  - icon: 🎯
    title: Modular Architecture
    details: Each module is independent and can be used separately. Install only what you need.

  - icon: 🌐
    title: Global Integration
    details: Seamlessly integrate with global namespace or use as ES modules. Your choice.

  - icon: 📦
    title: Zero Dependencies
    details: Lightweight modules with no external dependencies. Perfect for any project size.

  - icon: ⚡
    title: High Performance
    details: Optimized for speed and efficiency. Minimal runtime overhead.

  - icon: 🛠️
    title: Developer Friendly
    details: Excellent IntelliSense support, comprehensive docs, and live playground.

  - icon: 🔧
    title: Build Tools
    details: Includes powerful CLI tools for deployment, testing, and development workflows.

  - icon: 🎨
    title: Customizable
    details: Flexible configuration options to adapt to your project's specific needs.

  - icon: 📚
    title: Rich Documentation
    details: Comprehensive guides, API references, and interactive playground for every module.
---

<div class="sky-gradient-text" style="text-align: center; font-size: 1.5em; margin: 2em 0;">
  Start building amazing TypeScript applications today!
</div>

## Quick Start

```bash
# Install core utilities
npm install @sky-modules/core
```

```typescript
import { mergeNamespace, globalify } from '@sky-modules/core'

// Merge objects with type safety
const result = mergeNamespace(obj1, obj2)

// Add to global namespace
globalify({ myUtility: someFunction })
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
- **Documentation-first** - Interactive playground and detailed API docs

Ready to get started? [Browse modules →](/modules/)