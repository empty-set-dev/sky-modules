import { ColorScale } from './types'

/**
 * Foundation - atomic design tokens
 *
 * Core visual primitives that form the basis of the design system.
 * All higher-level tokens (semantic, component) reference these foundation tokens.
 *
 * Includes:
 * - Color scales (50-950 shades)
 * - Typography (fonts, sizes, spacing, line height)
 * - Spacing and sizing scales
 * - Border radius and width
 * - Shadows (box and drop)
 * - Blur and glow effects
 * - Responsive breakpoints
 *
 * @example
 * ```typescript
 * const foundation: BrandFoundation = {
 *   colors: {
 *     blue: {
 *       50: '#eff6ff',
 *       500: '#3b82f6',
 *       900: '#1e3a8a'
 *     }
 *   },
 *   typography: {
 *     fontFamily: {
 *       sans: ['Inter', 'system-ui', 'sans-serif']
 *     },
 *     fontSize: {
 *       md: ['1rem', { lineHeight: '1.5' }]
 *     }
 *   },
 *   spacing: {
 *     md: '1rem'
 *   }
 * }
 * ```
 */
export default interface BrandFoundation {
    // Color scales - full palettes 50-950
    colors: {
        [name: string]:
            | ColorScale
            | {
                  [name: string]: ColorScale
              }
    }

    // Typography scales
    typography: {
        fontFamily: {
            [name: string]: string[]
        }
        fontSize: {
            xs: [string, { lineHeight: string; letterSpacing?: string }]
            sm: [string, { lineHeight: string; letterSpacing?: string }]
            md: [string, { lineHeight: string; letterSpacing?: string }]
            lg: [string, { lineHeight: string; letterSpacing?: string }]
            xl: [string, { lineHeight: string; letterSpacing?: string }]
            '2xl': [string, { lineHeight: string; letterSpacing?: string }]
            '3xl': [string, { lineHeight: string; letterSpacing?: string }]
            '4xl': [string, { lineHeight: string; letterSpacing?: string }]
            '5xl': [string, { lineHeight: string; letterSpacing?: string }]
            '6xl': [string, { lineHeight: string; letterSpacing?: string }]
            '7xl': [string, { lineHeight: string; letterSpacing?: string }]
            '8xl': [string, { lineHeight: string; letterSpacing?: string }]
            '9xl': [string, { lineHeight: string; letterSpacing?: string }]
        }
        letterSpacing: {
            tighter: string
            tight: string
            normal: string
            wide: string
            wider: string
            widest: string
        }
        lineHeight: {
            tight: string
            snug: string
            normal: string
            relaxed: string
            loose: string
        }
    }

    // Spacing scale
    spacing: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
        '5xl': string
        '6xl': string
        '7xl': string
        '8xl': string
        '9xl': string
    }

    // Sizing scale
    sizing: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
        '5xl': string
        '6xl': string
        '7xl': string
        '8xl': string
        '9xl': string
    }

    // Border radius
    radius: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        full: string
    }

    // Border width
    borderWidth: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
    }

    // Box shadows
    boxShadow: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
    }

    // Drop shadows (for filter)
    dropShadow: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
    }

    // Blur
    blur: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
    }

    // Glow effects
    glow: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
    }

    // Breakpoints
    screens: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
    }
}
