# Layout

Компоненты макета для гибкого и структурированного дизайна страниц.

## Компоненты

### Flex
Контейнер с flexbox раскладкой.

```tsx
import Flex from '@sky-modules/universal/layout/Flex'
<Flex direction="row" gap="4" align="center" justify="space-between">
  <div>Элемент 1</div>
</Flex>
```

### Grid
Контейнер с grid раскладкой.

```tsx
import Grid from '@sky-modules/universal/layout/Grid'
<Grid columns={3} gap="4"><div>Элемент 1</div></Grid>
```

### HStack / VStack
Горизонтальная и вертикальная стек раскладки.

```tsx
import { HStack, VStack } from '@sky-modules/universal/layout'
<HStack gap="2"><button>Кнопка 1</button></HStack>
<VStack gap="4"><h1>Заголовок</h1></VStack>
```

**Mitosis:** Все компоненты компилируются в React, Vue, Solid, Svelte, Qwik, Angular
