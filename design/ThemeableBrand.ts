// 🎨 Themeable Design System Architecture
// Professional approach with CSS variables for light/dark themes

// Base foundation colors - theme-independent
interface FoundationColors {
    // Neutral scales
    gray: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    slate: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    zinc: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    neutral: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    stone: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>

    // Color scales
    red: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    orange: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    amber: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    yellow: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    lime: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    green: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    emerald: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    teal: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    cyan: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    sky: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    blue: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    indigo: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    violet: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    purple: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    fuchsia: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    pink: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
    rose: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>

    // Brand colors
    brand: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
}

// CSS Variables for themeable tokens
type CSSVariable = `var(--${string})`

// Semantic color tokens using CSS variables
interface SemanticColors {
    // Surface colors
    surface: {
        primary: CSSVariable           // var(--surface-primary)
        secondary: CSSVariable         // var(--surface-secondary)
        tertiary: CSSVariable         // var(--surface-tertiary)
        inverse: CSSVariable          // var(--surface-inverse)
        backdrop: CSSVariable         // var(--surface-backdrop)
        overlay: CSSVariable          // var(--surface-overlay)
        raised: CSSVariable           // var(--surface-raised)
        sunken: CSSVariable           // var(--surface-sunken)
        selected: CSSVariable         // var(--surface-selected)
        disabled: CSSVariable         // var(--surface-disabled)
    }

    // Content colors
    content: {
        primary: CSSVariable          // var(--content-primary)
        secondary: CSSVariable        // var(--content-secondary)
        tertiary: CSSVariable        // var(--content-tertiary)
        inverse: CSSVariable         // var(--content-inverse)
        disabled: CSSVariable        // var(--content-disabled)
        placeholder: CSSVariable     // var(--content-placeholder)
        onBrand: CSSVariable         // var(--content-on-brand)
    }

    // Border colors
    border: {
        primary: CSSVariable         // var(--border-primary)
        secondary: CSSVariable       // var(--border-secondary)
        tertiary: CSSVariable       // var(--border-tertiary)
        inverse: CSSVariable        // var(--border-inverse)
        focus: CSSVariable          // var(--border-focus)
        disabled: CSSVariable       // var(--border-disabled)
    }

    // Brand colors with states
    brand: {
        primary: CSSVariable        // var(--brand-primary)
        primaryHover: CSSVariable   // var(--brand-primary-hover)
        primaryActive: CSSVariable  // var(--brand-primary-active)
        primarySubtle: CSSVariable  // var(--brand-primary-subtle)
        secondary: CSSVariable      // var(--brand-secondary)
        secondaryHover: CSSVariable // var(--brand-secondary-hover)
        secondaryActive: CSSVariable // var(--brand-secondary-active)
        secondarySubtle: CSSVariable // var(--brand-secondary-subtle)
    }

    // Status colors with states
    status: {
        success: CSSVariable        // var(--status-success)
        successHover: CSSVariable   // var(--status-success-hover)
        successSubtle: CSSVariable  // var(--status-success-subtle)
        error: CSSVariable          // var(--status-error)
        errorHover: CSSVariable     // var(--status-error-hover)
        errorSubtle: CSSVariable    // var(--status-error-subtle)
        warning: CSSVariable        // var(--status-warning)
        warningHover: CSSVariable   // var(--status-warning-hover)
        warningSubtle: CSSVariable  // var(--status-warning-subtle)
        info: CSSVariable           // var(--status-info)
        infoHover: CSSVariable      // var(--status-info-hover)
        infoSubtle: CSSVariable     // var(--status-info-subtle)
    }

    // Interactive states
    interactive: {
        idle: CSSVariable           // var(--interactive-idle)
        hover: CSSVariable          // var(--interactive-hover)
        active: CSSVariable         // var(--interactive-active)
        focus: CSSVariable          // var(--interactive-focus)
        disabled: CSSVariable       // var(--interactive-disabled)
        selected: CSSVariable       // var(--interactive-selected)
        pressed: CSSVariable        // var(--interactive-pressed)
    }
}

// Theme-specific color mappings
interface ThemeColors {
    // Light theme color mappings
    light: {
        surface: {
            primary: string           // maps to foundation.gray[50]
            secondary: string         // maps to foundation.gray[100]
            tertiary: string         // maps to foundation.gray[200]
            inverse: string          // maps to foundation.gray[900]
            backdrop: string         // maps to foundation.gray[900] with opacity
            overlay: string          // maps to foundation.gray[800] with opacity
            raised: string           // maps to foundation.gray[0] (white)
            sunken: string           // maps to foundation.gray[100]
            selected: string         // maps to foundation.brand[100]
            disabled: string         // maps to foundation.gray[200]
        }
        content: {
            primary: string          // maps to foundation.gray[900]
            secondary: string        // maps to foundation.gray[700]
            tertiary: string        // maps to foundation.gray[500]
            inverse: string         // maps to foundation.gray[50]
            disabled: string        // maps to foundation.gray[400]
            placeholder: string     // maps to foundation.gray[400]
            onBrand: string         // maps to foundation.gray[50]
        }
        border: {
            primary: string         // maps to foundation.gray[300]
            secondary: string       // maps to foundation.gray[200]
            tertiary: string       // maps to foundation.gray[100]
            inverse: string        // maps to foundation.gray[700]
            focus: string          // maps to foundation.brand[500]
            disabled: string       // maps to foundation.gray[200]
        }
        brand: {
            primary: string        // maps to foundation.brand[600]
            primaryHover: string   // maps to foundation.brand[700]
            primaryActive: string  // maps to foundation.brand[800]
            primarySubtle: string  // maps to foundation.brand[100]
            secondary: string      // maps to foundation.brand[500]
            secondaryHover: string // maps to foundation.brand[600]
            secondaryActive: string // maps to foundation.brand[700]
            secondarySubtle: string // maps to foundation.brand[50]
        }
        status: {
            success: string        // maps to foundation.green[600]
            successHover: string   // maps to foundation.green[700]
            successSubtle: string  // maps to foundation.green[100]
            error: string          // maps to foundation.red[600]
            errorHover: string     // maps to foundation.red[700]
            errorSubtle: string    // maps to foundation.red[100]
            warning: string        // maps to foundation.amber[600]
            warningHover: string   // maps to foundation.amber[700]
            warningSubtle: string  // maps to foundation.amber[100]
            info: string           // maps to foundation.blue[600]
            infoHover: string      // maps to foundation.blue[700]
            infoSubtle: string     // maps to foundation.blue[100]
        }
        interactive: {
            idle: string           // maps to foundation.gray[100]
            hover: string          // maps to foundation.gray[200]
            active: string         // maps to foundation.gray[300]
            focus: string          // maps to foundation.brand[500]
            disabled: string       // maps to foundation.gray[200]
            selected: string       // maps to foundation.brand[600]
            pressed: string        // maps to foundation.gray[400]
        }
    }

    // Dark theme color mappings
    dark: {
        surface: {
            primary: string        // maps to foundation.gray[900]
            secondary: string      // maps to foundation.gray[800]
            tertiary: string      // maps to foundation.gray[700]
            inverse: string       // maps to foundation.gray[50]
            backdrop: string      // maps to foundation.gray[950] with opacity
            overlay: string       // maps to foundation.gray[900] with opacity
            raised: string        // maps to foundation.gray[800]
            sunken: string        // maps to foundation.gray[950]
            selected: string      // maps to foundation.brand[900]
            disabled: string      // maps to foundation.gray[800]
        }
        content: {
            primary: string       // maps to foundation.gray[50]
            secondary: string     // maps to foundation.gray[300]
            tertiary: string     // maps to foundation.gray[500]
            inverse: string      // maps to foundation.gray[900]
            disabled: string     // maps to foundation.gray[600]
            placeholder: string  // maps to foundation.gray[600]
            onBrand: string      // maps to foundation.gray[50]
        }
        border: {
            primary: string      // maps to foundation.gray[600]
            secondary: string    // maps to foundation.gray[700]
            tertiary: string    // maps to foundation.gray[800]
            inverse: string     // maps to foundation.gray[300]
            focus: string       // maps to foundation.brand[400]
            disabled: string    // maps to foundation.gray[700]
        }
        brand: {
            primary: string        // maps to foundation.brand[400]
            primaryHover: string   // maps to foundation.brand[300]
            primaryActive: string  // maps to foundation.brand[200]
            primarySubtle: string  // maps to foundation.brand[900]
            secondary: string      // maps to foundation.brand[500]
            secondaryHover: string // maps to foundation.brand[400]
            secondaryActive: string // maps to foundation.brand[300]
            secondarySubtle: string // maps to foundation.brand[950]
        }
        status: {
            success: string        // maps to foundation.green[400]
            successHover: string   // maps to foundation.green[300]
            successSubtle: string  // maps to foundation.green[900]
            error: string          // maps to foundation.red[400]
            errorHover: string     // maps to foundation.red[300]
            errorSubtle: string    // maps to foundation.red[900]
            warning: string        // maps to foundation.amber[400]
            warningHover: string   // maps to foundation.amber[300]
            warningSubtle: string  // maps to foundation.amber[900]
            info: string           // maps to foundation.blue[400]
            infoHover: string      // maps to foundation.blue[300]
            infoSubtle: string     // maps to foundation.blue[900]
        }
        interactive: {
            idle: string           // maps to foundation.gray[800]
            hover: string          // maps to foundation.gray[700]
            active: string         // maps to foundation.gray[600]
            focus: string          // maps to foundation.brand[400]
            disabled: string       // maps to foundation.gray[800]
            selected: string       // maps to foundation.brand[400]
            pressed: string        // maps to foundation.gray[500]
        }
    }
}

// Main themeable brand interface
export default interface ThemeableBrand {
    // Foundation - theme-independent tokens
    foundation: {
        colors: FoundationColors

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

        borderWidth: {
            0: string
            2: string
            4: string
            8: string
            default: string
        }

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

        timingFunction: {
            linear: string
            in: string
            out: string
            inOut: string
        }

        screens: {
            xs: string
            sm: string
            md: string
            lg: string
            xl: string
            '2xl': string
        }
    }

    // Semantic tokens using CSS variables
    semantic: {
        spacing: {
            none: CSSVariable       // var(--spacing-none)
            xs: CSSVariable         // var(--spacing-xs)
            sm: CSSVariable         // var(--spacing-sm)
            md: CSSVariable         // var(--spacing-md)
            lg: CSSVariable         // var(--spacing-lg)
            xl: CSSVariable         // var(--spacing-xl)
            '2xl': CSSVariable      // var(--spacing-2xl)
            '3xl': CSSVariable      // var(--spacing-3xl)
            '4xl': CSSVariable      // var(--spacing-4xl)
            '5xl': CSSVariable      // var(--spacing-5xl)
            '6xl': CSSVariable      // var(--spacing-6xl)
        }

        sizing: {
            xs: CSSVariable         // var(--sizing-xs)
            sm: CSSVariable         // var(--sizing-sm)
            md: CSSVariable         // var(--sizing-md)
            lg: CSSVariable         // var(--sizing-lg)
            xl: CSSVariable         // var(--sizing-xl)
            '2xl': CSSVariable      // var(--sizing-2xl)
            '3xl': CSSVariable      // var(--sizing-3xl)
            '4xl': CSSVariable      // var(--sizing-4xl)
            '5xl': CSSVariable      // var(--sizing-5xl)
            '6xl': CSSVariable      // var(--sizing-6xl)
            full: CSSVariable       // var(--sizing-full)
            screen: CSSVariable     // var(--sizing-screen)
        }

        colors: SemanticColors

        typography: {
            display: {
                large: CSSVariable   // var(--typography-display-large)
                medium: CSSVariable  // var(--typography-display-medium)
                small: CSSVariable   // var(--typography-display-small)
            }
            headline: {
                large: CSSVariable   // var(--typography-headline-large)
                medium: CSSVariable  // var(--typography-headline-medium)
                small: CSSVariable   // var(--typography-headline-small)
            }
            title: {
                large: CSSVariable   // var(--typography-title-large)
                medium: CSSVariable  // var(--typography-title-medium)
                small: CSSVariable   // var(--typography-title-small)
            }
            label: {
                large: CSSVariable   // var(--typography-label-large)
                medium: CSSVariable  // var(--typography-label-medium)
                small: CSSVariable   // var(--typography-label-small)
            }
            body: {
                large: CSSVariable   // var(--typography-body-large)
                medium: CSSVariable  // var(--typography-body-medium)
                small: CSSVariable   // var(--typography-body-small)
            }
        }
    }

    // Theme mappings - how CSS variables map to foundation colors
    themes: ThemeColors

    // Global settings
    global: {
        mode: 'light' | 'dark' | 'auto'

        accessibility: {
            reducedMotion: boolean
            highContrast: boolean
            focusRing: {
                width: string
                style: string
                color: CSSVariable   // var(--focus-ring-color)
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

    // Component tokens using semantic CSS variables
    components: {
        button: {
            variants: {
                primary: {
                    background: CSSVariable         // var(--button-primary-bg)
                    backgroundHover: CSSVariable    // var(--button-primary-bg-hover)
                    backgroundActive: CSSVariable   // var(--button-primary-bg-active)
                    backgroundDisabled: CSSVariable // var(--button-primary-bg-disabled)
                    foreground: CSSVariable         // var(--button-primary-fg)
                    foregroundDisabled: CSSVariable // var(--button-primary-fg-disabled)
                    border: CSSVariable             // var(--button-primary-border)
                    borderHover: CSSVariable        // var(--button-primary-border-hover)
                    borderActive: CSSVariable       // var(--button-primary-border-active)
                    shadow: CSSVariable             // var(--button-primary-shadow)
                    shadowHover: CSSVariable        // var(--button-primary-shadow-hover)
                }
                secondary: {
                    background: CSSVariable         // var(--button-secondary-bg)
                    backgroundHover: CSSVariable    // var(--button-secondary-bg-hover)
                    backgroundActive: CSSVariable   // var(--button-secondary-bg-active)
                    backgroundDisabled: CSSVariable // var(--button-secondary-bg-disabled)
                    foreground: CSSVariable         // var(--button-secondary-fg)
                    foregroundDisabled: CSSVariable // var(--button-secondary-fg-disabled)
                    border: CSSVariable             // var(--button-secondary-border)
                    borderHover: CSSVariable        // var(--button-secondary-border-hover)
                    borderActive: CSSVariable       // var(--button-secondary-border-active)
                    shadow: CSSVariable             // var(--button-secondary-shadow)
                    shadowHover: CSSVariable        // var(--button-secondary-shadow-hover)
                }
                destructive: {
                    background: CSSVariable         // var(--button-destructive-bg)
                    backgroundHover: CSSVariable    // var(--button-destructive-bg-hover)
                    backgroundActive: CSSVariable   // var(--button-destructive-bg-active)
                    backgroundDisabled: CSSVariable // var(--button-destructive-bg-disabled)
                    foreground: CSSVariable         // var(--button-destructive-fg)
                    foregroundDisabled: CSSVariable // var(--button-destructive-fg-disabled)
                    border: CSSVariable             // var(--button-destructive-border)
                    borderHover: CSSVariable        // var(--button-destructive-border-hover)
                    borderActive: CSSVariable       // var(--button-destructive-border-active)
                    shadow: CSSVariable             // var(--button-destructive-shadow)
                    shadowHover: CSSVariable        // var(--button-destructive-shadow-hover)
                }
                ghost: {
                    background: CSSVariable         // var(--button-ghost-bg)
                    backgroundHover: CSSVariable    // var(--button-ghost-bg-hover)
                    backgroundActive: CSSVariable   // var(--button-ghost-bg-active)
                    backgroundDisabled: CSSVariable // var(--button-ghost-bg-disabled)
                    foreground: CSSVariable         // var(--button-ghost-fg)
                    foregroundDisabled: CSSVariable // var(--button-ghost-fg-disabled)
                    border: CSSVariable             // var(--button-ghost-border)
                    borderHover: CSSVariable        // var(--button-ghost-border-hover)
                    borderActive: CSSVariable       // var(--button-ghost-border-active)
                    shadow: CSSVariable             // var(--button-ghost-shadow)
                    shadowHover: CSSVariable        // var(--button-ghost-shadow-hover)
                }
            }
            sizes: {
                xs: {
                    height: string      // foundation token
                    padding: string     // foundation token
                    fontSize: string    // foundation token
                    iconSize: string    // foundation token
                }
                sm: {
                    height: string
                    padding: string
                    fontSize: string
                    iconSize: string
                }
                md: {
                    height: string
                    padding: string
                    fontSize: string
                    iconSize: string
                }
                lg: {
                    height: string
                    padding: string
                    fontSize: string
                    iconSize: string
                }
                xl: {
                    height: string
                    padding: string
                    fontSize: string
                    iconSize: string
                }
            }
        }

        input: {
            background: CSSVariable           // var(--input-bg)
            backgroundHover: CSSVariable      // var(--input-bg-hover)
            backgroundFocus: CSSVariable      // var(--input-bg-focus)
            backgroundDisabled: CSSVariable   // var(--input-bg-disabled)
            foreground: CSSVariable           // var(--input-fg)
            foregroundPlaceholder: CSSVariable // var(--input-fg-placeholder)
            foregroundDisabled: CSSVariable   // var(--input-fg-disabled)
            border: CSSVariable               // var(--input-border)
            borderHover: CSSVariable          // var(--input-border-hover)
            borderFocus: CSSVariable          // var(--input-border-focus)
            borderError: CSSVariable          // var(--input-border-error)
            borderSuccess: CSSVariable        // var(--input-border-success)
            borderDisabled: CSSVariable       // var(--input-border-disabled)
            shadow: CSSVariable               // var(--input-shadow)
            shadowFocus: CSSVariable          // var(--input-shadow-focus)
            iconColor: CSSVariable            // var(--input-icon)
            iconColorDisabled: CSSVariable    // var(--input-icon-disabled)
        }

        // ... other components using CSS variables
    }

    // Animation presets
    animations: {
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

    // Layout system
    layout: {
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
}

// Theme utility types
export type ThemeMode = 'light' | 'dark' | 'auto'
export type ThemeName = keyof ThemeColors