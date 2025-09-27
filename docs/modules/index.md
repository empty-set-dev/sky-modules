# Sky Modules

<div class="sky-gradient-text" style="text-align: center; font-size: 1.5em; margin: 2em 0;">
  Powerful TypeScript utility modules for modern development
</div>

## Core Modules

### mergeNamespace
**Advanced namespace merging with type safety**

The `mergeNamespace` utility provides powerful object merging capabilities while preserving function behavior and adding new properties. Perfect for configuration objects, plugin systems, and complex data structures.

[📖 Read Documentation →](/modules/core/mergeNamespace)

---

### globalify
**Global namespace integration for seamless module access**

Utility for adding modules and functions to the global scope with proper TypeScript support. Create global namespaces and seamlessly integrate your utilities.

[📖 Read Documentation →](/modules/core/globalify)

---

## Getting Started

```bash
npm install @sky-modules/core
```

```typescript
import { mergeNamespace, globalify } from '@sky-modules/core'

// Merge objects with type safety
const result = mergeNamespace(obj1, obj2)

// Add to global namespace
globalify({ myUtility: someFunction })
```

## Documentation

- 📖 [Full Documentation](https://empty-set-dev.github.io/sky-modules)
- 🎮 [Usage Examples](https://empty-set-dev.github.io/sky-modules/examples)
- 🛠️ [API Reference](https://empty-set-dev.github.io/sky-modules/modules)
- 🔗 [GitHub Repository](https://github.com/empty-set-dev/sky-modules)

## License

ISC License - see the [LICENSE](https://github.com/empty-set-dev/sky-modules/blob/main/LICENSE) file for details.