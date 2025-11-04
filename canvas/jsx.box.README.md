# Box Component для Canvas JSX

## Обзор

Box компонент добавляет поддержку CSS-подобного рендеринга в Canvas JSX renderer. Он поддерживает:

- **CSS style props** - прямые CSS свойства (width, height, backgroundColor и т.д.)
- **style prop** - объект стилей
- **className с twrn** - Tailwind utility классы с автоматическим разрешением конфликтов
- **sx prop** - styled-system style object

## Установка и использование

### Базовое использование

```tsx
import { Box } from '@sky-modules/canvas'

// Прямые CSS props
<Box width={100} height={100} backgroundColor="#ff0000" />

// Style prop
<Box style={{ width: '200px', height: '150px', backgroundColor: '#00ff00' }} />

// className с Tailwind utilities
<Box className="w-100 h-100 bg-red p-4 rounded-lg" />

// Комбинация всех подходов
<Box
  className="p-4 bg-blue"
  style={{ borderRadius: '8px' }}
  width={300}
  backgroundColor="#ff0000"  // Переопределит bg-blue
/>
```

### Вложенные Box компоненты

```tsx
<Box width={300} height={300} backgroundColor="#f0f0f0">
  <Box width={100} height={100} backgroundColor="#ff0000" position={[10, 10]} />
  <Box width={100} height={100} backgroundColor="#00ff00" position={[110, 10]} />
</Box>
```

## Архитектура

### Структура файлов

```
canvas/
├── jsx.box.tsx                   # Основной Box компонент
├── jsx.box-styles-parser.ts      # Парсинг CSS props
├── jsx.box-twrn.ts               # Tailwind merge утилиты
├── jsx.box.README.md             # Эта документация
└── jsx.tsx                       # Интеграция в JSX renderer
```

### jsx.box.tsx

Основной компонент, который:
1. Принимает props (CSS props, style, className, sx)
2. Извлекает CSS свойства из всех источников
3. Объединяет их с правильным приоритетом
4. Возвращает элемент Mesh с RectGeometry и BasicMaterial

**Приоритет стилей** (от высшего к низшему):
1. Прямые CSS props (`width={100}`)
2. `style` prop
3. `className` (Tailwind utilities)
4. `sx` prop

### jsx.box-styles-parser.ts

Утилиты для работы с CSS стилями:

- `parseUnit(value)` - конвертирует CSS единицы в пиксели (px, em, rem, %)
- `parseSpacing(value)` - парсит padding/margin shorthand
- `kebabToCamel(str)` - конвертирует kebab-case в camelCase
- `normalizeProperties(css)` - нормализует CSS объект к camelCase
- `mergeStyles(...styles)` - объединяет несколько style объектов
- `extractDirectCSSProps(props)` - извлекает CSS props из props объекта

### jsx.box-twrn.ts

Tailwind merge (twrn) утилиты:

- `mergeTailwindClasses(classNames)` - разрешает конфликты между Tailwind классами
- `tailwindClassesToCSS(className)` - конвертирует Tailwind классы в CSS properties
- Поддерживает все основные Tailwind утилиты:
  - Spacing (p-, m-, gap-)
  - Sizing (w-, h-, min-w-, max-h-)
  - Colors (bg-, text-, border-)
  - Border (border-, rounded-)
  - Shadow (shadow-)
  - Flexbox (flex-, justify-, items-)
  - Typography (text-, font-, leading-)
  - Transform (scale-, rotate-, translate-)
  - Opacity

## Поддерживаемые CSS свойства

### Box Model
- width, height
- padding, paddingTop, paddingRight, paddingBottom, paddingLeft
- margin, marginTop, marginRight, marginBottom, marginLeft

### Background
- backgroundColor, background
- backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat

### Border
- border, borderWidth, borderStyle, borderColor
- borderRadius
- borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius

### Shadow
- boxShadow
- textShadow

### Transform & Effects
- transform
- opacity

### Layout
- display
- position, top, left, right, bottom

### Flexbox
- flexDirection
- justifyContent
- alignItems, alignContent
- flexWrap
- gap, rowGap, columnGap

### Grid
- gridTemplateColumns, gridTemplateRows
- gridGap, gridRowGap, gridColumnGap
- gridAutoFlow

### Typography
- color
- fontSize, fontFamily, fontWeight, fontStyle
- textAlign, lineHeight

## Tailwind Utilities

Box поддерживает большинство Tailwind utility классов:

### Spacing
```tsx
<Box className="p-4" />        // padding: 16px
<Box className="px-2 py-4" />  // padding: 8px 16px
<Box className="m-auto" />     // margin: auto
```

### Sizing
```tsx
<Box className="w-full h-screen" />
<Box className="w-1/2 h-100" />
<Box className="w-[123px]" />  // arbitrary value
```

### Colors
```tsx
<Box className="bg-red text-white" />
<Box className="bg-[#abcdef]" />  // arbitrary color
```

### Border & Radius
```tsx
<Box className="border border-2 rounded-lg" />
<Box className="rounded-full" />
```

### Flexbox
```tsx
<Box className="flex flex-row justify-center items-center gap-4" />
```

### Responsive & Modifiers
```tsx
<Box className="md:w-100 hover:bg-blue" />
```

## Tailwind Merge (twrn)

Функция `twrn` автоматически разрешает конфликтующие Tailwind классы:

```tsx
// Без twrn - оба класса применятся (некорректно)
<Box className="p-2 p-4" />

// С twrn (по умолчанию включен) - последний класс выигрывает
<Box className="p-2 p-4" twrn={true} />  // result: p-4

// Разрешение directional conflicts
<Box className="px-4 pl-2" />  // result: px-4 pl-2 (pl-2 переопределяет left)
```

### Группы конфликтов

twrn определяет следующие группы:
- Spacing: `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `m`, `mx`, `my`, etc.
- Sizing: `w`, `h`, `min-w`, `max-h`, etc.
- Colors: `bg-color`, `text-color`, `border-color`
- Border: `border-w`, `border-radius`
- Shadow: `shadow`
- Display: `display`
- Position: `position`
- Flex: `flex-direction`, `justify-content`, `align-items`
- Typography: `font-size`, `font-weight`, `text-align`
- Transform: `scale`, `rotate`, `translate-x`, `translate-y`
- Opacity: `opacity`

## Интеграция с jsx.tsx

Box интегрирован в `CanvasJSXRenderer.renderElement()`:

```typescript
case 'Box':
    // Handle both function type and string type
    if (typeof type === 'function') {
        return this.renderElement(type(props), parent)
    } else {
        // String 'Box' - call the Box function
        return this.renderElement(Box(props), parent)
    }
```

Box возвращает стандартный Mesh элемент, который обрабатывается существующим pipeline.

## Примеры использования

### Простая карточка

```tsx
<Box
  className="p-6 bg-white rounded-xl shadow-lg"
  width={300}
  height={200}
>
  <Box className="text-2xl font-bold text-gray-800">
    Title
  </Box>
  <Box className="mt-2 text-gray-600">
    Description text
  </Box>
</Box>
```

### Flexbox layout

```tsx
<Box
  className="flex flex-row justify-between items-center gap-4"
  width={400}
  height={100}
  padding={16}
>
  <Box className="w-1/3 h-full bg-red" />
  <Box className="w-1/3 h-full bg-green" />
  <Box className="w-1/3 h-full bg-blue" />
</Box>
```

### Приоритет стилей

```tsx
<Box
  sx={{ backgroundColor: '#000000' }}           // Низший приоритет
  className="bg-red p-4"                        // Средний приоритет
  style={{ backgroundColor: '#00ff00' }}         // Высокий приоритет
  backgroundColor="#0000ff"                      // Высший приоритет - будет применён
/>
```

## Ограничения текущей реализации

### Что реализовано ✅
- Базовый рендеринг Box компонента
- CSS style props (все основные свойства)
- Tailwind utilities → CSS конверсия
- twrn (Tailwind merge) для разрешения конфликтов
- Приоритет стилей (direct > style > className > sx)
- Вложенные Box компоненты
- Responsive modifiers (md:, lg:) - парсятся, но не применяются
- Pseudo-class modifiers (hover:, active:) - парсятся, но не применяются
- Arbitrary values ([123px], [#abc])

### Что НЕ реализовано ❌
- **Рендеринг расширенных CSS свойств на canvas**
  - border, borderRadius, boxShadow не отрисовываются
  - backgroundImage, градиенты не поддерживаются
  - Требуется интеграция с `renderCSSToCanvas`
- **Flexbox layout engine**
  - flex properties парсятся, но не влияют на позиционирование детей
  - Требуется layout calculation engine
- **Grid layout engine**
  - grid properties парсятся, но не применяются
- **Responsive breakpoints detection**
  - md:, lg: классы парсятся, но не активируются на разных размерах
- **Pseudo-class states tracking**
  - hover:, active:, focus: парсятся, но не отслеживаются
- **Text rendering**
  - Box может содержать text, но он не рендерится
  - Требуется интеграция текстового рендеринга

## Следующие шаги для полной реализации

### 1. Интеграция renderCSSToCanvas

Добавить рендеринг CSS свойств на canvas:

```typescript
// В renderMesh добавить обработку _boxStyles
if (props._isBox && props._boxStyles) {
  const ctx = this.canvas.context
  renderCSSToCanvas(ctx, props._boxStyles, {
    x: mesh.position.x,
    y: mesh.position.y,
    box: true,
    fill: true
  })
}
```

### 2. Layout Engine

Создать `jsx.box-layout-engine.ts`:
- `calculateFlexLayout(parent, children)` - расчёт flex позиций
- `calculateGridLayout(parent, children)` - расчёт grid позиций
- Применять к children перед рендерингом

### 3. Responsive Breakpoints

- Добавить media query detection
- Применять responsive классы в зависимости от размера canvas
- Re-render при изменении размера

### 4. Pseudo-states Tracking

- Отслеживать mouse hover/active для meshes
- Применять hover:, active: стили динамически
- Требуется интеграция с event system

### 5. Panda CSS Integration

Создать `jsx.box-panda-integration.ts`:
- Парсинг Panda CSS tokens
- Конверсия Panda patterns (box, flex, stack) в props
- Semantic tokens (primary, on-primary)

## Тестирование

Тесты находятся в:
- `jsx.box-styles.spec.ts` - основные тесты Box, twrn, style props
- `jsx.box-integration.spec.ts` - интеграционные тесты (TODO)
- `jsx.box-panda.spec.ts` - Panda CSS тесты (TODO)
- `jsx.box-twrn.spec.ts` - детальные twrn тесты (TODO)

Запуск тестов:

```bash
npm test -- jsx.box-styles.spec.ts
```

Текущий статус: **10/37 тестов проходят** (базовая функциональность работает)

## Заключение

Box компонент предоставляет foundation для CSS-подобного рендеринга в Canvas JSX. Базовая инфраструктура готова:
- ✅ CSS props парсинг
- ✅ Tailwind utilities конверсия
- ✅ twrn merge
- ✅ Style priority
- ⏳ Canvas rendering (требуется интеграция)
- ⏳ Layout engine (требуется реализация)

Следующий шаг - интеграция с `renderCSSToCanvas` для полноценного отображения всех CSS свойств на canvas.
