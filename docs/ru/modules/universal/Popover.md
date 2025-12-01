# Popover

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Popover utility module
</div>

<PlaygroundLink id="universal" label="Open Universal Playground" />


Плавающий компонент popover с позиционированием и управлением состоянием.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { Popover } from '@sky-modules/core'
```

## Компоненты

### Popover
Popover с контроллером для состояния и позиционирования.

```tsx
import Popover, { usePopover } from '@sky-modules/universal/Popover'

function MyComponent() {
  const popover = usePopover()

  return (
    <Popover controller={popover} trigger={<button>Открыть</button>}>
      <div>Содержимое popover</div>
    </Popover>
  )
}
```

**Props:**
- `controller` - Экземпляр PopoverController
- `trigger` - Элемент триггера
- `children` - Содержимое popover

**Хук:**
```tsx
const popover = usePopover({
  placement: 'top',
  offset: 10
})
```

**Mitosis:** Компилируется в React, Vue, Solid, Svelte, Qwik, Angular
