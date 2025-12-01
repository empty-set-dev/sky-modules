# Popover

Floating popover component with positioning and state management.

## Components

### Popover
Popover with controller for state and positioning.

```tsx
import Popover, { usePopover } from '@sky-modules/universal/Popover'

function MyComponent() {
  const popover = usePopover()

  return (
    <Popover controller={popover} trigger={<button>Open</button>}>
      <div>Popover content</div>
    </Popover>
  )
}
```

**Props:**
- `controller` - PopoverController instance
- `trigger` - Trigger element
- `children` - Popover content

**Hook:**
```tsx
const popover = usePopover({
  placement: 'top',
  offset: 10
})
```

**Mitosis:** Compiles to React, Vue, Solid, Svelte, Qwik, Angular
