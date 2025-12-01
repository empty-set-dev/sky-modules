# Colors

Color manipulation utilities powered by Culori.

## Installation

```bash
npm install @sky-modules/design
```

## Overview

This module re-exports all utilities from [Culori](https://culorijs.org/), a comprehensive color library for JavaScript. Culori provides color conversion, manipulation, interpolation, and analysis tools.

## Usage

```typescript
import { parseHex, rgb, hsl, formatHex, lighten, darken } from '@sky-modules/design/colors'

// Parse colors
const color = parseHex('#3b82f6')

// Convert between formats
const rgbColor = rgb(color) // { mode: 'rgb', r: 0.231, g: 0.510, b: 0.965 }
const hslColor = hsl(color) // { mode: 'hsl', h: 217, s: 0.91, l: 0.60 }

// Format colors
formatHex(color) // '#3b82f6'

// Manipulate colors
lighten(color, 0.2) // Lighten by 20%
darken(color, 0.2)  // Darken by 20%
```

## Common Operations

### Color Parsing

```typescript
import { parse } from '@sky-modules/design/colors'

// Parse any CSS color
parse('#3b82f6')
parse('rgb(59, 130, 246)')
parse('hsl(217, 91%, 60%)')
parse('blue')
```

### Color Conversion

```typescript
import { rgb, hsl, lab, lch } from '@sky-modules/design/colors'

const color = parse('#3b82f6')

rgb(color)  // RGB color space
hsl(color)  // HSL color space
lab(color)  // LAB color space (perceptually uniform)
lch(color)  // LCH color space (cylindrical LAB)
```

### Color Formatting

```typescript
import { formatHex, formatRgb, formatHsl } from '@sky-modules/design/colors'

const color = parse('#3b82f6')

formatHex(color)  // '#3b82f6'
formatRgb(color)  // 'rgb(59, 130, 246)'
formatHsl(color)  // 'hsl(217, 91%, 60%)'
```

### Color Manipulation

```typescript
import { lighten, darken, saturate, desaturate } from '@sky-modules/design/colors'

const color = parse('#3b82f6')

lighten(color, 0.2)    // Lighten by 20%
darken(color, 0.2)     // Darken by 20%
saturate(color, 0.1)   // Increase saturation by 10%
desaturate(color, 0.1) // Decrease saturation by 10%
```

### Color Mixing

```typescript
import { mix } from '@sky-modules/design/colors'

const blue = parse('#3b82f6')
const red = parse('#ef4444')

mix(blue, red, 'rgb') // Mix 50/50 in RGB space
mix(blue, red, 'rgb', 0.3) // 30% blue, 70% red
```

### Color Interpolation

```typescript
import { interpolate } from '@sky-modules/design/colors'

const blue = parse('#3b82f6')
const red = parse('#ef4444')

const gradient = interpolate([blue, red], 'rgb')

gradient(0)   // Pure blue
gradient(0.5) // Middle color
gradient(1)   // Pure red

// Create color scales
const scale = [0, 0.25, 0.5, 0.75, 1].map(t => formatHex(gradient(t)))
// ['#3b82f6', '#7671c8', '#b06699', '#d96067', '#ef4444']
```

### Color Analysis

```typescript
import { luminance, contrast, wcagContrast } from '@sky-modules/design/colors'

const bg = parse('#ffffff')
const text = parse('#000000')

// Relative luminance (0-1)
luminance(bg)   // 1
luminance(text) // 0

// Contrast ratio
contrast(bg, text) // 21 (perfect contrast)

// WCAG contrast level
wcagContrast(bg, text) // 'AAA' (passes all levels)
```

### Generating Color Scales

```typescript
import { interpolate, formatHex } from '@sky-modules/design/colors'

// Create a color scale from light to dark
const base = parse('#3b82f6')
const light = lighten(base, 0.4)
const dark = darken(base, 0.4)

const scale = interpolate([light, base, dark], 'lch')

const colorScale = {
  50: formatHex(scale(0)),
  100: formatHex(scale(0.125)),
  200: formatHex(scale(0.25)),
  300: formatHex(scale(0.375)),
  400: formatHex(scale(0.5)),
  500: formatHex(scale(0.625)),
  600: formatHex(scale(0.75)),
  700: formatHex(scale(0.875)),
  800: formatHex(scale(1))
}
```

## Use Cases

### Brand Color Generation

```typescript
import { interpolate, lighten, darken, formatHex } from '@sky-modules/design/colors'

function generateColorScale(hex: string) {
  const base = parse(hex)
  const light = lighten(base, 0.5)
  const dark = darken(base, 0.5)

  const scale = interpolate([light, base, dark], 'lch')

  return {
    50: formatHex(scale(0)),
    100: formatHex(scale(0.111)),
    200: formatHex(scale(0.222)),
    300: formatHex(scale(0.333)),
    400: formatHex(scale(0.444)),
    500: formatHex(scale(0.555)), // Base color
    600: formatHex(scale(0.666)),
    700: formatHex(scale(0.777)),
    800: formatHex(scale(0.888)),
    900: formatHex(scale(1)),
    950: formatHex(darken(scale(1), 0.1))
  }
}

const blueScale = generateColorScale('#3b82f6')
```

### Accessible Color Contrast

```typescript
import { parse, contrast, lighten, darken } from '@sky-modules/design/colors'

function findAccessibleText(bgHex: string, targetContrast = 4.5) {
  const bg = parse(bgHex)
  const darkText = parse('#000000')
  const lightText = parse('#ffffff')

  // Try dark text first
  if (contrast(bg, darkText) >= targetContrast) {
    return '#000000'
  }

  // Try light text
  if (contrast(bg, lightText) >= targetContrast) {
    return '#ffffff'
  }

  // Adjust background until contrast is met
  let adjusted = bg
  let attempts = 0
  while (attempts < 20) {
    adjusted = darken(adjusted, 0.05)
    if (contrast(adjusted, lightText) >= targetContrast) {
      return formatHex(adjusted)
    }
    attempts++
  }

  return '#ffffff' // Fallback
}

const textColor = findAccessibleText('#3b82f6') // Returns accessible text color
```

### Theme Color Generation

```typescript
import { parse, lighten, darken, formatHex } from '@sky-modules/design/colors'

function generateThemeVariants(primaryHex: string) {
  const primary = parse(primaryHex)

  return {
    primary: primaryHex,
    primaryLight: formatHex(lighten(primary, 0.2)),
    primaryDark: formatHex(darken(primary, 0.2)),
    primarySubtle: formatHex(lighten(primary, 0.4)),
    primaryMuted: formatHex(desaturate(primary, 0.3))
  }
}

const variants = generateThemeVariants('#3b82f6')
```

## Culori Features

This module exports all Culori features:

- **Color Spaces:** RGB, HSL, HSV, HWB, LAB, LCH, OKLCH, and more
- **Parsing:** Parse any CSS color format
- **Formatting:** Convert to hex, rgb(), hsl(), etc.
- **Manipulation:** Lighten, darken, saturate, desaturate, rotate hue
- **Mixing & Interpolation:** Mix colors, create gradients
- **Analysis:** Luminance, contrast, WCAG compliance
- **Color Difference:** Delta E (CIE76, CIE94, CIEDE2000)
- **Color Vision:** Simulate color blindness

## Documentation

For complete API documentation, see [Culori Documentation](https://culorijs.org/).

## Files

### index.ts

**Purpose:** Re-export all Culori utilities

**Exports:** All Culori exports (parse, convert, manipulate, analyze functions)

## Related

- **Brand** - Uses color utilities for brand definitions
- **Design** - Color scale inversion for dark themes
- **[Culori](https://culorijs.org/)** - Comprehensive color library
