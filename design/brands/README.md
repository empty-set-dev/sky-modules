# Brands

Pre-configured brand definitions for the design system.

## Installation

```bash
npm install @sky-modules/design
```

## Overview

This module provides ready-to-use brand definitions that implement the Brand interface. Each brand includes foundation tokens, semantic tokens, and layout configuration.

## Available Brands

### Reset Brand (sky.reset)

**File:** `reset.brand.ts`

Base brand with comprehensive design tokens. Provides sensible defaults for:
- **Foundation** - Complete color scales, typography, spacing, shadows, borders, effects
- **Semantic** - Background, foreground, border, brand, status, effects, opacity, animations
- **Layout** - Container configuration with responsive padding and max-width

Use as a base for custom brands via the `extends` property.

**Usage:**
```typescript
import resetBrand from '@sky-modules/design/brands/reset.brand'

// Use directly
const myBrand: Brand = resetBrand

// Or extend
const customBrand: BrandDescription = {
  name: 'custom',
  extends: [resetBrand],
  foundation: {
    colors: {
      // Override specific colors
    }
  }
}
```

### Sky Brand

**File:** `sky.brand.ts`

Sky-specific brand that extends reset brand.

**Usage:**
```typescript
import skyBrand from '@sky-modules/design/brands/sky.brand'

<DesignSystemProvider brand="sky">
  <App />
</DesignSystemProvider>
```

## File Structure

Each brand is split into multiple files for modularity:

- `*.brand.ts` - Main brand definition (combines foundation, semantic, layout)
- `*.brand.foundation.ts` - Foundation tokens (colors, typography, spacing, shadows, etc.)
- `*.brand.semantic.ts` - Semantic tokens (background, foreground, border, brand, status)
- `*.brand.layout.ts` - Layout configuration (container, padding, max-width)

## Creating Custom Brands

### Option 1: Extend Reset Brand

```typescript
import { BrandDescription } from '@sky-modules/design/Brand'
import resetBrand from '@sky-modules/design/brands/reset.brand'

const myBrand: BrandDescription = {
  name: 'my-brand',
  extends: [resetBrand],
  foundation: {
    colors: {
      primary: {
        50: '#e6f7ff',
        500: '#0066cc',
        900: '#002d5a'
      }
    }
  },
  semantic: {
    colors: {
      brand: {
        primaryHover: 'primary.600',
        primaryActive: 'primary.700'
      }
    }
  }
}

export default myBrand
```

### Option 2: Full Brand Definition

```typescript
import { Brand } from '@sky-modules/design/Brand'

const fullBrand: Brand = {
  name: 'full-brand',
  foundation: {
    colors: { /* all color scales */ },
    typography: { /* all typography */ },
    spacing: { /* all spacing */ },
    // ... complete foundation
  },
  semantic: {
    colors: { /* all semantic colors */ },
    opacity: { /* all opacity values */ },
    // ... complete semantic
  },
  layout: {
    container: { /* container config */ }
  }
}

export default fullBrand
```

## Files

### reset.brand.ts

**Purpose:** Base brand with comprehensive defaults

**Exports:**
- Default export - Complete reset brand definition

### reset.brand.foundation.ts

**Purpose:** Foundation tokens for reset brand

**Includes:**
- Color scales (neutral, brand colors)
- Typography (font families, sizes, weights, line heights, letter spacing)
- Spacing scale (xs-9xl)
- Sizing scale (xs-9xl)
- Border radius (xs-full)
- Border widths (xs-3xl)
- Box shadows (xs-3xl)
- Drop shadows (xs-3xl)
- Blur effects (xs-3xl)
- Glow effects (xs-3xl)
- Responsive breakpoints (xs-3xl)

### reset.brand.semantic.ts

**Purpose:** Semantic tokens for reset brand

**Includes:**
- Background colors (primary, secondary, tertiary, inverse, overlay, etc.)
- Foreground colors (primary, secondary, tertiary, disabled, placeholder)
- Border colors (primary, focus, error, success, etc.)
- Brand colors (hover, active, subtle, muted, emphasis states)
- Status colors (success, error, warning, info with variants)
- Surface colors (overlay, selected, disabled)
- Effect colors (glows for different states)
- Opacity values (disabled, subtle, overlay, backdrop)
- Semantic radius (interactive, container, pill)
- Animation durations (instant, micro, short, base, moderate, long)
- Z-index layers (dropdown, modal, tooltip, toast)
- Animation definitions (in/out/inOut for primary/secondary/tertiary)
- Semantic typography (display, headline, title, body, label scales)
- Motion effects (translate, scale, button/card animations)

### reset.brand.layout.ts

**Purpose:** Layout configuration for reset brand

**Includes:**
- Container centering behavior
- Responsive padding (default, xs-3xl)
- Container max-widths (xs-9xl)

### sky.brand.ts

**Purpose:** Sky-specific brand extending reset

**Exports:**
- Default export - Sky brand definition (extends reset)

### sky.brand.foundation.ts

**Purpose:** Sky-specific foundation token overrides

### sky.brand.semantic.ts

**Purpose:** Sky-specific semantic token overrides

## Integration

### With DesignSystemProvider

```typescript
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'
import skyBrand from '@sky-modules/design/brands/sky.brand'

<DesignSystemProvider brand="sky">
  <App />
</DesignSystemProvider>
```

### With Panda CSS

```typescript
import { defineConfig } from '@pandacss/dev'
import resetBrand from '@sky-modules/design/brands/reset.brand'

export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: resetBrand.foundation.colors,
        spacing: resetBrand.foundation.spacing
      },
      semanticTokens: {
        colors: resetBrand.semantic.colors
      }
    }
  }
})
```

## Best Practices

1. **Extend reset brand for consistency** - Start with reset.brand as a base
2. **Override selectively** - Only override tokens you need to change
3. **Maintain semantic naming** - Follow the same naming patterns
4. **Document custom tokens** - Add comments for custom additions
5. **Test all themes** - Verify tokens work in light/dark themes
6. **Use TypeScript** - Leverage type safety with Brand interface

## Related

- **Brand** - Brand type definitions
- **DesignSystemProvider** - Runtime brand switching
- **Box** - Component consuming brand tokens
