# SlotRoot

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  SlotRoot utility module
</div>

Slot pattern implementation for passing styles and controller to children.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { SlotRoot } from '@sky-modules/core'
```

## Components

### SlotRootProvider
Provider for passing styles and controller via context.

```tsx
import SlotRootProvider from '@sky-modules/universal/SlotRoot'

<SlotRootProvider styles={{ className: 'button-styles' }}>
  <CustomButton />
</SlotRootProvider>
```

**Props:**
- `styles` - Styles to apply to slotted children
- `controller` - Controller for managing slot state
- `children` - Child components

**Hook:**
```tsx
import { useSlotRoot } from '@sky-modules/universal/SlotRoot'

const { styles, controller } = useSlotRoot()
```

**Use case:** Enables "asChild" pattern where parent component styles are applied to child instead of creating wrapper elements.

**Mitosis:** Compiles to React, Vue, Solid, Svelte, Qwik, Angular
