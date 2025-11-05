# Canvas JSX Box Component Tests

Этот набор тестов проверяет поддержку компонента `<Box />`, утилит `twrn` (Tailwind merge) и CSS style props в Canvas JSX рендерере.

## Структура тестов

### 1. `jsx.box-styles.spec.ts` - Основные тесты Box компонента

Этот файл содержит базовые тесты для проверки функциональности Box компонента:

#### Box component support
- ✓ Рендеринг Box с базовыми CSS свойствами (width, height, backgroundColor)
- ✓ Рендеринг Box с style props объектом
- ✓ Поддержка padding и margin
- ✓ Поддержка border properties (border, borderRadius)
- ✓ Поддержка shadow properties (boxShadow)
- ✓ Вложенные Box компоненты
- ✓ Transform properties (rotate, scale, translate)
- ✓ Opacity
- ✓ Flexbox layout (flexDirection, justifyContent, alignItems, gap)
- ✓ Grid layout (gridTemplateColumns, gridGap)

#### twrn (Tailwind merge) support
- ✓ Обработка одиночных классов
- ✓ Разрешение конфликтов (последний класс выигрывает)
- ✓ Множественные utility классы
- ✓ Responsive классы (md:, lg:, xl:)
- ✓ Объединение twrn классов с inline styles
- ✓ Pseudo-class модификаторы (hover:, active:)
- ✓ Arbitrary values ([123px], [#1c1c1c])

#### CSS style props support
- ✓ Text properties (fontSize, fontFamily, fontWeight, color, textAlign)
- ✓ Box model (width, height, padding, margin)
- ✓ Background properties (backgroundColor, backgroundImage, backgroundSize)
- ✓ Border properties (border, borderRadius с индивидуальными углами)
- ✓ Shadow properties (boxShadow, textShadow)
- ✓ Transform properties (rotate, scale, translate)
- ✓ Flexbox layout
- ✓ Grid layout
- ✓ Kebab-case CSS properties ('flex-direction', 'background-color')

#### Combined scenarios
- ✓ Box с className (twrn) + style props
- ✓ Box с className + style + прямыми CSS props
- ✓ Вложенные Boxes с разными типами props
- ✓ Приоритет стилей (inline styles > className)
- ✓ Сложные layouts с всеми типами props

#### Edge cases
- ✓ Ref callbacks
- ✓ Update callbacks (onUpdate)
- ✓ Обработка невалидных CSS значений
- ✓ Box без обязательных свойств
- ✓ Box с текстовым содержимым

---

### 2. `jsx.box-integration.spec.ts` - Интеграционные тесты

Этот файл проверяет интеграцию Box с Panda CSS и renderCSSToCanvas:

#### Panda CSS integration
- ✓ Конвертация Panda CSS токенов в canvas styles
- ✓ Responsive breakpoints
- ✓ Panda CSS patterns (box, flex, stack)
- ✓ Semantic tokens (primary, on-primary)
- ✓ Объединение множественных утилит

#### renderCSSToCanvas integration
- ✓ Рендеринг CSS градиентов на canvas (linear-gradient, radial-gradient)
- ✓ Множественные тени (box-shadow)
- ✓ Border с индивидуальными сторонами (borderTop, borderRight, etc.)
- ✓ Текст с множественными свойствами
- ✓ Transform matrix
- ✓ CSS calc() значения
- ✓ Background image patterns (repeating-linear-gradient)

#### Flexbox layout rendering
- ✓ flex-direction: row/column
- ✓ justify-content values (flex-start, center, space-between, etc.)
- ✓ align-items values (flex-start, center, stretch, etc.)
- ✓ flex-wrap
- ✓ Расчет позиций детей в flex контейнере

#### Grid layout rendering
- ✓ grid-template-columns/rows
- ✓ Сложные grid template areas
- ✓ grid-auto-flow
- ✓ Расчет позиций детей в grid контейнере

#### Complex nested layouts
- ✓ Вложенные flex контейнеры
- ✓ Grid внутри flex контейнера
- ✓ Комплексные layout комбинации

#### Style prop priority
- ✓ Приоритет sx prop vs style prop
- ✓ Приоритет sx prop vs прямые CSS props
- ✓ Применение всех источников стилей в правильном порядке

#### Performance and caching
- ✓ Кеширование и переиспользование Box meshes
- ✓ Эффективная обработка быстрых изменений стилей

#### Edge cases
- ✓ Пустые style объекты
- ✓ null/undefined значения стилей
- ✓ Циклические ссылки в style объектах
- ✓ Большое количество детей (100+)

---

### 3. `jsx.box-panda.spec.ts` - Panda CSS утилиты

Детальная проверка всех Panda CSS utility классов:

#### Spacing utilities
- ✓ Padding (p, px, py, pt, pr, pb, pl)
- ✓ Margin (m, mx, my, mt, mr, mb, ml)
- ✓ Gap utilities

#### Sizing utilities
- ✓ Width (w, min-w, max-w, w_full, w_1/2)
- ✓ Height (h, min-h, max-h, h_full, h_screen)
- ✓ Size (оба width и height)

#### Color utilities
- ✓ Background colors (bg-c_red, bg-c_blue, etc.)
- ✓ Text colors (c_white, c_black, etc.)
- ✓ Gradient utilities (bg-grad_to-r, grad-from, grad-to)

#### Border utilities
- ✓ Border width (bd-w_1, bd-w_2, etc.)
- ✓ Border radius (bdr_sm, bdr_md, rounded_full, etc.)
- ✓ Индивидуальные углы (bdr-tl, bdr-tr, bdr-br, bdr-bl)
- ✓ Border color (bd-c_red, etc.)

#### Shadow utilities
- ✓ Box shadow (shadow_xs, shadow_sm, shadow_md, etc.)
- ✓ Shadow color (shadow-c_red, etc.)

#### Layout utilities
- ✓ Display (d_block, d_flex, d_grid, d_none)
- ✓ Position (pos_relative, pos_absolute, pos_fixed)
- ✓ Inset (inset_0, top_10, left_20)

#### Flexbox utilities
- ✓ Flex direction (flex-d_row, flex-d_col, etc.)
- ✓ Justify content (jc_start, jc_center, jc_between, etc.)
- ✓ Align items (ai_start, ai_center, ai_stretch, etc.)
- ✓ Flex wrap (flex-wrap_wrap, flex-wrap_nowrap)
- ✓ Flex grow/shrink (flex-g_1, flex-sh_1)

#### Grid utilities
- ✓ Grid template columns (grid-tc_1, grid-tc_2, grid-tc_repeat)
- ✓ Grid gap (grid-g_4, etc.)
- ✓ Grid column/row span (grid-c_span-2, etc.)

#### Typography utilities
- ✓ Font size (fs_xs, fs_sm, fs_md, etc.)
- ✓ Font weight (fw_thin, fw_bold, fw_extrabold, etc.)
- ✓ Text align (ta_left, ta_center, ta_right)
- ✓ Line height (lh_tight, etc.)

#### Transform utilities
- ✓ Rotate (rotate_0, rotate_45, rotate_90, etc.)
- ✓ Scale (scale_50, scale_100, scale_150, etc.)
- ✓ Translate (translate-x, translate-y)

#### Opacity utilities
- ✓ Opacity levels (op_0, op_25, op_50, op_100)

#### Responsive utilities
- ✓ Breakpoint utilities (sm:, md:, lg:, xl:)
- ✓ Responsive flex utilities
- ✓ Responsive grid utilities

#### Composite utilities
- ✓ Комбинации множественных утилит
- ✓ Card-like styling
- ✓ Button-like styling

---

### 4. `jsx.box-twrn.spec.ts` - Tailwind Merge (twrn)

Детальные тесты для функциональности twrn (объединение конфликтующих Tailwind классов):

#### Basic twrn functionality
- ✓ Конфликтующие padding классы (последний выигрывает)
- ✓ Конфликтующие margin классы
- ✓ Конфликтующие width классы
- ✓ Конфликтующие height классы
- ✓ Конфликтующие background colors
- ✓ Конфликтующие text colors

#### Directional utilities
- ✓ px переопределяет pl/pr
- ✓ py переопределяет pt/pb
- ✓ p переопределяет все направления
- ✓ Специфичное направление после группового

#### Border utilities
- ✓ Конфликтующие border widths
- ✓ Конфликтующие border colors
- ✓ Конфликтующие border radius
- ✓ Индивидуальные углы border radius

#### Shadow utilities
- ✓ Конфликтующие shadow классы
- ✓ Конфликтующие shadow colors

#### Layout utilities
- ✓ Конфликтующие display классы
- ✓ Конфликтующие position классы
- ✓ Конфликтующие flex direction
- ✓ Конфликтующие justify-content
- ✓ Конфликтующие align-items

#### Typography utilities
- ✓ Конфликтующие font sizes
- ✓ Конфликтующие font weights
- ✓ Конфликтующие text align
- ✓ Конфликтующие line heights

#### Transform utilities
- ✓ Конфликтующие scale классы
- ✓ Конфликтующие rotate классы
- ✓ Конфликтующие translate классы
- ✓ Независимые transform оси

#### Opacity utilities
- ✓ Конфликтующие opacity levels

#### Arbitrary values
- ✓ Arbitrary width values ([123px])
- ✓ Arbitrary color values ([#abcdef])
- ✓ Объединение arbitrary с стандартными классами

#### Modifier prefixes
- ✓ Hover modifiers (hover:bg-red)
- ✓ Focus modifiers (focus:border-blue)
- ✓ Active modifiers (active:scale-95)
- ✓ Разделение разных модификаторов

#### Responsive modifiers
- ✓ Объединение классов per breakpoint
- ✓ Сохранение разных breakpoints
- ✓ Responsive flex utilities

#### Complex scenarios
- ✓ Очень длинные className строки
- ✓ Смешанные типы утилит
- ✓ Дублирующиеся классы
- ✓ Условные классы
- ✓ className как массив

#### twrn disabled
- ✓ Без объединения когда twrn=false
- ✓ Без объединения когда twrn отсутствует

#### Integration with other props
- ✓ Работа с style prop
- ✓ Работа с прямыми CSS props
- ✓ Работа с sx prop

#### Performance
- ✓ Эффективное объединение множества классов
- ✓ Кеширование результатов объединения

---

## Запуск тестов

```bash
# Запустить все тесты Box
npm test -- jsx.box

# Запустить конкретный файл
npm test -- jsx.box-styles.spec.ts
npm test -- jsx.box-integration.spec.ts
npm test -- jsx.box-panda.spec.ts
npm test -- jsx.box-twrn.spec.ts

# Запустить в watch mode
npm test -- --watch jsx.box
```

## Покрытие функциональности

### Что покрыто:
- ✅ Базовый рендеринг Box компонента
- ✅ Все CSS style props (text, box model, background, border, shadow, transform)
- ✅ Flexbox layout с расчетом позиций
- ✅ Grid layout с расчетом позиций
- ✅ Все Panda CSS утилиты (spacing, sizing, colors, borders, shadows, layout, flex, grid, typography, transforms, opacity)
- ✅ twrn (Tailwind merge) функциональность
- ✅ Приоритет стилей (direct props > style > className > sx)
- ✅ Responsive utilities
- ✅ Pseudo-class модификаторы (hover, focus, active)
- ✅ Arbitrary values в Tailwind классах
- ✅ Вложенные layouts
- ✅ Performance и caching
- ✅ Edge cases и error handling

### Что НЕ покрыто (требует реализации):
- ❌ Фактическая реализация Box компонента в jsx.tsx
- ❌ Интеграция с renderCSSToCanvas
- ❌ Парсинг и применение Panda CSS классов
- ❌ Реализация twrn логики
- ❌ Flexbox/Grid layout engine
- ❌ Responsive breakpoints detection
- ❌ Pseudo-class states tracking

## Примечания

1. **Тесты написаны в TDD стиле**: Сначала написаны тесты, затем должна быть реализация
2. **Все тесты используют expect().toHaveLength(1)**: Это placeholder проверка, которая должна быть заменена на более конкретные assertions после реализации
3. **Комментарии в тестах**: Указывают ожидаемое поведение (например, "Should use p-6 (last one)")
4. **Mock environment**: Тесты используют jsdom для эмуляции браузерного окружения

## Следующие шаги

1. Реализовать Box компонент в `jsx.tsx`
2. Добавить поддержку CSS props парсинга
3. Интегрировать Panda CSS
4. Реализовать twrn (Tailwind merge)
5. Создать layout engine для Flexbox и Grid
6. Добавить поддержку responsive breakpoints
7. Запустить тесты и исправить failing tests
8. Добавить более конкретные assertions вместо placeholder проверок

## Структура реализации

```
canvas/
├── jsx.tsx                          # Основной JSX рендерер
├── jsx.box.tsx                      # Box компонент (NEW)
├── jsx.box-renderer.tsx             # Box renderer интеграция (NEW)
├── jsx.box-styles-parser.tsx        # CSS props parser (NEW)
├── jsx.box-layout-engine.tsx        # Flexbox/Grid engine (NEW)
├── jsx.box-panda-integration.tsx    # Panda CSS интеграция (NEW)
├── jsx.box-twrn.tsx                 # Tailwind merge (NEW)
└── renderCSSToCanvas.ts             # CSS to Canvas renderer (EXISTS)
```
