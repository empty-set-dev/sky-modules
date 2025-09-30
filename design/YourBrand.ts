// 🎨 Your Brand System - mode-based structure
// Structure: brand.mode.palette

// Foundation colors - theme-independent
interface FoundationColors {
    gray: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
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
    brand: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
}

// Theme-specific palettes
interface ThemePalettes {
    // Surface colors
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

    // Content colors
    content: {
        primary: string
        secondary: string
        tertiary: string
        inverse: string
        disabled: string
        placeholder: string
        onBrand: string
    }

    // Border colors
    border: {
        primary: string
        secondary: string
        tertiary: string
        inverse: string
        focus: string
        disabled: string
    }

    // Brand colors with states
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

    // Status colors
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

    // Interactive states
    interactive: {
        idle: string
        hover: string
        active: string
        focus: string
        disabled: string
        selected: string
        pressed: string
    }

    // Component-specific palettes
    components: {
        button: {
            primary: {
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
            secondary: {
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
            destructive: {
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
            ghost: {
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
        }

        input: {
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

        card: {
            background: string
            backgroundHover: string
            foreground: string
            border: string
            borderHover: string
            shadow: string
            shadowHover: string
        }

        modal: {
            background: string
            foreground: string
            border: string
            shadow: string
            backdrop: string
            backdropBlur: string
        }

        // ... other components
    }
}

// Main brand interface with your notation: brand.mode.palette
export default interface Brand {
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

    // Theme modes with palettes - YOUR NOTATION: brand.mode.palette
    light: ThemePalettes
    dark: ThemePalettes

    // Semantic spacing that maps to foundation
    spacing: {
        none: string // maps to foundation.spacing.0
        xs: string // maps to foundation.spacing.1
        sm: string // maps to foundation.spacing.2
        md: string // maps to foundation.spacing.4
        lg: string // maps to foundation.spacing.6
        xl: string // maps to foundation.spacing.8
        '2xl': string // maps to foundation.spacing.12
        '3xl': string // maps to foundation.spacing.16
        '4xl': string // maps to foundation.spacing.20
        '5xl': string // maps to foundation.spacing.24
        '6xl': string // maps to foundation.spacing.32
    }

    // Semantic sizing
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

    // Global settings
    global: {
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

// Usage examples with your notation:
// brand.light.surface.primary
// brand.dark.surface.primary
// brand.light.brand.primaryHover
// brand.dark.components.button.primary.background
