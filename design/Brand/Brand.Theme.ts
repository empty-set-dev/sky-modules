import Brand from './Brand'

// 🎨 Theme support utilities
type InvertColorScale<T extends Record<number, string>> = {
    [K in keyof T]: T[K extends 50
        ? 950
        : K extends 100
          ? 900
          : K extends 200
            ? 800
            : K extends 300
              ? 700
              : K extends 400
                ? 600
                : K extends 500
                  ? 500
                  : K extends 600
                    ? 400
                    : K extends 700
                      ? 300
                      : K extends 800
                        ? 200
                        : K extends 900
                          ? 100
                          : K extends 950
                            ? 50
                            : never]
}

// Theme generation modes
export type ThemeMode = 'auto-dark' | 'palette'

// Enhanced theme utilities
export interface ThemeConfig {
    mode: ThemeMode
    defaultMode: 'light' | 'dark' | 'auto' | string
    autoGenerate: boolean
    customThemes?: string[]
}

export interface AutoDarkConfig {
    enabled: boolean
    invertColors: InvertColorScale<Brand['foundation']['colors']>
    overrides?: {
        semantic?: Partial<Brand['semantic']>
        components?: Partial<Brand['components']>
    }
}

export interface PaletteConfig {
    light: ThemePalettes
    dark: ThemePalettes
    [customTheme: string]: ThemePalettes
}

// Theme context for runtime
export interface ThemeContext {
    currentTheme: string
    availableThemes: string[]
    switchTheme: (theme: string) => void
    getThemeColors: (theme?: string) => ThemePalettes
}

// 🌙 Theme support interfaces
export default interface BrandThemes {
    autoDark?: AutoDarkConfig
    palettes?: PaletteConfig
    mode: ThemeMode
    defaultMode: 'light' | 'dark' | string
    generateDarkTheme?: (lightTheme: ThemePalettes) => ThemePalettes
    customThemeMapping?: Record<string, ThemePalettes>
}

export interface ThemeSemantics {
    light?: ThemePalettes
    dark?: ThemePalettes
    [themeName: string]: ThemePalettes | undefined
}

// Palette structure from YourBrand approach
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
        primary: string
        primaryHover: string
        primaryActive: string
        primarySubtle: string
        secondary: string
        secondaryHover: string
        secondaryActive: string
        secondarySubtle: string
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
