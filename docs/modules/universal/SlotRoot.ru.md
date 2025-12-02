# SlotRoot

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  SlotRoot utility module
</div>

Реализация паттерна slot для передачи стилей и контроллера дочерним элементам.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { SlotRoot } from '@sky-modules/core'
```

## Компоненты

### SlotRootProvider
Провайдер для передачи стилей и контроллера через контекст.

```tsx
import SlotRootProvider from '@sky-modules/universal/SlotRoot'

<SlotRootProvider styles={{ className: 'button-styles' }}>
  <CustomButton />
</SlotRootProvider>
```

**Props:**
- `styles` - Стили для применения к дочерним элементам
- `controller` - Контроллер для управления состоянием slot
- `children` - Дочерние компоненты

**Хук:**
```tsx
import { useSlotRoot } from '@sky-modules/universal/SlotRoot'

const { styles, controller } = useSlotRoot()
```

**Применение:** Реализует паттерн "asChild" где стили родительского компонента применяются к дочернему вместо создания элементов-оберток.

**Mitosis:** Компилируется в React, Vue, Solid, Svelte, Qwik, Angular
