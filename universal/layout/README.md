# Layout

Layout components for flexible and structured page designs.

## Components

### Flex
Flexible box layout container.

```tsx
import Flex from '@sky-modules/universal/layout/Flex'
<Flex direction="row" gap="4" align="center" justify="space-between">
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

### Grid
Grid layout container.

```tsx
import Grid from '@sky-modules/universal/layout/Grid'
<Grid columns={3} gap="4">
  <div>Item 1</div>
</Grid>
```

### HStack / VStack
Horizontal and vertical stack layouts.

```tsx
import { HStack, VStack } from '@sky-modules/universal/layout'
<HStack gap="2"><button>Button 1</button></HStack>
<VStack gap="4"><h1>Title</h1></VStack>
```

**Mitosis:** All components compile to React, Vue, Solid, Svelte, Qwik, Angular
