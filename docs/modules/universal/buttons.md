# Buttons

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  buttons utility module
</div>

<PlaygroundLink id="universal" label="Open Universal Playground" />


Polymorphic button component with Panda CSS styling.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { buttons } from '@sky-modules/core'
```

## Components

### Button

Flexible button with variants, sizes, loading states, and color palettes.

```tsx
import Button from '@sky-modules/universal/buttons/Button'

<Button>Click me</Button>
<Button variant="solid" size="lg" colorPalette="blue">Large Button</Button>
<Button loading loadingText="Saving...">Save</Button>
<Button as="a" href="/home">Go Home</Button>
```

**Props:**
- `variant` - Button style variant
- `size` - Button size
- `colorPalette` - Color scheme
- `loading` - Loading state
- `loadingText` - Text during loading
- `spinner` - Custom spinner component
- `as` - Polymorphic element type
- `disabled` - Disabled state

**Global:**
```tsx
import '@sky-modules/universal/buttons/Button/global'
```

**Mitosis:** Compiles to React, Vue, Solid, Svelte, Qwik, Angular
