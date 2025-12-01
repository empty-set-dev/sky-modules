# Buttons

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  buttons utility module
</div>

Полиморфный компонент кнопки со стилизацией Panda CSS.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { buttons } from '@sky-modules/core'
```

## Компоненты

### Button

Гибкая кнопка с вариантами, размерами, состояниями загрузки и цветовыми палитрами.

```tsx
import Button from '@sky-modules/universal/buttons/Button'

<Button>Нажми меня</Button>
<Button variant="solid" size="lg" colorPalette="blue">Большая кнопка</Button>
<Button loading loadingText="Сохранение...">Сохранить</Button>
<Button as="a" href="/home">На главную</Button>
```

**Props:**
- `variant` - Вариант стиля кнопки
- `size` - Размер кнопки
- `colorPalette` - Цветовая схема
- `loading` - Состояние загрузки
- `loadingText` - Текст во время загрузки
- `spinner` - Пользовательский компонент спиннера
- `as` - Полиморфный тип элемента
- `disabled` - Состояние отключения

**Глобально:**
```tsx
import '@sky-modules/universal/buttons/Button/global'
```

**Mitosis:** Компилируется в React, Vue, Solid, Svelte, Qwik, Angular
