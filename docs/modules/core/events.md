# Events

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  events utility module
</div>

Mouse button constants for event handling.

## Installation

```typescript
import { MouseButton } from '@sky-modules/core/events'
```

## API

### MouseButton

Enum of mouse button constants.

```typescript
enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}
```

**Values:**
- `LEFT` - Left mouse button (value: 0)
- `MIDDLE` - Middle/scroll button (value: 1)
- `RIGHT` - Right mouse button (value: 2)

## Usage

### Detecting Mouse Button

```typescript
import { MouseButton } from '@sky-modules/core/events'

document.addEventListener('mousedown', (event) => {
  if (event.button === MouseButton.LEFT) {
    console.log('Left button clicked')
  } else if (event.button === MouseButton.RIGHT) {
    console.log('Right button clicked')
  }
})
```

### Checking Button in Click Handler

```typescript
function handleMouseDown(event) {
  switch (event.button) {
    case MouseButton.LEFT:
      console.log('Primary action')
      break
    case MouseButton.MIDDLE:
      console.log('Middle click')
      break
    case MouseButton.RIGHT:
      console.log('Context menu')
      break
  }
}
```

### Preventing Default Actions

```typescript
document.addEventListener('mousedown', (event) => {
  if (event.button === MouseButton.RIGHT) {
    event.preventDefault()
  }
})
```

## Notes

- Values match native browser MouseEvent.button values
- Commonly used in mousedown, mouseup, and click events
- Right-click typically opens context menu unless prevented
