# Brand

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Brand utility module
</div>

TypeScript interfaces and types for defining brand design tokens (colors, typography, spacing, components, etc.).

## Installation

```bash
npm install @sky-modules/design
```

## Overview

Brand provides type-safe interfaces for defining comprehensive brand design systems. It's used to describe brand tokens that are then consumed by your design system (Panda CSS, Tailwind, etc.).

## Features

- **Type-safe** - Full TypeScript support with strict typing
- **Comprehensive** - Covers all design token categories
- **Extensible** - Brands can extend other brands
- **Modular** - Organized into logical categories
- **Theme-aware** - Support for multiple color palettes (light/dark/custom)

## Brand Structure

A brand definition includes:

- **Foundation** - Atomic design tokens (colors, typography, spacing, shadows, borders)
- **Semantic** - Role-based tokens (primary, secondary, success, error, warning, info)
- **Layout** - Layout system tokens (breakpoints, container sizes, z-index)
- **Components** - Component-specific style tokens
- **Charts** - Data visualization tokens
- **Palettes** - Theme variants (light, dark, high-contrast, etc.)

## Usage

### Define a Brand

```typescript
import type { Brand } from '@sky-modules/design/Brand'

const skyBrand: Brand = {
    name: 'sky',

    foundation: {
        colors: {
            blue: {
                50: '#eff6ff',
                100: '#dbeafe',
                200: '#bfdbfe',
                // ... 300-900
            },
            gray: {
                50: '#f9fafb',
                // ...
            }
        },
        typography: {
            fonts: {
                sans: 'Inter, system-ui, sans-serif',
                mono: 'JetBrains Mono, monospace'
            },
            sizes: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.125rem',
                xl: '1.25rem'
            },
            weights: {
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700
            }
        },
        spacing: {
            0: '0',
            1: '0.25rem',
            2: '0.5rem',
            4: '1rem',
            // ...
        },
        shadows: {
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            // ...
        },
        radii: {
            sm: '0.125rem',
            md: '0.375rem',
            lg: '0.5rem',
            full: '9999px'
        }
    },

    semantic: {
        colors: {
            primary: {
                default: 'blue.500',
                hover: 'blue.600',
                active: 'blue.700'
            },
            success: {
                default: 'green.500',
                hover: 'green.600'
            },
            error: {
                default: 'red.500',
                hover: 'red.600'
            }
        }
    },

    layout: {
        breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px'
        },
        containers: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px'
        },
        zIndex: {
            dropdown: 1000,
            modal: 1100,
            tooltip: 1200
        }
    },

    components: {
        button: {
            sizes: {
                sm: { height: '2rem', px: '3', fontSize: 'sm' },
                md: { height: '2.5rem', px: '4', fontSize: 'md' },
                lg: { height: '3rem', px: '6', fontSize: 'lg' }
            }
        }
    },

    charts: {
        colors: {
            categorical: ['blue.500', 'green.500', 'purple.500', 'orange.500'],
            sequential: ['blue.100', 'blue.300', 'blue.500', 'blue.700', 'blue.900']
        }
    },

    palettes: {
        light: {
            background: 'white',
            foreground: 'gray.900',
            muted: 'gray.100'
        },
        dark: {
            background: 'gray.900',
            foreground: 'white',
            muted: 'gray.800'
        }
    }
}
```

### Partial Brand (Brand Extension)

```typescript
import type { BrandDescription } from '@sky-modules/design/Brand'

// Extend base brand with customizations
const customBrand: BrandDescription = {
    name: 'custom',
    extends: ['sky'],  // Inherit from sky brand

    foundation: {
        colors: {
            // Override specific colors
            blue: {
                500: '#0066cc'  // Custom blue
            }
        }
    },

    semantic: {
        colors: {
            primary: {
                default: 'blue.500'  // Uses custom blue
            }
        }
    }
}
```

## Type Definitions

### Brand Interface

```typescript
interface Brand {
    name: string
    extends?: BrandDescription[]
    foundation: BrandFoundation
    semantic: BrandSemantic
    layout: BrandLayout
    components?: BrandComponents
    charts?: BrandCharts
    palettes?: Record<string, BrandPalette>
}
```

### BrandFoundation

```typescript
interface BrandFoundation {
    colors: {
        [colorFamily: string]: {
            [shade: string]: string
        }
    }
    typography: {
        fonts: { [key: string]: string }
        sizes: { [key: string]: string }
        weights: { [key: string]: number }
        lineHeights: { [key: string]: string | number }
        letterSpacing: { [key: string]: string }
    }
    spacing: { [key: string]: string }
    shadows: { [key: string]: string }
    radii: { [key: string]: string }
    borders: { [key: string]: string }
}
```

### BrandSemantic

```typescript
interface BrandSemantic {
    colors: {
        primary: SemanticColor
        secondary: SemanticColor
        success: SemanticColor
        warning: SemanticColor
        error: SemanticColor
        info: SemanticColor
    }
}

interface SemanticColor {
    default: string
    hover: string
    active: string
    disabled: string
}
```

### BrandLayout

```typescript
interface BrandLayout {
    breakpoints: { [key: string]: string }
    containers: { [key: string]: string }
    zIndex: { [key: string]: number }
}
```

## Integration with DesignSystemProvider

Use brands with the DesignSystemProvider:

```tsx
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'

<DesignSystemProvider brand="sky">
    <App />
</DesignSystemProvider>

// Sets data-brand="sky" on body
// Brand tokens become available via CSS variables
```

## Best Practices

1. **Define foundation first** - Start with atomic tokens
2. **Use semantic tokens** - Reference foundation tokens for consistency
3. **Support multiple palettes** - At minimum light and dark themes
4. **Document token purpose** - Add comments for token usage
5. **Extend thoughtfully** - Only override what's necessary
6. **Type everything** - Leverage TypeScript for safety

## Example: Multi-Brand System

```typescript
// Base brand
const baseBrand: Brand = { /* ... */ }

// Summer theme
const summer: BrandDescription = {
    name: 'summer',
    extends: [baseBrand],
    foundation: {
        colors: {
            primary: { 500: '#ff6b6b' }
        }
    }
}

// Winter theme
const winter: BrandDescription = {
    name: 'winter',
    extends: [baseBrand],
    foundation: {
        colors: {
            primary: { 500: '#4ecdc4' }
        }
    }
}
```

## Files

### Brand.ts

**Purpose:** Main Brand interface definition

**Key exports:**
- `Brand` - Complete brand definition with all design tokens
- `BrandDescription` - Partial brand for extensions/overrides

### Brand.Foundation.ts

**Purpose:** Foundation (atomic) design tokens interface

**Key exports:**
- `BrandFoundation` - Colors, typography, spacing, shadows, borders, breakpoints

### Brand.Semantic.ts

**Purpose:** Semantic (role-based) design tokens interface

**Key exports:**
- `BrandSemantic` - Background, foreground, border, brand, status colors, animations, motion

### Brand.Layout.ts

**Purpose:** Layout system configuration interface

**Key exports:**
- `BrandLayout` - Container sizing, padding, and responsive behavior

### Brand.Components.ts

**Purpose:** Component-specific style definitions

**Key exports:**
- `BrandComponents` - Styles for all UI components (button, input, card, modal, etc.)
- Component type interfaces (ButtonVariant, InputComponent, CardComponent, etc.)

### Brand.Charts.ts

**Purpose:** Data visualization tokens interface

**Key exports:**
- `BrandCharts` - Color palettes and styling for charts (categorical, sequential, diverging)

### Brand.Palette.ts

**Purpose:** Theme palette (light/dark/custom) interface

**Key exports:**
- `BrandPalette` - Theme variant definition (light, dark, auto-dark)
- `AutoDarkConfig` - Automatic dark theme generation configuration

### Brand.Theme.ts

**Purpose:** Theme color definitions for specific palettes

**Key exports:**
- `BrandTheme` - Color tokens for surface, content, border, brand, status, interactive states
- `ThemeMode` - Theme generation mode type

### types.ts

**Purpose:** Shared type definitions

**Key exports:**
- `ColorScale` - Standard 11-shade color scale (50-950)

## Related

- **DesignSystemProvider** - Runtime brand switching
- **Box** - Component consuming brand tokens
- **Panda CSS** - Design system implementation
