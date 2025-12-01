# Box

Универсальный box компонент с интеграцией дизайн-системы и полной поддержкой CSS свойств.

## Установка

```bash
npm install @sky-modules/design
```

## Возможности

- Полная поддержка CSS свойств через Panda CSS
- Поддержка Tailwind CSS через проп `sx`
- Интеграция с токенами дизайна
- Типобезопасная стилизация
- Нулевой runtime overhead
- Адаптивные варианты

## Использование

### Базовый Box

```tsx
import { Box } from '@sky-modules/design'

<Box
    backgroundColor="primary.500"
    padding="4"
    borderRadius="md"
    color="white"
>
    Контент здесь
</Box>
```

### Адаптивная стилизация

```tsx
<Box
    padding={{ base: '2', md: '4', lg: '6' }}
    fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
>
    Адаптивный контент
</Box>
```

### Flex раскладка

```tsx
<Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    gap="4"
>
    <Box>Слева</Box>
    <Box>Справа</Box>
</Box>
```

## Свойства

Box принимает все стандартные CSS свойства как props:

- **Раскладка**: `display`, `position`, `top`, `right`, `bottom`, `left`
- **Flexbox**: `flexDirection`, `alignItems`, `justifyContent`, `gap`
- **Grid**: `gridTemplateColumns`, `gridGap`, `gridColumn`
- **Отступы**: `padding`, `margin`, `p`, `m`, `px`, `py`, `mx`, `my`
- **Цвета**: `backgroundColor`, `color`, `borderColor`
- **Типографика**: `fontSize`, `fontWeight`, `lineHeight`, `textAlign`
- **Границы**: `border`, `borderRadius`, `borderWidth`
- **Размеры**: `width`, `height`, `minWidth`, `maxWidth`
- **И все другие CSS свойства**

## Токены дизайна

Используйте токены дизайна для консистентной стилизации:

```tsx
<Box
    backgroundColor="primary.500"     // Семантический цвет
    padding="4"                       // Токен отступа
    borderRadius="md"                 // Токен скругления
    fontSize="lg"                     // Токен размера шрифта
    boxShadow="md"                    // Токен тени
>
    Тематический контент
</Box>
```

## Поддержка Tailwind CSS

Используйте Tailwind классы через проп `sx` вместе со свойствами Panda CSS:

```tsx
<Box sx="hover:shadow-lg transition-all duration-300">
    Контент со стилями Tailwind
</Box>

<Box
    sx="flex items-center gap-4 p-4 rounded-lg"
    backgroundColor="primary.500"
>
    Комбинированный Tailwind + Panda
</Box>
```

## Как компонент

Рендер как разные HTML элементы:

```tsx
<Box as="section">
    Контент секции
</Box>

<Box as="article">
    Контент статьи
</Box>

<Box as="nav">
    Навигация
</Box>
```
