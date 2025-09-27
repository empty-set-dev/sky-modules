# Modules Overview

<div class="sky-gradient-text" style="text-align: center; font-size: 1.3em; margin: 1.5em 0;">
  Discover powerful TypeScript utilities
</div>

Sky Modules provides a comprehensive collection of utility functions designed for modern TypeScript development. Each module is carefully crafted to be:

- **Type-safe** with full TypeScript support
- **Independently usable** with tree-shaking support
- **Well-documented** with live examples
- **Production-ready** with comprehensive testing

## Core Modules

### Essential Utilities

#### [mergeNamespace](/modules/core/mergeNamespace)
Advanced namespace merging with complete type safety. Perfect for configuration objects and complex data structures.

```typescript
import { mergeNamespace } from '@sky-modules/core'

const target = { func: () => 'hello' }
const source = { func: { newProp: 'world' } }

mergeNamespace(target, source)
// target.func() → 'hello'
// target.func.newProp → 'world'
```

#### [globalify](/modules/core/globalify)
Seamless global namespace integration. Add your utilities to the global scope with TypeScript support.

```typescript
import { globalify } from '@sky-modules/core'

globalify({
  myUtility: (x: number) => x * 2,
  config: { debug: true }
})

// Now available globally
declare global {
  const myUtility: (x: number) => number
  const config: { debug: boolean }
}
```

#### [canClone](/modules/core/canClone)
Check if objects can be safely cloned with `structuredClone`. Essential for modern JavaScript applications.

```typescript
import { canClone } from '@sky-modules/core'

const obj = { data: [1, 2, 3] }
const func = () => 'hello'

canClone(obj)  // → true
canClone(func) // → false
```

## Installation

Install the entire core package:

```bash
npm install @sky-modules/core
```

Or install individual modules:

```bash
npm install @sky-modules/core/mergeNamespace
npm install @sky-modules/core/globalify
npm install @sky-modules/core/canClone
```

## TypeScript Support

All modules include comprehensive TypeScript definitions:

```typescript
// Full IntelliSense support
import { mergeNamespace } from '@sky-modules/core'

// Type-safe operations
const result = mergeNamespace(
  { name: 'John', age: 30 },
  { name: { first: 'John', last: 'Doe' } }
)

// result.name() → 'John'
// result.name.first → 'John'
// result.age → 30
```

## Performance

Sky Modules are optimized for performance:

- **Zero dependencies** - minimal bundle size
- **Tree-shakable** - only import what you use
- **Optimized algorithms** - efficient implementations
- **Memory efficient** - minimal runtime overhead

## Testing

All modules include comprehensive test coverage:

- Unit tests with 100% coverage
- Integration tests
- Mutation testing with Stryker
- Performance benchmarks

## Contributing

Want to contribute? Check out our [contribution guidelines](https://github.com/empty-set-games/sky-modules/blob/main/CONTRIBUTING.md).

- [Report issues](https://github.com/empty-set-games/sky-modules/issues)
- [Submit pull requests](https://github.com/empty-set-games/sky-modules/pulls)
- [Join discussions](https://github.com/empty-set-games/sky-modules/discussions)