# Design System

Design system components, tokens, and styling utilities for Sky Modules.

## Overview

The design module provides a comprehensive design system built on Panda CSS, including design tokens, component recipes, brand themes, and layout utilities.

## Features

- **Design Tokens** - Colors, spacing, typography, shadows
- **Component Recipes** - Reusable style patterns
- **Brand System** - Multi-brand theming support
- **Layout Components** - Box, Layout, Grid
- **Panda CSS** - Zero-runtime CSS-in-JS
- **Type-safe** - Full TypeScript support

## Installation

```bash
npm install @sky-modules/design
```

## Structure

```
design/
├── Box/              # Universal box component
├── Layout/           # Layout components
├── Brand/            # Brand configuration
├── Design/           # Design utilities
├── DesignSystem/     # Core design system
├── brands/           # Brand themes
├── colors/           # Color palettes
├── lib/              # Utility libraries
└── recipe.ts         # Style recipes
```

## Design Tokens

### Colors

```typescript
import { colors } from '@sky-modules/design/colors'

// Access color palette
colors.blue[500]    // #3b82f6
colors.gray[100]    // #f3f4f6
```

### Spacing

```typescript
import { spacing } from '@sky-modules/design'

// Consistent spacing scale
spacing[4]   // 1rem (16px)
spacing[8]   // 2rem (32px)
```

## Components

### Box

Universal container component with CSS-in-JS styling.

```tsx
import { Box } from '@sky-modules/design'

<Box
  styles={{
    padding: '4',
    background: 'blue.500',
    borderRadius: '8px',
    display: 'flex',
    gap: '2'
  }}
>
  Content
</Box>
```

### Layout

Responsive layout component.

```tsx
import { Layout } from '@sky-modules/design'

<Layout
  sidebar={<Sidebar />}
  main={<Main />}
/>
```

## Brand System

Multi-brand theming support for white-label applications.

```typescript
import { Brand } from '@sky-modules/design'

// Define brand
const myBrand = new Brand({
  name: 'MyApp',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6'
  },
  typography: {
    fontFamily: 'Inter, sans-serif'
  }
})

// Apply brand
myBrand.apply()
```

### Brand Configuration

```typescript
interface BrandConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent?: string
    background?: string
    text?: string
  }
  typography?: {
    fontFamily?: string
    fontSize?: Record<string, string>
  }
  spacing?: Record<string, string>
  borderRadius?: Record<string, string>
}
```

## Panda CSS Integration

The design system uses Panda CSS for styling:

```tsx
import { css } from 'styled-system/css'

<div className={css({
  padding: '4',
  bg: 'blue.500',
  color: 'white',
  borderRadius: 'md'
})}>
  Styled element
</div>
```

### Recipes

Reusable style patterns:

```typescript
import { recipe } from '@sky-modules/design/recipe'

const buttonRecipe = recipe({
  base: {
    padding: '2 4',
    borderRadius: 'md',
    fontWeight: 'semibold'
  },
  variants: {
    variant: {
      primary: {
        bg: 'blue.500',
        color: 'white'
      },
      secondary: {
        bg: 'gray.200',
        color: 'gray.900'
      }
    },
    size: {
      sm: { fontSize: 'sm', padding: '1 3' },
      md: { fontSize: 'md', padding: '2 4' },
      lg: { fontSize: 'lg', padding: '3 6' }
    }
  }
})

// Usage
<button className={buttonRecipe({ variant: 'primary', size: 'md' })}>
  Click me
</button>
```

## Design System API

### DesignSystem

Core design system class:

```typescript
import { DesignSystem } from '@sky-modules/design'

const ds = new DesignSystem({
  tokens: {
    colors: { /* ... */ },
    spacing: { /* ... */ },
    typography: { /* ... */ }
  }
})

// Use design system
ds.getColor('primary')
ds.getSpacing(4)
```

## CSS Output

The design system generates CSS files:

- `index.css` - Main stylesheet
- `tailwind-tokens.css` - Tailwind-compatible tokens
- `index.scss` - SCSS version

## Customization

### Custom Tokens

```typescript
import { defineConfig } from '@sky-modules/design'

export default defineConfig({
  tokens: {
    colors: {
      brand: {
        50: '#eff6ff',
        100: '#dbeafe',
        // ...
        900: '#1e3a8a'
      }
    },
    spacing: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    }
  }
})
```

### Custom Recipes

```typescript
import { defineRecipe } from '@sky-modules/design/recipe'

export const cardRecipe = defineRecipe({
  base: {
    padding: '6',
    borderRadius: 'lg',
    boxShadow: 'md',
    background: 'white'
  },
  variants: {
    elevated: {
      true: { boxShadow: 'xl' },
      false: { boxShadow: 'none' }
    }
  }
})
```

## Typography

### Font Families

```typescript
fontFamily: {
  sans: 'Inter, system-ui, sans-serif',
  mono: 'JetBrains Mono, monospace',
  display: 'Cal Sans, sans-serif'
}
```

### Font Sizes

```typescript
fontSize: {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem'
}
```

## Best Practices

### 1. Use Design Tokens

```tsx
// ✅ Good - uses design tokens
<Box styles={{ padding: '4', bg: 'blue.500' }} />

// ❌ Avoid - hardcoded values
<Box styles={{ padding: '16px', bg: '#3b82f6' }} />
```

### 2. Use Recipes for Patterns

```tsx
// ✅ Good - reusable recipe
<button className={buttonRecipe({ variant: 'primary' })} />

// ❌ Avoid - inline styles
<button style={{ background: 'blue', padding: '8px' }} />
```

### 3. Leverage Type Safety

```typescript
// ✅ Good - type-safe
<Box styles={{ bg: 'blue.500' }} /> // TypeScript autocomplete

// ❌ Avoid - string literals
<Box styles={{ background: 'blue' }} /> // No type checking
```

## Integration with Frameworks

The design system works with all framework adapters:

```tsx
// React
import { Box } from '@sky-modules/react'

// Vue
import { Box } from '@sky-modules/vue'

// Solid
import { Box } from '@sky-modules/solid'
```

## Related Modules

- [@sky-modules/universal](../universal/) - Universal components
- [@sky-modules/canvas](../canvas/) - Canvas rendering
- [@sky-modules/react](../react/) - React adapter

## Examples

See the [playground](../../playground/) directory for complete examples.
