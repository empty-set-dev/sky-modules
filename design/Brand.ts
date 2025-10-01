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
export interface ThemePalettes {
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
        full: string
        screen: string
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

    // Semantic opacity
    opacity: {
        disabled: string
        subtle: string
        medium: string
        visible: string
        hidden: string
        overlay: string
        backdrop: string
    }

    // Semantic duration
    duration: {
        instant: string
        fast: string
        normal: string
        slow: string
        slower: string
    }

    // Semantic z-index
    zIndex: {
        dropdown: number
        sticky: number
        fixed: number
        modal: number
        popover: number
        tooltip: number
        toast: number
        overlay: number
    }

    // Semantic glow
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

    // Semantic animations
    animations: {
        primaryIn: string
        primaryOut: string
        primaryInOut: string
        secondaryIn: string
        secondaryOut: string
        secondaryInOut: string
        tertiaryIn: string
        tertiaryOut: string
        tertiaryInOut: string
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
    theme: 'light' | 'dark' | 'auto'
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
    prose: ProseComponent
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

interface ProseComponent {
    // Base prose styles
    maxWidth: string
    color: string
    fontSize: string
    lineHeight: string
    fontFamily: string

    // Headings
    h1: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h2: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h3: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h4: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h5: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h6: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }

    // Text elements
    p: {
        marginTop: string
        marginBottom: string
    }
    lead: {
        color: string
        fontSize: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    strong: {
        color: string
        fontWeight: string
    }
    em: {
        color: string
        fontStyle: string
    }

    // Links
    a: {
        color: string
        textDecoration: string
        fontWeight: string
    }
    'a:hover': {
        color: string
        textDecoration: string
    }

    // Lists
    ul: {
        listStyleType: string
        marginTop: string
        marginBottom: string
        paddingLeft: string
    }
    ol: {
        listStyleType: string
        marginTop: string
        marginBottom: string
        paddingLeft: string
    }
    li: {
        marginTop: string
        marginBottom: string
    }

    // Code
    code: {
        color: string
        backgroundColor: string
        fontFamily: string
        fontSize: string
        fontWeight: string
        padding: string
        borderRadius: string
    }
    pre: {
        color: string
        backgroundColor: string
        fontFamily: string
        fontSize: string
        lineHeight: string
        marginTop: string
        marginBottom: string
        padding: string
        borderRadius: string
        overflowX: string
    }
    'pre code': {
        backgroundColor: string
        color: string
        fontSize: string
        fontWeight: string
        padding: string
    }

    // Blockquotes
    blockquote: {
        fontWeight: string
        fontStyle: string
        color: string
        borderLeft: string
        borderColor: string
        quotes: string
        marginTop: string
        marginBottom: string
        paddingLeft: string
    }
    'blockquote p:first-of-type::before': {
        content: string
    }
    'blockquote p:last-of-type::after': {
        content: string
    }

    // Tables
    table: {
        width: string
        tableLayout: string
        textAlign: string
        marginTop: string
        marginBottom: string
        fontSize: string
        lineHeight: string
    }
    thead: {
        borderBottomWidth: string
        borderBottomColor: string
    }
    'thead th': {
        color: string
        fontWeight: string
        verticalAlign: string
        paddingRight: string
        paddingBottom: string
        paddingLeft: string
    }
    'tbody tr': {
        borderBottomWidth: string
        borderBottomColor: string
    }
    'tbody td': {
        verticalAlign: string
        paddingTop: string
        paddingRight: string
        paddingBottom: string
        paddingLeft: string
    }

    // Images & Media
    img: {
        marginTop: string
        marginBottom: string
    }
    video: {
        marginTop: string
        marginBottom: string
    }
    figure: {
        marginTop: string
        marginBottom: string
    }
    'figure > *': {
        marginTop: string
        marginBottom: string
    }
    figcaption: {
        color: string
        fontSize: string
        lineHeight: string
        marginTop: string
    }

    // Horizontal rules
    hr: {
        borderColor: string
        borderTopWidth: string
        marginTop: string
        marginBottom: string
    }

    // Size variants
    sm: {
        fontSize: string
        lineHeight: string
        p: { marginTop: string; marginBottom: string }
        h1: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h2: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h3: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h4: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h5: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h6: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        code: { fontSize: string }
        pre: {
            fontSize: string
            lineHeight: string
            marginTop: string
            marginBottom: string
            borderRadius: string
            padding: string
        }
    }
    lg: {
        fontSize: string
        lineHeight: string
        p: { marginTop: string; marginBottom: string }
        h1: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h2: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h3: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h4: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h5: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h6: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        code: { fontSize: string }
        pre: {
            fontSize: string
            lineHeight: string
            marginTop: string
            marginBottom: string
            borderRadius: string
            padding: string
        }
    }
    xl: {
        fontSize: string
        lineHeight: string
        p: { marginTop: string; marginBottom: string }
        h1: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h2: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h3: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h4: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h5: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h6: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        code: { fontSize: string }
        pre: {
            fontSize: string
            lineHeight: string
            marginTop: string
            marginBottom: string
            borderRadius: string
            padding: string
        }
    }
    '2xl': {
        fontSize: string
        lineHeight: string
        p: { marginTop: string; marginBottom: string }
        h1: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h2: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h3: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h4: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h5: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h6: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        code: { fontSize: string }
        pre: {
            fontSize: string
            lineHeight: string
            marginTop: string
            marginBottom: string
            borderRadius: string
            padding: string
        }
    }

    // Color variants
    invert: {
        color: string
        a: { color: string }
        strong: { color: string }
        code: { color: string; backgroundColor: string }
        pre: { color: string; backgroundColor: string }
        'pre code': { color: string }
        blockquote: { borderColor: string; color: string }
        'thead th': { color: string }
        'tbody tr': { borderBottomColor: string }
        hr: { borderColor: string }
        h1: { color: string }
        h2: { color: string }
        h3: { color: string }
        h4: { color: string }
        h5: { color: string }
        h6: { color: string }
        figcaption: { color: string }
        lead: { color: string }
    }
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
    // 🏷️ Brand identity
    name: string // Brand name for data-brand attribute (e.g., 'sky', 'custom')
    extends?: BrandDescription[] // Base brand(s) to extend from

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

    // 📐 Layout system
    layout: BrandLayout

    // 🌙 Theme Support - Two approaches
    themes?: BrandThemes

    // 🎛️ Theme-aware semantic colors (when themes are enabled)
    themeSemantics?: BrandThemeSemantics
}

export interface BrandDescription extends DeepPartial<Brand> {
    // Override for BrandDescription - name is required
    name: string
}
