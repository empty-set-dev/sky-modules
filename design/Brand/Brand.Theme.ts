/**
 * Theme generation modes
 *
 * - `auto-dark` - Automatically generate dark theme by inverting colors
 * - `palette` - Use explicit palette definitions (light/dark)
 */
export type ThemeMode = 'auto-dark' | 'palette'

/**
 * Brand theme colors for a specific palette (light, dark, etc.)
 *
 * Defines all color tokens for surfaces, content, borders, brand colors,
 * status indicators, and interactive states.
 *
 * @example
 * ```typescript
 * const lightTheme: BrandTheme = {
 *   surface: {
 *     primary: 'white',
 *     secondary: 'gray.50',
 *     tertiary: 'gray.100'
 *   },
 *   content: {
 *     primary: 'gray.900',
 *     secondary: 'gray.700',
 *     tertiary: 'gray.500'
 *   },
 *   brand: {
 *     primaryHover: 'blue.600',
 *     primaryActive: 'blue.700'
 *   }
 * }
 * ```
 */
export default interface BrandTheme {
    surface: {
        primary: string
        secondary: string
        tertiary: string
        inverse: string
        backdrop: string
        overlay: string
        raised: string
        sunken: string
        selected: string
        disabled: string
    }
    content: {
        primary: string
        secondary: string
        tertiary: string
        inverse: string
        disabled: string
        placeholder: string
        onBrand: string
    }
    border: {
        primary: string
        secondary: string
        tertiary: string
        inverse: string
        focus: string
        disabled: string
    }
    brand: {
        primaryHover: string
        primaryActive: string
        primarySubtle: string
        secondaryHover: string
        secondaryActive: string
        secondarySubtle: string
        tertiaryHover: string
        tertiaryActive: string
        tertiarySubtle: string
    }
    status: {
        success: string
        successHover: string
        successSubtle: string
        error: string
        errorHover: string
        errorSubtle: string
        warning: string
        warningHover: string
        warningSubtle: string
        info: string
        infoHover: string
        infoSubtle: string
    }
    interactive: {
        idle: string
        hover: string
        active: string
        focus: string
        disabled: string
        selected: string
        pressed: string
    }
}
