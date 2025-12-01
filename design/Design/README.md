# Design

Design system utilities and type helpers for building component libraries.

## Installation

```bash
npm install @sky-modules/design
```

## Overview

The Design module provides TypeScript utilities for building type-safe design system components with support for:
- Component slots (root, icon, label, etc.)
- Styling recipes
- Color scale inversion for dark themes
- Polymorphic component patterns

## Features

- **Slot Types** - Type-safe component slot definitions
- **Recipe Support** - Integration with styling recipe functions
- **Color Inversion** - Automatic dark theme generation
- **Polymorphic Props** - Box-based component props
- **Global Types** - Available across all frameworks

## Usage

### Component Slots

Build multi-part components with typed slots:

```typescript
import type { Design } from '@sky-modules/design'

// Root component with recipe support
type ButtonRootProps = Design.SlotRootProps<typeof buttonRecipe, 'button'>

function ButtonRoot(props: ButtonRootProps) {
  const { recipe, unstyled, children, ...rest } = props
  const styles = !unstyled && recipe ? recipe(props) : undefined

  return (
    <Box as="button" {...styles} {...rest}>
      {children}
    </Box>
  )
}

// Slot component (simple Box wrapper)
type ButtonIconProps = Design.SlotProps<'span'>

function ButtonIcon(props: ButtonIconProps) {
  return <Box as="span" {...props} />
}
```

### Color Scale Inversion

Automatically generate dark themes by inverting color scales:

```typescript
import type { InvertColorScale, DeepInvertColorScale } from '@sky-modules/design/Design/InvertColorScale'

// Single color scale inversion
type BlueScale = {
  50: '#eff6ff',
  500: '#3b82f6',
  950: '#172554'
}

type DarkBlue = InvertColorScale<BlueScale>
// Result: { 50: '#172554', 500: '#3b82f6', 950: '#eff6ff' }

// Deep inversion for nested palettes
type Colors = {
  blue: BlueScale,
  gray: GrayScale
}

type DarkColors = DeepInvertColorScale<Colors>
// Inverts all nested color scales
```

### Unstyled Components

Skip default styling and provide custom styles:

```typescript
<ButtonRoot unstyled padding="4" backgroundColor="custom.500">
  Custom styled button
</ButtonRoot>
```

### Custom Recipes

Override the default recipe:

```typescript
const customButtonRecipe = (props) => ({
  padding: '2',
  backgroundColor: 'purple.500'
})

<ButtonRoot recipe={customButtonRecipe}>
  Custom recipe button
</ButtonRoot>
```

## Type Definitions

### Design.SlotRootProps

Props for root slot with recipe support:

```typescript
type SlotRootProps<R, T = 'div'> = BoxProps<T> & RecipeProps<R> & {
  unstyled?: true
  recipe?: R
}
```

**Parameters:**
- `R` - Recipe function type
- `T` - Element/component type (default: 'div')

**Properties:**
- All Box props (Panda CSS + polymorphic)
- Recipe props (variant, size, etc.)
- `unstyled` - Skip default styling
- `recipe` - Override recipe function

### Design.SlotProps

Props for regular slot components:

```typescript
type SlotProps<T = 'div'> = BoxProps<T>
```

**Parameters:**
- `T` - Element/component type (default: 'div')

Simply extends Box props with polymorphic support.

## Color Scale Inversion

### InvertColorScale

Type utility that inverts a single color scale:

**Mapping:**
- 50 ↔ 950
- 100 ↔ 900
- 200 ↔ 800
- 300 ↔ 700
- 400 ↔ 600
- 500 (center) stays 500

### DeepInvertColorScale

Recursively inverts nested color scales:

```typescript
type DeepInvertColorScale<T extends object> =
  T extends ColorScale
    ? InvertColorScale<T>
    : { [K in keyof T]: DeepInvertColorScale<T[K]> }
```

Useful for inverting entire brand color palettes.

## Integration

### With Panda CSS Recipes

```typescript
import { defineRecipe } from '@pandacss/dev'

const buttonRecipe = defineRecipe({
  base: {
    padding: '2',
    borderRadius: 'md'
  },
  variants: {
    variant: {
      primary: { backgroundColor: 'blue.500' },
      secondary: { backgroundColor: 'gray.500' }
    },
    size: {
      sm: { fontSize: 'sm' },
      md: { fontSize: 'md' },
      lg: { fontSize: 'lg' }
    }
  }
})

type ButtonProps = Design.SlotRootProps<typeof buttonRecipe, 'button'>
```

### With DesignSystemProvider

```typescript
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'

<DesignSystemProvider brand="sky" theme="dark">
  <App />
</DesignSystemProvider>
```

### With Brand Auto-Dark

```typescript
import type { BrandPalette, AutoDarkConfig } from '@sky-modules/design/Brand'
import type { DeepInvertColorScale } from '@sky-modules/design/Design/InvertColorScale'

const palette: BrandPalette = {
  autoDark: {
    enabled: true,
    invertColors: {
      blue: true,
      gray: true
    }
  }
}
```

## Files

### Design.namespace.ts

**Purpose:** Global Design namespace with slot type definitions

**Key exports:**
- `Design.SlotRootProps<R, T>` - Root component props with recipe
- `Design.SlotProps<T>` - Slot component props

### InvertColorScale.ts

**Purpose:** Color scale inversion utilities for dark theme generation

**Key exports:**
- `InvertColorScale<T>` - Single color scale inversion type
- `DeepInvertColorScale<T>` - Recursive color scale inversion type

### namespace.ts

**Purpose:** Re-exports Design namespace types

## Best Practices

1. **Use SlotRootProps for root components** - Provides recipe integration
2. **Use SlotProps for child slots** - Simple Box props wrapper
3. **Support unstyled prop** - Allow users to opt out of default styling
4. **Accept custom recipes** - Enable recipe overrides
5. **Leverage color inversion** - Automatic dark theme generation

## Related

- **Box** - Polymorphic base component
- **Brand** - Design token definitions
- **DesignSystemProvider** - Runtime theme provider
- **Panda CSS** - Styling engine
