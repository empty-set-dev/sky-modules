# Getting Started

Welcome to Sky Modules - a universal TypeScript framework for building cross-platform applications with a modular architecture.

## Quick Start

### Installation

Install Sky Modules from npm:

```bash
npm install @sky-modules/core
```

### Basic Usage

Import the modules you need:

```typescript
import '@sky-modules/core/Array'
import { mergeNamespace } from '@sky-modules/core'

// Use Array extensions
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.last()) // 5

// Shuffle array
numbers.shuffle()
```

## Core Concepts

### Modular Architecture

Sky Modules is built on a modular architecture where each module provides specific functionality:

- **Core Modules**: Fundamental utilities and helpers
- **Design System**: UI components and design tokens
- **Framework Integrations**: Cross-framework components (React, Vue, Solid, Svelte, Qwik, Angular)
- **Platform Modules**: Platform-specific utilities

### Cross-Platform Support

Build once, run everywhere:

- **Web**: Browser applications with Vike
- **Node**: Server-side applications with Bun
- **Desktop**: Native apps with Tauri
- **Mobile**: iOS and Android with Expo

## Next Steps

- Browse [Modules](/modules/) to explore available functionality
- Check out [Playground](/playground/) for interactive examples
- View packages on [NPM](https://npmjs.com/~sky-modules)

## CLI Commands

Sky Modules comes with a powerful CLI:

```bash
# Development
sky web dev <app-name>          # Start web dev server
sky node dev <app-name>         # Start node dev server
sky desktop dev <app-name>      # Start desktop app

# Building
sky web build <app-name>        # Build for production
sky desktop build <app-name>    # Build desktop app

# Testing
sky test                        # Run all tests
sky test <folder>              # Run specific tests

# Type checking
sky check                       # Check all modules
sky check <module-name>        # Check specific module
```

## Project Structure

```
project/
├── .sky/
│   └── sky.config.ts          # Project configuration
├── apps/
│   ├── web/                   # Web applications
│   ├── node/                  # Node applications
│   └── desktop/               # Desktop applications
└── modules/
    ├── core/                  # Core utilities
    ├── design/                # Design system
    └── universal/             # Universal components
```

## Community

- [GitHub](https://github.com/empty-set-dev/sky-modules)
- [NPM](https://npmjs.com/~sky-modules)
- [Issues](https://github.com/empty-set-dev/sky-modules/issues)
