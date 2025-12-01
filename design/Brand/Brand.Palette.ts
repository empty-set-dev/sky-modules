import { DeepInvertColorScale } from '@sky-modules/design/Design/InvertColorScale'

import Brand from '.'

/**
 * Auto-dark theme configuration
 *
 * Automatically generates dark theme by inverting colors from light theme
 *
 * @example
 * ```typescript
 * const autoDark: AutoDarkConfig = {
 *   enabled: true,
 *   invertColors: {
 *     blue: true, // Invert blue scale
 *     gray: true
 *   },
 *   overrides: {
 *     semantic: {
 *       colors: {
 *         background: { primary: 'gray.900' }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface AutoDarkConfig {
    enabled: boolean
    invertColors: DeepInvertColorScale<Brand['foundation']['colors']>
    overrides?: {
        semantic?: Partial<Brand['semantic']>
        components?: Partial<Brand['components']>
    }
}

/**
 * Brand palette (theme variant)
 *
 * Defines a complete theme variant for a brand (light, dark, high-contrast, etc.)
 *
 * Can use:
 * - `autoDark` - Automatically generate dark theme from light
 * - `light`/`dark` - Explicit theme definitions
 * - `generateDarkTheme` - Custom function to generate dark theme
 *
 * @example
 * ```typescript
 * const palette: BrandPalette = {
 *   autoDark: {
 *     enabled: true,
 *     invertColors: { blue: true }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * const palette: BrandPalette = {
 *   light: { ... },
 *   dark: { ... }
 * }
 * ```
 */
export default interface BrandPalette {
    autoDark?: AutoDarkConfig
    light?: Brand.Theme
    dark?: Brand.Theme
    generateDarkTheme?: (lightTheme: Brand.Palette) => Brand.Palette
}
