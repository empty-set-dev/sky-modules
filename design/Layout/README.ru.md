# Layout

Гибкие компоненты раскладки для создания адаптивных структур страниц.

## Установка

```bash
npm install @sky-modules/design
```

## Возможности

- Flex и Grid примитивы раскладки
- Адаптивные контрольные точки
- Утилиты для промежутков и отступов
- Типобезопасные props
- Построено на Panda CSS

## Использование

### Flex раскладка

```tsx
import { Layout } from '@sky-modules/design'

<Layout
    display="flex"
    direction="row"
    align="center"
    justify="space-between"
    gap="4"
>
    <div>Элемент 1</div>
    <div>Элемент 2</div>
    <div>Элемент 3</div>
</Layout>
```

### Grid раскладка

```tsx
<Layout
    display="grid"
    gridTemplateColumns="repeat(3, 1fr)"
    gap="6"
>
    <div>Grid элемент 1</div>
    <div>Grid элемент 2</div>
    <div>Grid элемент 3</div>
</Layout>
```

### Адаптивная раскладка

```tsx
<Layout
    display="flex"
    direction={{ base: 'column', md: 'row' }}
    gap={{ base: '2', md: '4', lg: '6' }}
>
    <div>Адаптивный элемент 1</div>
    <div>Адаптивный элемент 2</div>
</Layout>
```

## Свойства

### Общие свойства

- **display**: `'flex' | 'grid' | 'block' | 'inline-flex'` - Режим отображения
- **gap**: `string | number | ResponsiveValue` - Промежуток между дочерними элементами
- **padding**: `string | number | ResponsiveValue` - Внутренние отступы
- **margin**: `string | number | ResponsiveValue` - Внешние отступы

### Flex свойства

- **direction**: `'row' | 'column' | 'row-reverse' | 'column-reverse'` - Направление flex
- **align**: `'start' | 'center' | 'end' | 'stretch' | 'baseline'` - Выравнивание элементов
- **justify**: `'start' | 'center' | 'end' | 'space-between' | 'space-around'` - Распределение контента
- **wrap**: `'nowrap' | 'wrap' | 'wrap-reverse'` - Перенос flex

### Grid свойства

- **gridTemplateColumns**: `string` - Шаблон колонок grid
- **gridTemplateRows**: `string` - Шаблон рядов grid
- **gridAutoFlow**: `'row' | 'column' | 'dense'` - Направление авто-потока
- **gridAutoColumns**: `string` - Авто-размер колонок
- **gridAutoRows**: `string` - Авто-размер рядов

## Примеры

### Grid карточек

```tsx
<Layout
    display="grid"
    gridTemplateColumns={{
        base: '1fr',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)'
    }}
    gap="6"
>
    <Card>Карточка 1</Card>
    <Card>Карточка 2</Card>
    <Card>Карточка 3</Card>
</Layout>
```

### Раскладка с сайдбаром

```tsx
<Layout display="flex" direction="row" gap="4" height="100vh">
    <Layout as="aside" width="250px" backgroundColor="gray.100">
        Сайдбар
    </Layout>
    <Layout flex="1" padding="6">
        Основной контент
    </Layout>
</Layout>
```

### Центрирование контента

```tsx
<Layout
    display="flex"
    align="center"
    justify="center"
    minHeight="100vh"
>
    <div>Центрированный контент</div>
</Layout>
```
