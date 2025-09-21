# Universal Design System with Panda CSS Optimization

Универсальная дизайн-система для JSX фреймворков (Qwik, Vue, React, Solid, Svelte) с поддержкой:
- ✅ Tailwind для utility-first подхода
- ✅ SCSS и CSS Modules для традиционных стилей
- ✅ Panda CSS синтаксис (Box w={100})
- ✅ Оптимизированный dev режим без замедлений

## Проблема и решение

**Проблема:** Panda CSS генерирует стили во время сборки (build-time), что приводит к:
- Замедлению HMR (~500ms)
- Невозможности использовать динамические значения
- Ошибкам в production для динамических стилей

**Решение:** Двухрежимная система:
- **Development:** Runtime CSS генерация (как Emotion) - быстрый HMR
- **Production:** Статическая генерация через Panda CSS - zero runtime
- **Валидация:** Проверка динамических стилей в dev режиме

## Структура проекта

```
panda/
├── src/
│   ├── dev-runtime/         # Runtime для dev режима
│   │   ├── panda-compat.ts  # CSS генератор как Emotion
│   │   └── validator.ts     # Валидатор динамических стилей
│   ├── components/
│   │   └── Box.tsx          # Универсальный Box компонент
│   └── scripts/
│       └── check-dynamic-styles.ts  # Pre-commit проверка
├── vite.config.ts           # Конфигурация сборки
├── panda.config.ts          # Конфигурация Panda CSS
└── package.json

```

## Использование

### Установка

```bash
pnpm install
```

### Development

```bash
# Обычный dev режим (быстрый)
pnpm dev

# Dev режим с валидацией Panda совместимости
pnpm dev:safe
```

### Production

```bash
# Проверка + сборка
pnpm build
```

### Проверка стилей

```bash
# Проверить на динамические стили
pnpm check:styles

# Проверка с авто-исправлением
pnpm check:styles --fix

# Генерация HTML отчёта
pnpm check:styles --format html --output report.html
```

## API компонентов

### Box

```tsx
import { Box } from '@/components/Box';

// Статические стили (работают везде)
<Box w={200} p={4} bg="blue.500" rounded="lg">
  Content
</Box>

// Респонсивные стили
<Box 
  w={{ base: '100%', md: '50%', lg: '33%' }}
  p={[2, 4, 6, 8]}
  display={{ base: 'block', lg: 'flex' }}
>
  Responsive content
</Box>

// Псевдо-состояния
<Box
  bg="gray.100"
  _hover={{ bg: 'gray.200' }}
  _focus={{ outline: '2px solid blue' }}
  _dark={{ bg: 'gray.800' }}
>
  Interactive element
</Box>

// asChild паттерн
<Box asChild p={4} bg="white" shadow="md">
  <button>Styled button</button>
</Box>
```

### Специализированные компоненты

```tsx
import { Flex, Grid, Stack, HStack, VStack, Container, Center } from '@/components/Box';

// Flex контейнер
<Flex justify="between" align="center" gap={4}>
  <div>Left</div>
  <div>Right</div>
</Flex>

// Стеки
<Stack spacing={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Grid
<Grid gridTemplateColumns="repeat(3, 1fr)" gap={6}>
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</Grid>

// Контейнер
<Container maxW="1200px">
  Centered content with responsive padding
</Container>
```

## Обработка динамических стилей

### ❌ Проблемные паттерны (не работают в prod)

```tsx
// Динамические props
<Box bg={props.color} w={isOpen ? 200 : 100} />

// Spread операторы
<Box {...dynamicProps} />

// Условные выражения
<Box p={isMobile ? 2 : 4} />

// Функции
<Box bg={getColor()} />
```

### ✅ Рекомендуемые паттерны

#### 1. CSS переменные для динамики

```tsx
<Box 
  style={{ '--bg': props.color, '--size': `${size}px` }}
  bg="var(--bg)"
  w="var(--size)"
/>
```

#### 2. Варианты через cva

```tsx
const boxVariants = cva({
  base: { p: 4, rounded: 'md' },
  variants: {
    size: {
      sm: { w: '100px', h: '100px' },
      md: { w: '200px', h: '200px' },
      lg: { w: '300px', h: '300px' }
    },
    color: {
      primary: { bg: 'blue.500', color: 'white' },
      secondary: { bg: 'gray.500', color: 'white' }
    }
  }
});

<Box class={boxVariants({ size: 'md', color: 'primary' })} />
```

#### 3. Data-атрибуты

```tsx
<Box 
  data-state={isOpen ? 'open' : 'closed'}
  css={{
    '&[data-state=open]': { display: 'block' },
    '&[data-state=closed]': { display: 'none' }
  }}
/>
```

## Конфигурация

### vite.config.ts

Автоматическое переключение между dev runtime и production Panda:

```typescript
export default defineConfig(({ mode }) => ({
  plugins: [
    mode === 'production' && panda(),
  ],
  resolve: {
    alias: {
      '@/styled-system': mode === 'development' 
        ? './src/dev-runtime'
        : './styled-system'
    }
  }
}));
```

### panda.config.ts

Оптимизированная конфигурация с прегенерацией популярных стилей:

```typescript
export default defineConfig({
  staticCss: {
    recipes: {
      box: ['*'],  // Прегенерировать все варианты
    }
  }
});
```

## Performance

| Режим | HMR время | Bundle size | Поддержка динамики |
|-------|-----------|-------------|-------------------|
| **Dev (runtime)** | ~10ms ⚡ | +5kb (dev only) | ✅ Полная |
| **Prod (Panda)** | - | 0kb runtime | ❌ Только статика |

## Интеграция с другими фреймворками

```typescript
// React
import { Box } from '@sky-modules/design/react';

// Vue
import { Box } from '@sky-modules/design/vue';

// Solid
import { Box } from '@sky-modules/design/solid';

// Svelte
import Box from '@sky-modules/design/svelte';
```

## Roadmap

- [ ] Поддержка CSS-in-JS тем
- [ ] Интеграция с Figma токенами
- [ ] Runtime оптимизации через Web Workers
- [ ] Авто-миграция динамических стилей
- [ ] VSCode расширение с подсказками

## Лицензия

MIT