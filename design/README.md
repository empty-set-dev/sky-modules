# @sky-modules/design

Design system components, tokens, and styling utilities built on Panda CSS.

## Installation

```bash
npm install @sky-modules/design
```

## Features

- **Design Tokens** - Colors, spacing, typography, shadows
- **Component Recipes** - Reusable style patterns
- **Brand System** - Multi-brand theming support
- **Layout Components** - Box, Layout, Grid
- **Panda CSS** - Zero-runtime CSS-in-JS with atomic CSS
- **Type-safe** - Full TypeScript support

## Quick Start

### Using Design Tokens

```typescript
import { css } from '@sky-modules/design/css'

const styles = css({
    backgroundColor: 'primary.500',
    padding: '4',
    borderRadius: 'md',
    color: 'white'
})
```

### Box Component

Universal box component with design system integration:

```tsx
import { Box } from '@sky-modules/design'

<Box
    backgroundColor="primary.500"
    padding="4"
    borderRadius="md"
    color="white"
>
    Content here
</Box>
```

### Brand System

Configure multiple brand themes:

```typescript
import { Brand } from '@sky-modules/design'

Brand.configure({
    default: {
        primary: '#007bff',
        secondary: '#6c757d'
    },
    darkMode: {
        primary: '#0056b3',
        secondary: '#5a6268'
    }
})
```

## Design Tokens

### Colors
- Semantic colors (primary, secondary, success, warning, error)
- Neutral palette (gray.50 - gray.900)
- Brand-specific colors

### Spacing
- Consistent spacing scale (1 - 16)
- rem-based units for accessibility

### Typography
- Font families, sizes, weights
- Line heights and letter spacing

## Components

The package includes styled components built with the design system:

- **Box** - Fundamental building block with all CSS properties
- **Layout** - Flex and grid layouts
- **Typography** - Headings, text, and paragraphs

## Panda CSS Integration

The design system is built on Panda CSS, providing:

- **Zero runtime** - Styles extracted at build time
- **Atomic CSS** - Optimized CSS output
- **Type safety** - Autocomplete for all design tokens
- **Recipes** - Reusable component variants

## Documentation

For complete design system documentation, component recipes, and theming guides, visit the [full documentation](https://empty-set-dev.github.io/sky-modules/modules/design).

## License

ISC License - see the [LICENSE](../LICENSE) file for details.
