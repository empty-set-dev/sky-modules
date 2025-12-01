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

## Modules

The design system is organized into focused modules:

### Core Components

- **[Box](./Box)** - Universal polymorphic component with Panda CSS, Tailwind, and full CSS properties support
- **[Layout](./Layout)** - Platform-agnostic layout computation engine (Canvas, Three.js, DOM)

### Design System

- **[Brand](./Brand)** - TypeScript interfaces for brand design tokens (colors, typography, spacing, components)
- **[DesignSystem](./DesignSystem)** - Cross-framework design system provider for brand theming and runtime switching
- **[Design](./Design)** - Design system utilities and type helpers for building component libraries

### Pre-configured Assets

- **[brands](./brands)** - Pre-configured brand definitions (reset, sky brands)
- **[colors](./colors)** - Color manipulation utilities (powered by Culori)
- **[lib](./lib)** - SCSS/CSS utility mixins for common design patterns

## Module Overview

### Box
Universal polymorphic component that works across all frameworks (React, Vue, Solid, Svelte, Qwik, Angular):
```tsx
<Box as="button" padding="4" backgroundColor="primary.500" onClick={handleClick}>
  Styled Button
</Box>
```

### Brand
Type-safe brand definitions with foundation, semantic, layout, and component tokens:
```typescript
const myBrand: Brand = {
  name: 'my-brand',
  foundation: { colors: {...}, typography: {...} },
  semantic: { colors: {...}, animations: {...} },
  layout: { container: {...} }
}
```

### DesignSystem
Runtime brand and theme management:
```tsx
<DesignSystemProvider brand="sky" initialTheme="dark">
  <App />
</DesignSystemProvider>
```

### Layout
Compute layout positions for any rendering target:
```typescript
const layout = computeLayout({
  styles: { display: 'flex', width: 500, gap: 10 },
  children: [...]
})
// Use computed positions for Canvas, Three.js, etc.
```

## Documentation

For detailed documentation on each module:

- [Box Documentation](./Box/README.md) - Component usage and API
- [Brand Documentation](./Brand/README.md) - Brand token definitions
- [DesignSystem Documentation](./DesignSystem/README.md) - Runtime theming
- [Design Documentation](./Design/README.md) - Utility types and helpers
- [Layout Documentation](./Layout/README.md) - Layout engine API
- [brands Documentation](./brands/README.md) - Pre-configured brands
- [colors Documentation](./colors/README.md) - Color utilities
- [lib Documentation](./lib/README.md) - SCSS/CSS utilities

Full documentation: [https://empty-set-dev.github.io/sky-modules/modules/design](https://empty-set-dev.github.io/sky-modules/modules/design)

## License

ISC License - see the [LICENSE](../LICENSE) file for details.
