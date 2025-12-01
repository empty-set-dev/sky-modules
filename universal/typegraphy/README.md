# Typography

Text and typography components with Panda CSS styling.

## Components

### Text
Polymorphic text component with sizing, alignment, truncation.

```tsx
import Text from '@sky-modules/universal/typegraphy/Text'
<Text>Paragraph</Text>
<Text size="lg" align="center">Large centered text</Text>
<Text noOfLines={3}>Truncated after 3 lines...</Text>
```

### Heading
Heading component with levels and sizes.

```tsx
import Heading from '@sky-modules/universal/typegraphy/Heading'
<Heading as="h1" size="2xl">Title</Heading>
```

### Link
Link component with styling.

```tsx
import Link from '@sky-modules/universal/typegraphy/Link'
<Link href="/about">About</Link>
```

**Mitosis:** All components compile to React, Vue, Solid, Svelte, Qwik, Angular
