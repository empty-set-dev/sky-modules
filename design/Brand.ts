import type { DeepPartial } from '@sky-modules/core/DeepPartial'

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

// Palette structure from YourBrand approach
interface ThemePalettes {
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

// Theme generation modes
type ThemeMode = 'auto-dark' | 'palette'

// Enhanced theme utilities
export interface ThemeConfig {
    mode: ThemeMode
    defaultMode: 'light' | 'dark' | string
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

// Color scale type for consistent color definitions
type ColorScale = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>

// 🏗️ Foundation - atomic design tokens
export interface BrandFoundation {
    // Color scales - full palettes 50-950
    colors: {
        gray: ColorScale
        red: ColorScale
        orange: ColorScale
        amber: ColorScale
        yellow: ColorScale
        lime: ColorScale
        green: ColorScale
        emerald: ColorScale
        teal: ColorScale
        cyan: ColorScale
        sky: ColorScale
        blue: ColorScale
        indigo: ColorScale
        violet: ColorScale
        purple: ColorScale
        fuchsia: ColorScale
        pink: ColorScale
        rose: ColorScale

        // Brand colors with full scale
        brand: ColorScale
    }

    // Typography scales
    typography: {
        fontFamily: {
            sans: string[]
            serif: string[]
            mono: string[]
            display: string[]
        }
        fontSize: {
            xs: [string, { lineHeight: string; letterSpacing?: string }]
            sm: [string, { lineHeight: string; letterSpacing?: string }]
            base: [string, { lineHeight: string; letterSpacing?: string }]
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
        fontWeight: {
            thin: number
            extralight: number
            light: number
            normal: number
            medium: number
            semibold: number
            bold: number
            extrabold: number
            black: number
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
            none: string
            tight: string
            snug: string
            normal: string
            relaxed: string
            loose: string
        }
    }

    // Spacing scale
    spacing: {
        px: string
        0: string
        0.5: string
        1: string
        1.5: string
        2: string
        2.5: string
        3: string
        3.5: string
        4: string
        5: string
        6: string
        7: string
        8: string
        9: string
        10: string
        11: string
        12: string
        14: string
        16: string
        20: string
        24: string
        28: string
        32: string
        36: string
        40: string
        44: string
        48: string
        52: string
        56: string
        60: string
        64: string
        72: string
        80: string
        96: string
    }

    // Border radius
    borderRadius: {
        none: string
        sm: string
        base: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        full: string
    }

    // Border width
    borderWidth: {
        0: string
        2: string
        4: string
        8: string
        default: string
    }

    // Box shadows
    boxShadow: {
        xs: string
        sm: string
        base: string
        md: string
        lg: string
        xl: string
        '2xl': string
        inner: string
        none: string
    }

    // Drop shadows (for filter)
    dropShadow: {
        sm: string
        base: string
        md: string
        lg: string
        xl: string
        '2xl': string
        none: string
    }

    // Glow effects
    glow: {
        xs: string
        sm: string
        base: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        none: string
    }

    // Blur
    blur: {
        none: string
        sm: string
        base: string
        md: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
    }

    // Opacity
    opacity: {
        0: string
        5: string
        10: string
        15: string
        20: string
        25: string
        30: string
        40: string
        50: string
        60: string
        70: string
        75: string
        80: string
        85: string
        90: string
        95: string
        100: string
    }

    // Z-index
    zIndex: {
        auto: string
        0: number
        10: number
        20: number
        30: number
        40: number
        50: number
        dropdown: number
        sticky: number
        fixed: number
        modal: number
        popover: number
        tooltip: number
        toast: number
        overlay: number
    }

    // Animation durations
    duration: {
        75: string
        100: string
        150: string
        200: string
        300: string
        500: string
        700: string
        1000: string
    }

    // Animation timing functions
    timingFunction: {
        linear: string
        in: string
        out: string
        inOut: string
    }

    // Breakpoints
    screens: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
    }
}

// 🎨 Semantic tokens - role-based tokens
export interface BrandSemantic {
    spacing: {
        none: string
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
    }

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
        full: string
        screen: string
    }

    colors: {
        background: {
            primary: string
            secondary: string
            tertiary: string
            inverse: string
            backdrop: string
            overlay: string
            scrim: string
        }
        foreground: {
            primary: string
            secondary: string
            tertiary: string
            inverse: string
            disabled: string
            placeholder: string
        }
        border: {
            primary: string
            secondary: string
            tertiary: string
            inverse: string
            focus: string
            error: string
            warning: string
            success: string
            info: string
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
            successActive: string
            successSubtle: string
            error: string
            errorHover: string
            errorActive: string
            errorSubtle: string
            warning: string
            warningHover: string
            warningActive: string
            warningSubtle: string
            info: string
            infoHover: string
            infoActive: string
            infoSubtle: string
        }
        surface: {
            raised: string
            overlay: string
            sunken: string
            selected: string
            disabled: string
        }
        effects: {
            // Primary/Secondary/Tertiary hierarchy
            glowPrimary: string
            glowSecondary: string
            glowTertiary: string

            // Interactive states
            glowFocus: string
            glowHover: string
            glowActive: string
            glowSubtle: string
            glowStrong: string

            // Contextual glows
            glowBrand: string
            glowSuccess: string
            glowError: string
            glowWarning: string
            glowInfo: string
        }
    }

    typography: {
        display: {
            large: string
            medium: string
            small: string
        }
        headline: {
            large: string
            medium: string
            small: string
        }
        title: {
            large: string
            medium: string
            small: string
        }
        label: {
            large: string
            medium: string
            small: string
        }
        body: {
            large: string
            medium: string
            small: string
        }
    }
}

// 🌍 Global tokens - application-wide settings
export interface BrandGlobal {
    mode: 'light' | 'dark' | 'auto'
    accessibility: {
        reducedMotion: boolean
        highContrast: boolean
        focusRing: {
            width: string
            style: string
            color: string
            offset: string
        }
    }
    i18n: {
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
    content: {
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
            edit: string
            create: string
            update: string
            search: string
            filter: string
            sort: string
            more: string
            less: string
            previous: string
            next: string
            close: string
            open: string
        }
    }
}

// 🎭 Component tokens - component-specific styles
export interface BrandComponents {
    button: {
        variants: {
            primary: ButtonVariant
            secondary: ButtonVariant
            tertiary: ButtonVariant
            destructive: ButtonVariant
            ghost: ButtonVariant
        }
        sizes: {
            xs: ButtonSize
            sm: ButtonSize
            md: ButtonSize
            lg: ButtonSize
            xl: ButtonSize
        }
    }
    input: InputComponent
    textarea: TextareaComponent
    select: SelectComponent
    checkbox: CheckboxComponent
    radio: RadioComponent
    switch: SwitchComponent
    card: CardComponent
    modal: ModalComponent
    popover: PopoverComponent
    tooltip: TooltipComponent
    dropdown: DropdownComponent
    navbar: NavbarComponent
    sidebar: SidebarComponent
    breadcrumb: BreadcrumbComponent
    table: TableComponent
    alert: AlertComponent
    toast: ToastComponent
    progress: ProgressComponent
    spinner: SpinnerComponent
    badge: BadgeComponent
    avatar: AvatarComponent
    tabs: TabsComponent
    pagination: PaginationComponent
}

// Component type definitions
interface ButtonVariant {
    background: string
    backgroundHover: string
    backgroundActive: string
    backgroundDisabled: string
    foreground: string
    foregroundDisabled: string
    border: string
    borderHover: string
    borderActive: string
    shadow: string
    shadowHover: string
}

interface ButtonSize {
    height: string
    padding: string
    fontSize: string
    iconSize: string
}

interface InputComponent {
    background: string
    backgroundHover: string
    backgroundFocus: string
    backgroundDisabled: string
    foreground: string
    foregroundPlaceholder: string
    foregroundDisabled: string
    border: string
    borderHover: string
    borderFocus: string
    borderError: string
    borderSuccess: string
    borderDisabled: string
    shadow: string
    shadowFocus: string
    iconColor: string
    iconColorDisabled: string
}

interface TextareaComponent extends InputComponent {
    resize: 'none' | 'vertical' | 'horizontal' | 'both'
}

interface SelectComponent extends InputComponent {
    icon: string
    iconDisabled: string
    dropdown: {
        background: string
        border: string
        shadow: string
        maxHeight: string
    }
    option: {
        background: string
        backgroundHover: string
        backgroundSelected: string
        foreground: string
        foregroundSelected: string
    }
}

interface CheckboxComponent {
    background: string
    backgroundChecked: string
    backgroundDisabled: string
    border: string
    borderChecked: string
    borderDisabled: string
    checkmark: string
    checkmarkDisabled: string
    shadow: string
    shadowFocus: string
}

interface RadioComponent {
    background: string
    backgroundChecked: string
    backgroundDisabled: string
    border: string
    borderChecked: string
    borderDisabled: string
    dot: string
    dotDisabled: string
    shadow: string
    shadowFocus: string
}

interface SwitchComponent {
    track: string
    trackChecked: string
    trackDisabled: string
    thumb: string
    thumbChecked: string
    thumbDisabled: string
    shadow: string
    shadowFocus: string
}

interface CardComponent {
    background: string
    backgroundHover: string
    foreground: string
    border: string
    borderHover: string
    shadow: string
    shadowHover: string
    radius: string
    padding: string
    header: ComponentSection
    footer: ComponentSection
}

interface ComponentSection {
    background: string
    foreground: string
    border: string
    padding: string
}

interface ModalComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    radius: string
    backdrop: string
    backdropBlur: string
    maxWidth: string
    padding: string
    header: ComponentSection
    footer: ComponentSection
}

interface PopoverComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    radius: string
    padding: string
    arrow: {
        size: string
        color: string
    }
}

interface TooltipComponent extends PopoverComponent {
    fontSize: string
    maxWidth: string
}

interface DropdownComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    radius: string
    maxHeight: string
    item: {
        background: string
        backgroundHover: string
        backgroundActive: string
        foreground: string
        foregroundActive: string
        padding: string
        fontSize: string
    }
    separator: {
        color: string
        margin: string
    }
}

interface NavbarComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    height: string
    padding: string
    logo: {
        height: string
        width: string
    }
    link: {
        foreground: string
        foregroundHover: string
        foregroundActive: string
        padding: string
    }
}

interface SidebarComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    width: string
    padding: string
    item: {
        background: string
        backgroundHover: string
        backgroundActive: string
        foreground: string
        foregroundActive: string
        padding: string
        radius: string
    }
}

interface BreadcrumbComponent {
    foreground: string
    foregroundHover: string
    foregroundActive: string
    separator: string
    separatorColor: string
    fontSize: string
    spacing: string
}

interface TableComponent {
    background: string
    foreground: string
    border: string
    radius: string
    header: {
        background: string
        foreground: string
        border: string
        fontWeight: string
        fontSize: string
        padding: string
    }
    row: {
        background: string
        backgroundHover: string
        backgroundSelected: string
        border: string
    }
    cell: {
        padding: string
        fontSize: string
        lineHeight: string
    }
}

interface AlertComponent {
    variants: {
        info: AlertVariant
        success: AlertVariant
        warning: AlertVariant
        error: AlertVariant
    }
    padding: string
    radius: string
    fontSize: string
    iconSize: string
}

interface AlertVariant {
    background: string
    foreground: string
    border: string
    icon: string
}

interface ToastComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    radius: string
    padding: string
    fontSize: string
    maxWidth: string
    variants: {
        success: AlertVariant
        error: AlertVariant
        warning: AlertVariant
        info: AlertVariant
    }
}

interface ProgressComponent {
    track: string
    indicator: string
    label: string
    height: string
    radius: string
    animation: string
}

interface SpinnerComponent {
    color: string
    size: string
    strokeWidth: string
    animation: string
}

interface BadgeComponent {
    variants: {
        default: AlertVariant
        secondary: AlertVariant
        success: AlertVariant
        error: AlertVariant
        warning: AlertVariant
        info: AlertVariant
    }
    sizes: {
        sm: ButtonSize
        md: ButtonSize
        lg: ButtonSize
    }
    radius: string
}

interface AvatarComponent {
    background: string
    foreground: string
    border: string
    placeholder: string
    sizes: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
    }
    radius: string
}

interface TabsComponent {
    background: string
    foreground: string
    border: string
    tab: {
        background: string
        backgroundHover: string
        backgroundActive: string
        foreground: string
        foregroundActive: string
        border: string
        borderActive: string
        padding: string
        fontSize: string
    }
    content: {
        background: string
        padding: string
    }
    indicator: {
        color: string
        height: string
    }
}

interface PaginationComponent {
    background: string
    foreground: string
    border: string
    item: {
        background: string
        backgroundHover: string
        backgroundActive: string
        foreground: string
        foregroundActive: string
        border: string
        borderActive: string
        padding: string
        fontSize: string
        minWidth: string
    }
    gap: string
}

// 📊 Data visualization tokens
export interface BrandCharts {
    colors: {
        categorical: string[]
        sequential: string[]
        diverging: string[]
        qualitative: string[]
    }
    grid: {
        color: string
        strokeWidth: string
        strokeDasharray: string
    }
    axis: {
        color: string
        strokeWidth: string
        fontSize: string
        fontWeight: string
    }
    legend: {
        background: string
        foreground: string
        border: string
        padding: string
        fontSize: string
        spacing: string
    }
    tooltip: {
        background: string
        foreground: string
        border: string
        shadow: string
        padding: string
        fontSize: string
        radius: string
    }
}

// 🎵 Animation presets
export interface BrandAnimations {
    fadeIn: string
    slideInUp: string
    slideInDown: string
    slideInLeft: string
    slideInRight: string
    scaleIn: string
    zoomIn: string
    fadeOut: string
    slideOutUp: string
    slideOutDown: string
    slideOutLeft: string
    slideOutRight: string
    scaleOut: string
    zoomOut: string
    bounce: string
    flash: string
    pulse: string
    shake: string
    swing: string
    wobble: string
    spin: string
    ping: string
    keyframes: {
        fadeIn: Record<string, Record<string, string>>
        slideIn: Record<string, Record<string, string>>
        bounce: Record<string, Record<string, string>>
        spin: Record<string, Record<string, string>>
        pulse: Record<string, Record<string, string>>
    }
}

// 📐 Layout system
export interface BrandLayout {
    container: {
        center: boolean
        padding: {
            default: string
            sm: string
            md: string
            lg: string
            xl: string
            '2xl': string
        }
        maxWidth: {
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
            full: string
        }
    }
    grid: {
        columns: {
            1: string
            2: string
            3: string
            4: string
            5: string
            6: string
            7: string
            8: string
            9: string
            10: string
            11: string
            12: string
        }
        gap: {
            0: string
            1: string
            2: string
            3: string
            4: string
            5: string
            6: string
            7: string
            8: string
            9: string
            10: string
            11: string
            12: string
        }
    }
    flex: {
        basis: {
            auto: string
            full: string
            '1/2': string
            '1/3': string
            '2/3': string
            '1/4': string
            '3/4': string
        }
        grow: {
            0: string
            1: string
        }
        shrink: {
            0: string
            1: string
        }
    }
}

// 🌙 Theme support interfaces
export interface BrandThemes {
    autoDark?: AutoDarkConfig
    palettes?: PaletteConfig
    mode: ThemeMode
    defaultMode: 'light' | 'dark' | string
    generateDarkTheme?: (lightTheme: ThemePalettes) => ThemePalettes
    customThemeMapping?: Record<string, ThemePalettes>
}

export interface BrandThemeSemantics {
    current: {
        surface: ThemePalettes['surface']
        content: ThemePalettes['content']
        border: ThemePalettes['border']
        brand: ThemePalettes['brand']
        status: ThemePalettes['status']
        interactive: ThemePalettes['interactive']
    }
    light?: ThemePalettes
    dark?: ThemePalettes
    [themeName: string]: ThemePalettes | undefined
}

export default interface Brand {
    // 🏗️ Foundation - atomic design tokens
    foundation: BrandFoundation

    // 🎨 Semantic tokens - role-based tokens
    semantic: BrandSemantic

    // 🌍 Global tokens - application-wide settings
    global: BrandGlobal

    // 🎭 Component tokens - component-specific styles
    components: BrandComponents

    // 📊 Data visualization tokens
    charts: BrandCharts

    // 🎵 Animation presets
    animations: BrandAnimations

    // 📐 Layout system
    layout: BrandLayout

    // 🌙 Theme Support - Two approaches
    themes?: BrandThemes

    // 🎛️ Theme-aware semantic colors (when themes are enabled)
    themeSemantics?: BrandThemeSemantics
}

export type BrandDescription = DeepPartial<Brand>
