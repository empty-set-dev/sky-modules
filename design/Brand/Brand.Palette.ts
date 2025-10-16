import { DeepInvertColorScale } from '@sky-modules/design/Design/InvertColorScale'

import Brand from '.'

export interface BrandPaletteTheme {
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

export interface AutoDarkConfig {
    enabled: boolean
    invertColors: DeepInvertColorScale<Brand['foundation']['colors']>
    overrides?: {
        semantic?: Partial<Brand['semantic']>
        components?: Partial<Brand['components']>
    }
}

// Palette structure from YourBrand approach
export default interface BrandPalette {
    autoDark?: AutoDarkConfig
    light?: BrandPaletteTheme
    dark?: BrandPaletteTheme
    generateDarkTheme?: (lightTheme: BrandPalette) => BrandPalette
}
