# Universal Components

Framework-agnostic UI components for Sky Modules, compiled to multiple frameworks via Mitosis.

## Overview

The universal module contains component definitions written in Mitosis that compile to React, Vue, Solid, Svelte, Qwik, and Angular. Write once, run everywhere.

## Features

- **Write Once** - Single source for all framework implementations
- **Mitosis-based** - Use familiar JSX syntax
- **Type-safe** - Full TypeScript support
- **Framework Output** - Compiles to 6+ frameworks
- **Design System** - Integrated with Panda CSS

## Component Structure

```
universal/
├── Popover/           # Popover component
├── SlotRoot/          # Slot pattern implementation
├── Mitosis/           # Mitosis utilities
├── buttons/           # Button components
├── forms/             # Form components
├── layout/            # Layout components
└── typography/        # Typography components
```

## Writing Universal Components

### Basic Component

```tsx
// MyComponent.lite.tsx
import { useStore } from '@builder.io/mitosis'

export default function MyComponent(props) {
  const state = useStore({
    count: 0
  })

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => state.count++}>
        Increment
      </button>
    </div>
  )
}
```

### With Styles

```tsx
// MyComponent.lite.tsx
import './MyComponent.lite.css'

export default function MyComponent(props) {
  return (
    <div class="my-component">
      {props.children}
    </div>
  )
}
```

```css
/* MyComponent.lite.css */
.my-component {
  padding: 1rem;
  background: #f0f0f0;
}
```

## Compilation

Components are compiled during build time:

```bash
# Compile for specific app
sky mitosis build <app-name>

# Watch mode for development
sky mitosis dev <app-name>

# Force rebuild (ignore cache)
sky mitosis build <app-name> --force
```

## Component Patterns

### Props

```tsx
interface MyComponentProps {
  title: string
  onClose?: () => void
}

export default function MyComponent(props: MyComponentProps) {
  return <div>{props.title}</div>
}
```

### State Management

```tsx
import { useStore } from '@builder.io/mitosis'

export default function Counter() {
  const state = useStore({
    count: 0,
    increment() {
      state.count++
    }
  })

  return (
    <button onClick={state.increment}>
      Count: {state.count}
    </button>
  )
}
```

### Slots/Children

```tsx
export default function Container(props) {
  return (
    <div class="container">
      <header>{props.header}</header>
      <main>{props.children}</main>
      <footer>{props.footer}</footer>
    </div>
  )
}
```

## Framework Output

Each framework adapter gets its own compiled version:

- **@sky-modules/react** - React components
- **@sky-modules/vue** - Vue 3 components
- **@sky-modules/solid** - SolidJS components
- **@sky-modules/svelte** - Svelte components
- **@sky-modules/qwik** - Qwik components
- **@sky-modules/angular** - Angular components

## Design System Integration

Components integrate with Panda CSS for styling:

```tsx
import { css } from 'styled-system/css'

export default function StyledComponent() {
  return (
    <div class={css({ padding: '4', bg: 'blue.500' })}>
      Styled with Panda CSS
    </div>
  )
}
```

## Available Components

### Layout
- **Container** - Responsive layout container
- **Grid** - CSS Grid layout
- **Stack** - Vertical/horizontal stack

### Forms
- **Input** - Text input field
- **Button** - Action button
- **Checkbox** - Checkbox input
- **Select** - Dropdown select

### UI Elements
- **Popover** - Tooltip/popover overlay
- **Modal** - Dialog modal
- **Card** - Content card

## Best Practices

### 1. Keep Components Simple

```tsx
// ✅ Good - simple, focused
function Button(props) {
  return <button>{props.children}</button>
}

// ❌ Avoid - too complex for Mitosis
function ComplexButton(props) {
  // Heavy state management
  // Framework-specific APIs
}
```

### 2. Use Mitosis-compatible Features

```tsx
// ✅ Good - Mitosis-compatible
const state = useStore({ count: 0 })

// ❌ Avoid - framework-specific
const [count, setCount] = useState(0) // React-specific
```

### 3. Avoid Framework-specific APIs

```tsx
// ✅ Good - universal
<div onClick={() => handleClick()}>Click</div>

// ❌ Avoid - React-specific
<div onClick={(e) => e.preventDefault()}>Click</div>
```

## Limitations

Mitosis has some limitations:
- No conditional hooks
- Limited ref support
- No context API (use props drilling or composition)
- No advanced lifecycle methods

See [Mitosis documentation](https://github.com/BuilderIO/mitosis) for details.

## Related Modules

- [@sky-modules/design](../design/) - Design system and tokens
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/vue](../vue/) - Vue adapter
- [@sky-modules/solid](../solid/) - Solid adapter

## Examples

See the [playground](../../playground/) directory for complete examples.
