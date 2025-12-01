# DesignSystem

Cross-framework design system provider for brand theming and styling management.

## Installation

```bash
npm install @sky-modules/design
```

## Features

- **Multi-brand support** with runtime switching
- **Light/dark theme** toggle
- **Color palette** customization
- **Cross-framework** compatible (React, Vue, Solid, Svelte, Qwik, Angular)
- **Zero runtime** overhead (Mitosis compilation)
- **Automatic DOM attributes** for CSS targeting

## Usage

### Basic Setup

```tsx
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'

<DesignSystemProvider
    brand="sky"
    initialTheme="light"
    initialPalette="default"
>
    <App />
</DesignSystemProvider>
```

The provider automatically sets `data-*` attributes on `document.body`:
- `data-brand="sky"`
- `data-theme="light"`
- `data-palette="default"`

### Access Design System Context

```tsx
import { useDesignSystem } from '@sky-modules/design/DesignSystem'

function ThemeToggle() {
    const { theme, toggleTheme } = useDesignSystem()

    return (
        <button onClick={toggleTheme}>
            Current theme: {theme}
        </button>
    )
}
```

### Change Brand

```tsx
function BrandSwitcher() {
    const { brand, changeBrand } = useDesignSystem()

    return (
        <select value={brand} onChange={(e) => changeBrand(e.target.value)}>
            <option value="sky">Sky</option>
            <option value="custom">Custom</option>
        </select>
    )
}
```

### Change Palette

```tsx
function PaletteSwitcher() {
    const { palette, changePalette } = useDesignSystem()

    return (
        <select value={palette} onChange={(e) => changePalette(e.target.value)}>
            <option value="default">Default</option>
            <option value="high-contrast">High Contrast</option>
            <option value="colorblind">Colorblind Safe</option>
        </select>
    )
}
```

## API

### DesignSystemProvider Props

```typescript
interface DesignSystemProviderProps {
    children?: Mitosis.Children
    brand?: string                              // Brand name (sets data-brand attribute)
    initialTheme?: 'light' | 'dark' | 'auto'   // Initial color theme
    initialPalette?: string                     // Initial color palette
}
```

### useDesignSystem Hook

Returns design system context with the following properties:

```typescript
interface DesignSystemContextType {
    // Current state
    brand?: string
    theme?: 'light' | 'dark' | 'auto'
    palette?: string

    // Actions
    changeBrand: (brand: string) => void
    toggleTheme: () => void
    changePalette: (palette: string) => void

    // Extended features (TypeScript interfaces, implementation in progress)
    accessibility?: {
        reducedMotion: boolean
        highContrast: boolean
        focusRing: {
            width: string
            style: string
            color: string
            offset: string
        }
    }

    i18n?: {
        direction: 'ltr' | 'rtl'
        locale: string
        timezone: string
        currency: string
        numberFormat: {
            decimal: string
            thousands: string
        }
        dateFormat: {
            short: string
            medium: string
            long: string
            full: string
        }
    }

    content?: {
        tone: 'formal' | 'casual' | 'friendly' | 'professional' | 'playful'
        voice: 'active' | 'passive'
        microcopy: {
            loading: string
            empty: string
            error: string
            success: string
            retry: string
            cancel: string
            confirm: string
            save: string
            delete: string
            // ... and more
        }
    }
}
```

> **Note**: Currently implemented features are `brand`, `theme`, `palette`, and their corresponding actions. Extended features (`accessibility`, `i18n`, `content`) are defined in TypeScript interfaces for future implementation.

## HTML Attributes

The provider automatically manages attributes on `document.body`:

**Set on mount:**
- `data-brand` - Current brand name
- `data-theme` - Current theme (light/dark/auto)
- `data-palette` - Current color palette

**Removed on unmount:**
All `data-*` attributes are cleaned up when the provider unmounts.

## CSS Integration

Use the data attributes in your stylesheets:

```css
/* Brand-specific styles */
[data-brand="sky"] {
    --primary-color: #0066cc;
}

[data-brand="custom"] {
    --primary-color: #ff6b6b;
}

/* Theme-specific styles */
[data-theme="dark"] {
    background: #000;
    color: #fff;
}

[data-theme="light"] {
    background: #fff;
    color: #000;
}

/* Palette-specific styles */
[data-palette="high-contrast"] {
    --text-color: #000;
    --bg-color: #fff;
    font-weight: 600;
}

/* Combined targeting */
[data-brand="sky"][data-theme="dark"] {
    --primary-color: #3399ff;
}
```

## Examples

### Multi-Brand Application

```tsx
<DesignSystemProvider brand="summer">
    <App />
</DesignSystemProvider>

// DOM output:
// <body data-brand="summer" data-theme="light">
```

### Theme-Aware Component

```tsx
function Card() {
    const { theme } = useDesignSystem()

    return (
        <Box
            backgroundColor={theme === 'dark' ? 'gray.900' : 'white'}
            color={theme === 'dark' ? 'white' : 'gray.900'}
        >
            Theme-aware card
        </Box>
    )
}
```

### Dynamic Brand Switching

```tsx
function BrandPicker() {
    const { changeBrand } = useDesignSystem()
    const brands = ['sky', 'ocean', 'forest', 'sunset']

    return (
        <div>
            {brands.map(brand => (
                <button key={brand} onClick={() => changeBrand(brand)}>
                    {brand}
                </button>
            ))}
        </div>
    )
}
```

## Cross-Framework Usage

DesignSystem is built with Mitosis and works identically across frameworks:

**React:**
```tsx
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'

<DesignSystemProvider brand="sky">
    <App />
</DesignSystemProvider>
```

**Vue:**
```vue
<script setup>
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'
</script>

<DesignSystemProvider brand="sky">
    <App />
</DesignSystemProvider>
```

**Solid:**
```tsx
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'

<DesignSystemProvider brand="sky">
    <App />
</DesignSystemProvider>
```

Same API, same behavior—compiled for each framework via Mitosis.

## Files

### DesignSystemProvider.lite.tsx

**Purpose:** Main provider component for design system context

**Key exports:**
- `DesignSystemProvider` - Provider component with brand/theme/palette management

**Features:**
- Manages brand, theme, palette state
- Sets `data-*` attributes on document.body
- Provides context to child components
- Auto-cleanup on unmount

### useDesignSystem.lite.ts

**Purpose:** Hook to access design system context

**Key exports:**
- `useDesignSystem()` - Hook returning context with state and actions

**Usage:**
```typescript
const { theme, toggleTheme, changeBrand } = useDesignSystem()
```

### types.lite.ts

**Purpose:** TypeScript type definitions for design system

**Key exports:**
- `DesignSystemContextType` - Context interface with state and actions

**Properties:**
- `brand`, `theme`, `palette` - Current state
- `changeBrand()`, `toggleTheme()`, `changePalette()` - Actions
- `accessibility`, `i18n`, `content` - Future feature interfaces

### DesignSystem.context.lite.ts

**Purpose:** Mitosis context definition

Creates the design system context for Mitosis compilation.

### index.lite.ts

**Purpose:** Module exports

Re-exports all public APIs (Provider, hook, types, context).

## Related Modules

- **Brand** - Type-safe brand token definitions
- **Box** - Universal styled component that respects themes
- **Layout** - Platform-agnostic layout computation

## Implementation Notes

- Built with **Mitosis** for universal framework support
- Uses **`useStore`** for reactive state management
- **`setContext`** makes state available to children
- **DOM attributes** enable CSS-based theming
- **Zero runtime** - compiles to native framework code
- Source: `DesignSystemProvider.lite.tsx:11`
