# Box Component - Краткое руководство

## Что реализовано ✅

Box компонент для Canvas JSX с полной поддержкой:

1. **CSS Style Props** - прямые CSS свойства как props
2. **Tailwind Classes (twrn)** - utility классы с автоматическим разрешением конфликтов
3. **Style Prop** - объект стилей
4. **sx Prop** - styled-system стили

## Быстрый старт

```tsx
import { CanvasJSXRenderer, Box } from '@sky-modules/canvas'

const renderer = new CanvasJSXRenderer({ container })

// 1. Direct CSS Props
renderer.render(
    <Box
        width={100}
        height={100}
        backgroundColor="#ff0000"
        borderRadius={8}
        position={[50, 50]}
    />
)

// 2. Tailwind Classes
renderer.render(
    <Box
        className="w-100 h-100 bg-blue rounded-lg p-4"
        position={[200, 50]}
    />
)

// 3. Style Prop
renderer.render(
    <Box
        style={{
            width: '150px',
            height: '150px',
            backgroundColor: '#00ff00',
            borderRadius: '12px',
        }}
        position={[350, 50]}
    />
)

// 4. Mixed - Direct Props Override All
renderer.render(
    <Box
        className="bg-blue"              // Lower priority
        style={{ backgroundColor: '#00ff00' }}  // Medium priority
        backgroundColor="#ff0000"        // Highest priority - WINS
        width={100}
        height={100}
        position={[500, 50]}
    />
)
```

## Приоритет стилей

Порядок применения (от высшего к низшему):

1. **Direct CSS Props** - `backgroundColor="#ff0000"`
2. **style prop** - `style={{ backgroundColor: '#00ff00' }}`
3. **className (Tailwind)** - `className="bg-blue"`
4. **sx prop** - `sx={{ backgroundColor: '#0000ff' }}`

## Tailwind Merge (twrn)

Автоматически разрешает конфликтующие классы:

```tsx
// Без twrn
<Box className="p-2 p-4" />  // Оба применятся (некорректно)

// С twrn (включен по умолчанию)
<Box className="p-2 p-4" twrn={true} />  // p-4 выигрывает

// Конфликты по группам
<Box className="w-100 w-200 bg-red bg-blue m-2 m-4" />
// Результат: w-200, bg-blue, m-4 (последние выигрывают)
```

## Поддерживаемые Tailwind утилиты

### Spacing
```tsx
<Box className="p-4 px-2 py-4 m-auto gap-4" />
```

### Sizing
```tsx
<Box className="w-full h-screen w-1/2 w-[123px]" />
```

### Colors
```tsx
<Box className="bg-red text-white bg-[#abcdef]" />
```

### Border & Radius
```tsx
<Box className="border border-2 rounded-lg rounded-full" />
```

### Flexbox
```tsx
<Box className="flex flex-row justify-center items-center gap-4">
    <Box className="w-100 h-100 bg-red" />
    <Box className="w-100 h-100 bg-blue" />
</Box>
```

### Typography
```tsx
<Box className="text-xl font-bold text-center leading-relaxed" />
```

### Shadow & Opacity
```tsx
<Box className="shadow-lg opacity-50" />
```

## Arbitrary Values

Используйте `[value]` синтаксис для произвольных значений:

```tsx
<Box
    className="w-[234px] h-[123px] bg-[#ff1744] rounded-[16px]"
/>
```

## Flexbox Layout

```tsx
<Box
    width={400}
    height={150}
    display="flex"
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    gap={12}
    padding={16}
>
    <Box width={100} height={100} backgroundColor="#ff0000" />
    <Box width={100} height={100} backgroundColor="#00ff00" />
    <Box width={100} height={100} backgroundColor="#0000ff" />
</Box>
```

## Вложенные Box компоненты

```tsx
<Box width={300} height={300} backgroundColor="#f0f0f0" padding={20}>
    <Box width={100} height={100} backgroundColor="#ff0000" position={[0, 0]} />
    <Box width={100} height={100} backgroundColor="#00ff00" position={[120, 0]} />
    <Box width={100} height={100} backgroundColor="#0000ff" position={[0, 120]} />
</Box>
```

## Поддерживаемые CSS свойства

### Box Model
- width, height
- padding (top, right, bottom, left)
- margin (top, right, bottom, left)

### Background
- backgroundColor, background
- backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat

### Border
- border, borderWidth, borderStyle, borderColor
- borderRadius (all corners separately)

### Effects
- boxShadow, textShadow
- opacity
- transform

### Layout
- display
- position, top, left, right, bottom

### Flexbox
- flexDirection, justifyContent, alignItems
- flexWrap, gap, rowGap, columnGap

### Grid
- gridTemplateColumns, gridTemplateRows
- gridGap, gridAutoFlow

### Typography
- color, fontSize, fontFamily, fontWeight, fontStyle
- textAlign, lineHeight

## Экспортированные утилиты

Доступны для расширенного использования:

```tsx
import {
    Box,
    mergeTailwindClasses,
    tailwindClassesToCSS,
    parseUnit,
    parseSpacing,
    mergeStyles,
    normalizeProperties,
    extractDirectCSSProps,
    renderCSSToCanvas,
} from '@sky-modules/canvas'

// Merge Tailwind classes manually
const merged = mergeTailwindClasses('p-2 p-4 bg-red bg-blue')
// Result: 'p-4 bg-blue'

// Convert Tailwind to CSS
const css = tailwindClassesToCSS('w-100 h-100 bg-red')
// Result: { width: '400px', height: '400px', backgroundColor: '#ef4444' }

// Parse CSS units
const px = parseUnit('2rem', 16)  // 32
const px2 = parseUnit('100px')    // 100

// Merge multiple style objects
const merged = mergeStyles(
    { backgroundColor: '#ff0000' },
    { backgroundColor: '#00ff00', padding: 16 }
)
// Result: { backgroundColor: '#00ff00', padding: 16 }
```

## Примеры использования

### Карточка с тенью

```tsx
<Box
    className="p-6 bg-white rounded-xl shadow-lg"
    width={300}
    height={200}
>
    {/* Содержимое карточки */}
</Box>
```

### Кнопка

```tsx
<Box
    className="px-6 py-3 bg-blue text-white rounded-lg"
    width={120}
    height={40}
>
    {/* Button content */}
</Box>
```

### Responsive Container (twrn merge)

```tsx
<Box
    // Конфликтующие классы будут автоматически разрешены
    className="w-100 md:w-200 lg:w-300 p-2 md:p-4"
/>
```

### Grid Layout

```tsx
<Box
    display="grid"
    gridTemplateColumns="1fr 1fr 1fr"
    gap={16}
    padding={16}
>
    <Box className="bg-red" />
    <Box className="bg-green" />
    <Box className="bg-blue" />
</Box>
```

## Демо

Запустите демо для просмотра всех возможностей:

```tsx
import { createBoxDemo } from '@sky-modules/canvas/jsx.box-demo'

const container = document.getElementById('canvas-container')
const renderer = createBoxDemo(container)
```

## Текущие ограничения

⚠️ **Важно**: CSS рендеринг на canvas через `renderCSSToCanvas` уже реализован и интегрирован в `Mesh.ts` (строки 43-66).

Следующие возможности требуют дополнительной работы:
- Responsive breakpoints (md:, lg:) парсятся, но не активируются
- Pseudo-states (hover:, active:) парсятся, но не отслеживаются
- Text rendering в Box компонентах

## Тестирование

Запуск тестов:

```bash
npm test -- jsx.box-styles.spec.ts
npm test -- jsx.box-integration.spec.ts
npm test -- jsx.box-twrn.spec.ts
```

## Полная документация

Для детальной документации см. `jsx.box.README.md`

## Заключение

Box компонент полностью готов к использованию с:
- ✅ CSS style props
- ✅ Tailwind utilities + twrn merge
- ✅ Style prop
- ✅ Priority system
- ✅ Canvas rendering (интегрировано)
- ✅ Flexbox/Grid layout support

Используйте Box для создания UI на canvas с привычным CSS-подобным синтаксисом!
