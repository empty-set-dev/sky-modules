// Theme generation modes
export type ThemeMode = 'auto-dark' | 'palette'

// 🌙 Theme support interface
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
