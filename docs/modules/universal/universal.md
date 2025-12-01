# @sky-modules/universal

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Universal utility module
</div>

Framework-agnostic UI components compiled to multiple frameworks via Mitosis.

## Installation

```bash
npm install @sky-modules/universal
```

## Features

- **Write Once, Run Anywhere** - Single source compiles to React, Vue, Solid, Svelte, Qwik, and Angular
- **Mitosis-based** - Use familiar JSX syntax
- **Type-safe** - Full TypeScript support
- **Framework Output** - Automatic compilation to 6+ frameworks
- **Design System** - Integrated with Panda CSS tokens

## How It Works

Universal components are written in Mitosis (.lite.tsx files) and automatically compiled to framework-specific implementations during build time.

```
Component.lite.tsx → Mitosis → React/Vue/Solid/Svelte/Qwik/Angular
```

## Quick Start

### Writing a Universal Component

```tsx
// Button.lite.tsx
import { useStore } from '@builder.io/mitosis'

export default function Button(props) {
    const state = useStore({
        count: 0
    })

    return (
        <button onClick={() => state.count++}>
            {props.label}: {state.count}
        </button>
    )
}
```

### Using in Your Framework

After compilation, use the component in your chosen framework:

**React:**
```tsx
import { Button } from '@sky-modules/universal/react'

<Button label="Click me" />
```

**Vue:**
```vue
<script setup>
import { Button } from '@sky-modules/universal/vue'
</script>

<template>
    <Button label="Click me" />
</template>
```

**Solid:**
```tsx
import { Button } from '@sky-modules/universal/solid'

<Button label="Click me" />
```

## Available Components

The universal module includes:

- **Popover** - Accessible popover component
- **SlotRoot** - Slot pattern implementation
- **Buttons** - Button variants and styles
- **Forms** - Form input components
- **Layout** - Layout utilities
- **Typography** - Text components

## Component Structure

```
universal/
├── Component/
│   ├── Component.lite.tsx       # Mitosis source
│   ├── Component.lite.css       # Styles
│   └── index.lite.ts            # Exports
```

## Compilation

Components are automatically compiled during the build process using Sky Modules CLI:

```bash
sky mitosis build <app-name>
```

Output is generated in your app's `x/` directory with framework-specific implementations.

## Use Cases

Perfect for:

- **Component libraries** - Share components across framework projects
- **Design systems** - Maintain single source of truth
- **Multi-framework apps** - Support multiple frontend stacks
- **Migration projects** - Gradual framework transitions

## Documentation

For Mitosis syntax, component patterns, and compilation guides, visit the [full documentation](https://empty-set-dev.github.io/sky-modules/modules/universal).

## License

ISC License - see the [LICENSE](../LICENSE) file for details.
