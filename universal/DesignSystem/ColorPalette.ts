/**
 * Color scale type for design system palettes
 */
export type ColorScale = {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
}

/**
 * Design system color palette interface
 */
export interface ColorPalette {
    primary: ColorScale
    secondary: ColorScale
    accent: ColorScale
    neutral: ColorScale
    success: ColorScale
    warning: ColorScale
    error: ColorScale
    info: ColorScale
}

/**
 * Semantic color mappings for different contexts
 */
export interface SemanticColors {
    background: {
        default: string
        muted: string
        subtle: string
        emphasis: string
    }
    foreground: {
        default: string
        muted: string
        subtle: string
        emphasis: string
    }
    border: {
        default: string
        muted: string
        subtle: string
        emphasis: string
    }
    ring: string
}

/**
 * Theme configuration for design system
 */
export interface ThemeConfig {
    light: {
        colors: ColorPalette
        semantic: SemanticColors
    }
    dark: {
        colors: ColorPalette
        semantic: SemanticColors
    }
}
