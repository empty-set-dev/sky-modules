export default interface Brand {
    // 🏗️ Foundation - atomic design tokens
    foundation: {
        // Color scales - full palettes 50-950
        colors: {
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

            // Brand colors with full scale
            brand: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>
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
    semantic: {
        // Semantic spacing
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

        // Colors by role
        colors: {
            // Background colors
            background: {
                primary: string
                secondary: string
                tertiary: string
                inverse: string
                backdrop: string
                overlay: string
                scrim: string
            }

            // Foreground colors
            foreground: {
                primary: string
                secondary: string
                tertiary: string
                inverse: string
                disabled: string
                placeholder: string
            }

            // Border colors
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

            // Brand colors
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

            // Surface colors
            surface: {
                raised: string
                overlay: string
                sunken: string
                selected: string
                disabled: string
            }
        }

        // Typography by role
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
    global: {
        // Theme mode
        mode: 'light' | 'dark' | 'auto'

        // Accessibility
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

        // Internationalization
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

        // Content guidelines
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
    components: {
        // Button variants
        button: {
            variants: {
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
                tertiary: {
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
            sizes: {
                xs: {
                    height: string
                    padding: string
                    fontSize: string
                    iconSize: string
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

        // Input components
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

        textarea: {
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
            resize: 'none' | 'vertical' | 'horizontal' | 'both'
        }

        select: {
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
            borderDisabled: string
            shadow: string
            shadowFocus: string
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

        // Form controls
        checkbox: {
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

        radio: {
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

        switch: {
            track: string
            trackChecked: string
            trackDisabled: string
            thumb: string
            thumbChecked: string
            thumbDisabled: string
            shadow: string
            shadowFocus: string
        }

        // Layout components
        card: {
            background: string
            backgroundHover: string
            foreground: string
            border: string
            borderHover: string
            shadow: string
            shadowHover: string
            radius: string
            padding: string
            header: {
                background: string
                foreground: string
                border: string
                padding: string
            }
            footer: {
                background: string
                foreground: string
                border: string
                padding: string
            }
        }

        // Overlay components
        modal: {
            background: string
            foreground: string
            border: string
            shadow: string
            radius: string
            backdrop: string
            backdropBlur: string
            maxWidth: string
            padding: string
            header: {
                background: string
                foreground: string
                border: string
                padding: string
            }
            footer: {
                background: string
                foreground: string
                border: string
                padding: string
            }
        }

        popover: {
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

        tooltip: {
            background: string
            foreground: string
            border: string
            shadow: string
            radius: string
            padding: string
            fontSize: string
            maxWidth: string
            arrow: {
                size: string
                color: string
            }
        }

        dropdown: {
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

        // Navigation
        navbar: {
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

        sidebar: {
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

        breadcrumb: {
            foreground: string
            foregroundHover: string
            foregroundActive: string
            separator: string
            separatorColor: string
            fontSize: string
            spacing: string
        }

        // Data display
        table: {
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

        // Feedback
        alert: {
            variants: {
                info: {
                    background: string
                    foreground: string
                    border: string
                    icon: string
                }
                success: {
                    background: string
                    foreground: string
                    border: string
                    icon: string
                }
                warning: {
                    background: string
                    foreground: string
                    border: string
                    icon: string
                }
                error: {
                    background: string
                    foreground: string
                    border: string
                    icon: string
                }
            }
            padding: string
            radius: string
            fontSize: string
            iconSize: string
        }

        toast: {
            background: string
            foreground: string
            border: string
            shadow: string
            radius: string
            padding: string
            fontSize: string
            maxWidth: string
            variants: {
                success: {
                    background: string
                    foreground: string
                    border: string
                    icon: string
                }
                error: {
                    background: string
                    foreground: string
                    border: string
                    icon: string
                }
                warning: {
                    background: string
                    foreground: string
                    border: string
                    icon: string
                }
                info: {
                    background: string
                    foreground: string
                    border: string
                    icon: string
                }
            }
        }

        // Progress indicators
        progress: {
            track: string
            indicator: string
            label: string
            height: string
            radius: string
            animation: string
        }

        spinner: {
            color: string
            size: string
            strokeWidth: string
            animation: string
        }

        // Miscellaneous
        badge: {
            variants: {
                default: {
                    background: string
                    foreground: string
                    border: string
                }
                secondary: {
                    background: string
                    foreground: string
                    border: string
                }
                success: {
                    background: string
                    foreground: string
                    border: string
                }
                error: {
                    background: string
                    foreground: string
                    border: string
                }
                warning: {
                    background: string
                    foreground: string
                    border: string
                }
                info: {
                    background: string
                    foreground: string
                    border: string
                }
            }
            sizes: {
                sm: {
                    fontSize: string
                    padding: string
                    height: string
                }
                md: {
                    fontSize: string
                    padding: string
                    height: string
                }
                lg: {
                    fontSize: string
                    padding: string
                    height: string
                }
            }
            radius: string
        }

        avatar: {
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

        tabs: {
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

        pagination: {
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
    }

    // 📊 Data visualization tokens
    charts: {
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
    animations: {
        // Entrance animations
        fadeIn: string
        slideInUp: string
        slideInDown: string
        slideInLeft: string
        slideInRight: string
        scaleIn: string
        zoomIn: string

        // Exit animations
        fadeOut: string
        slideOutUp: string
        slideOutDown: string
        slideOutLeft: string
        slideOutRight: string
        scaleOut: string
        zoomOut: string

        // Attention seekers
        bounce: string
        flash: string
        pulse: string
        shake: string
        swing: string
        wobble: string

        // Loading states
        spin: string
        ping: string

        // Keyframes
        keyframes: {
            fadeIn: Record<string, Record<string, string>>
            slideIn: Record<string, Record<string, string>>
            bounce: Record<string, Record<string, string>>
            spin: Record<string, Record<string, string>>
            pulse: Record<string, Record<string, string>>
        }
    }

    // 📐 Layout system
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
