# Typography

Компоненты текста и типографики со стилизацией Panda CSS.

## Компоненты

### Text
Полиморфный текстовый компонент с размерами, выравниванием, усечением.

```tsx
import Text from '@sky-modules/universal/typegraphy/Text'
<Text>Параграф</Text>
<Text size="lg" align="center">Большой текст по центру</Text>
<Text noOfLines={3}>Усеченный после 3 строк...</Text>
```

### Heading
Компонент заголовка с уровнями и размерами.

```tsx
import Heading from '@sky-modules/universal/typegraphy/Heading'
<Heading as="h1" size="2xl">Заголовок</Heading>
```

### Link
Компонент ссылки со стилизацией.

```tsx
import Link from '@sky-modules/universal/typegraphy/Link'
<Link href="/about">О нас</Link>
```

**Mitosis:** Все компоненты компилируются в React, Vue, Solid, Svelte, Qwik, Angular
