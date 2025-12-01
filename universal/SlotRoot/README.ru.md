# SlotRoot

Реализация паттерна slot для передачи стилей и контроллера дочерним элементам.

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
