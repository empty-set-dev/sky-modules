# @sky-modules/jsx

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  JSX utility module
</div>

<div style="margin-bottom: 2em;">
  📚 <a href="../">← Back to All Modules</a>
</div>


Universal JSX runtime for framework-agnostic component development. This package provides a custom JSX implementation that enables writing universal components that can work across different JavaScript frameworks.

## Features

- 🌐 **Universal Components**: Write components once, use everywhere
- 🔧 **Custom JSX Runtime**: Lightweight JSX implementation without React dependency
- 📦 **TypeScript Support**: Full type safety with custom JSX types
- ⚡ **Framework Agnostic**: Works with any framework that supports custom JSX
- 🎯 **UC Type**: Special Universal Component type for maximum compatibility

## Installation

```bash
npm install @sky-modules/jsx
```

## Usage

### Basic JSX Component

```tsx
/** @jsxImportSource universal-jsx-component */

export default function MyComponent(): UC {
    return <div>Hello, Universal JSX!</div>
}
```

### TypeScript Configuration

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "sky/jsx"
  }
}
```

### Global Types

The package provides global types for universal components:

```typescript
// UC type is available globally
type UC = JSX.Node

// JSX namespace is extended
namespace JSX {
    type Node = string | Element | Element[]

    interface Element {
        type: string | Function
        key: string
        props: Record<string, unknown>
        children?: Node
    }
}
```

## API Reference

### jsx(type, props)

Core JSX runtime function for production builds.

```typescript
import { jsx } from 'universal-jsx-component/jsx-runtime'

const element = jsx('div', {
    className: 'container',
    children: 'Hello World'
})
```

**Parameters:**
- `type` - Element type (string or function)
- `props` - Element properties including children

**Returns:** `JSX.Element`

### jsxDEV(type, props)

Development version of JSX runtime with additional debugging features.

```typescript
import { jsxDEV } from 'universal-jsx-component/jsx-dev-runtime'

const element = jsxDEV('div', {
    className: 'container',
    children: 'Hello World'
})
```

### Fragment

JSX Fragment implementation for grouping elements.

```tsx
/** @jsxImportSource universal-jsx-component */

export default function MyComponent(): UC {
    return (
        <>
            <div>First element</div>
            <div>Second element</div>
        </>
    )
}
```

## Element Structure

JSX elements are transformed into the following structure:

```typescript
interface JSX.Element {
    type: string | Function    // Element type
    props: Record<string, unknown>  // Properties (excluding children)
    children: JSX.Element[]    // Child elements array
}
```

## Examples

### Simple Component

```tsx
/** @jsxImportSource universal-jsx-component */

export default function Button({ text, onClick }: {
    text: string
    onClick?: () => void
}): UC {
    return <button onClick={onClick}>{text}</button>
}
```

### Component with Children

```tsx
/** @jsxImportSource universal-jsx-component */

export default function Card({ children }: { children: UC }): UC {
    return (
        <div className="card">
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}
```

### Using Fragment

```tsx
/** @jsxImportSource universal-jsx-component */

export default function List({ items }: { items: string[] }): UC {
    return (
        <>
            {items.map(item => (
                <div key={item}>{item}</div>
            ))}
        </>
    )
}
```

## Framework Integration

### With React

```tsx
// React component using universal JSX
import UniversalComponent from './UniversalComponent'

function ReactApp() {
    return (
        <div>
            <UniversalComponent />
        </div>
    )
}
```

### With Any Custom Renderer

```typescript
import { jsx } from 'universal-jsx-component/jsx-runtime'

// Custom renderer for JSX elements
function render(element: JSX.Element): string {
    if (typeof element.type === 'string') {
        const attrs = Object.entries(element.props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')

        const children = element.children?.map(render).join('') || ''

        return `<${element.type} ${attrs}>${children}</${element.type}>`
    }

    return ''
}
```

## Development vs Production

The package includes both development and production runtimes:

- **jsx-runtime.ts**: Production runtime (smaller, optimized)
- **jsx-dev-runtime.ts**: Development runtime (includes Fragment and debugging features)

TypeScript automatically chooses the appropriate runtime based on your build configuration.

## Type Safety

All components using `sky/jsx` should return the `UC` type:

```tsx
/** @jsxImportSource universal-jsx-component */

// ✅ Correct
export default function GoodComponent(): UC {
    return <div>Content</div>
}

// ❌ Avoid - not type-safe
export default function BadComponent() {
    return <div>Content</div>
}
```

## License

MIT License - see LICENSE file for details.