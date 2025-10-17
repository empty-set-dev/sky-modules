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
            muted: string
            subtle: string
            emphasis: string
        }
        foreground: {
            primary: string
            secondary: string
            tertiary: string
            inverse: string
            disabled: string
            placeholder: string
            muted: string
            subtle: string
            emphasis: string
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
            muted: string
            subtle: string
            emphasis: string
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
            raised: string
            overlay: string
            sunken: string
            selected: string
            disabled: string
            muted: string
            subtle: string
            emphasis: string
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
