// 🎨 Semantic tokens - role-based tokens
export default interface BrandSemantic {
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
            primaryHover: string
            primaryActive: string
            primarySubtle: string
            primaryMuted: string
            primaryEmphasis: string
            secondaryHover: string
            secondaryActive: string
            secondarySubtle: string
            secondaryMuted: string
            secondaryEmphasis: string
            tertiaryHover: string
            tertiaryActive: string
            tertiarySubtle: string
            tertiaryMuted: string
            tertiaryEmphasis: string
        }
        status: {
            success: string
            successHover: string
            successActive: string
            successSubtle: string
            successMuted: string
            successEmphasis: string
            error: string
            errorHover: string
            errorActive: string
            errorSubtle: string
            errorMuted: string
            errorEmphasis: string
            warning: string
            warningHover: string
            warningActive: string
            warningSubtle: string
            warningMuted: string
            warningEmphasis: string
            info: string
            infoHover: string
            infoActive: string
            infoSubtle: string
            infoMuted: string
            infoEmphasis: string
        }
        surface: {
            overlay: string
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

    // Semantic border radius
    radius: {
        interactive: string
        container: string
        overlay: string
        embedded: string
        pill: string
    }

    // Semantic duration
    duration: {
        instant: string
        micro: string
        short: string
        base: string
        moderate: string
        long: string
        extended: string
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

    // Semantic typography
    typography: {
        // Font families
        primary: string
        secondary: string
        tertiary: string

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

    // ✨ Motion/Transform semantic tokens
    motion: {
        // Сдвиги для интерактивных элементов
        translate: {
            hover: string // translateY(-2px) - подъём при ховере
            active: string // translateY(1px) - лёгкое опускание
            pressed: string // translateY(2px) - проваливание
            nudge: string // translateY(-1px) - микро-сдвиг
        }

        // Масштабирование
        scale: {
            hover: string // 1.02 - увеличение при ховере
            active: string // 0.98 - уменьшение при клике
            pressed: string // 0.97 - сжатие
            emphasis: string // 1.05 - акцент
        }

        // Готовые комбо-эффекты для компонентов
        button: {
            hover: string // translateY(-2px)
            active: string // translateY(1px) scale(0.98)
            pressed: string // translateY(2px) scale(0.97)
        }

        card: {
            hover: string // translateY(-4px) scale(1.02)
            active: string // translateY(0) scale(1)
        }

        // Специальные эффекты
        pop: string // translateY(-4px) scale(1.05)
        push: string // translateY(4px) scale(0.98)
        bounce: string // translateY(-2px)
        wiggle: string // rotate(2deg)
    }
}
