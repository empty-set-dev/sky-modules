# Typography

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  typegraphy utility module
</div>

<PlaygroundLink id="universal" label="Open Universal Playground" />


Компоненты текста и типографики со стилизацией Panda CSS.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { typegraphy } from '@sky-modules/core'
```

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
