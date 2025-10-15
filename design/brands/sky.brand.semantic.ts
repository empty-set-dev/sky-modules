import type { BrandDescription } from '@sky-modules/design/Brand'

export default {
    colors: {
        // Background colors
        background: {
            primary: '#ffffff',
            secondary: '#f8fafc',
            tertiary: '#f1f5f9',
            inverse: '#0f172a',
            backdrop: 'rgb(15 23 42 / 50%)',
            overlay: 'rgb(15 23 42 / 80%)',
            scrim: 'rgb(15 23 42 / 25%)',
            surface: '#ffffff',
            elevated: '#ffffff',
            sunken: '#f8fafc',
        },
        // Foreground/text colors
        foreground: {
            primary: '#0f172a',
            secondary: '#334155',
            tertiary: '#64748b',
            inverse: '#ffffff',
            disabled: '#94a3b8',
            placeholder: '#94a3b8',
            subtle: '#64748b',
            muted: '#cbd5e1',
        },
        // Border colors
        border: {
            primary: '#e2e8f0',
            secondary: '#f1f5f9',
            tertiary: '#f8fafc',
            inverse: '#334155',
            focus: '#22c55f',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#22c55f',
            info: '#18b8c2',
            subtle: '#f1f5f9',
            strong: '#cbd5e1',
        },
        // Brand colors (using all three palettes)
        brand: {
            // Primary (Emerald)
            primary: '#22c55f',
            primaryHover: '#16a34b',
            primaryActive: '#15803e',
            primarySubtle: 'rgb(34 197 95 / 10%)',
            primaryMuted: '#dcfce7',
            primaryForeground: '#ffffff',

            // Secondary (Persian Pink)
            secondary: '#e84ca3',
            secondaryHover: '#d72b82',
            secondaryActive: '#ba1c68',
            secondarySubtle: 'rgb(232 76 163 / 10%)',
            secondaryMuted: '#fce7f4',
            secondaryForeground: '#ffffff',

            // Tertiary (Morning Glory)
            tertiary: '#18b8c2',
            tertiaryHover: '#1794a3',
            tertiaryActive: '#197785',
            tertiarySubtle: 'rgb(24 184 194 / 10%)',
            tertiaryMuted: '#d3fafa',
            tertiaryForeground: '#ffffff',
        },
        // Status/feedback colors
        status: {
            // Success (Emerald)
            success: '#22c55f',
            successHover: '#16a34b',
            successActive: '#15803e',
            successSubtle: 'rgb(34 197 95 / 10%)',
            successMuted: '#dcfce7',
            successForeground: '#ffffff',
            successBorder: '#86efad',

            // Error (keeping red)
            error: '#ef4444',
            errorHover: '#dc2626',
            errorActive: '#b91c1c',
            errorSubtle: 'rgb(239 68 68 / 10%)',
            errorMuted: '#fee2e2',
            errorForeground: '#ffffff',
            errorBorder: '#fca5a5',

            // Warning (keeping orange)
            warning: '#f59e0b',
            warningHover: '#d97706',
            warningActive: '#b45309',
            warningSubtle: 'rgb(245 158 11 / 10%)',
            warningMuted: '#fef3c7',
            warningForeground: '#ffffff',
            warningBorder: '#fcd34d',

            // Info (Morning Glory)
            info: '#18b8c2',
            infoHover: '#1794a3',
            infoActive: '#197785',
            infoSubtle: 'rgb(24 184 194 / 10%)',
            infoMuted: '#d3fafa',
            infoForeground: '#ffffff',
            infoBorder: '#74e9ec',
        },
        // Surface variations
        surface: {
            raised: '#ffffff',
            overlay: 'rgb(255 255 255 / 98%)',
            sunken: '#f8fafc',
            selected: 'rgb(34 197 95 / 12%)',
            selectedHover: 'rgb(34 197 95 / 18%)',
            disabled: 'rgb(148 163 184 / 50%)',
            hover: 'rgb(241 245 249 / 80%)',
            pressed: 'rgb(226 232 240 / 90%)',
        },
        // Interactive states
        interactive: {
            default: '#22c55f',
            hover: '#16a34b',
            active: '#15803e',
            focus: '#22c55f',
            disabled: '#cbd5e1',
            subtle: 'rgb(34 197 95 / 8%)',
            subtleHover: 'rgb(34 197 95 / 15%)',
            subtleActive: 'rgb(34 197 95 / 20%)',
        },
        // Effects & overlays
        effects: {
            // Primary glow (Emerald)
            glowPrimary: '0 0 8px rgb(34 197 95 / 40%)',
            glowPrimaryStrong: '0 0 16px rgb(34 197 95 / 35%)',
            glowPrimarySubtle: '0 0 4px rgb(34 197 95 / 50%)',

            // Secondary glow (Persian Pink)
            glowSecondary: '0 0 8px rgb(232 76 163 / 40%)',
            glowSecondaryStrong: '0 0 16px rgb(232 76 163 / 35%)',
            glowSecondarySubtle: '0 0 4px rgb(232 76 163 / 50%)',

            // Tertiary glow (Morning Glory)
            glowTertiary: '0 0 8px rgb(24 184 194 / 40%)',
            glowTertiaryStrong: '0 0 16px rgb(24 184 194 / 35%)',
            glowTertiarySubtle: '0 0 4px rgb(24 184 194 / 50%)',

            // Status glows
            glowSuccess: '0 0 8px rgb(34 197 95 / 35%)',
            glowError: '0 0 8px rgb(239 68 68 / 35%)',
            glowWarning: '0 0 8px rgb(245 158 11 / 35%)',
            glowInfo: '0 0 8px rgb(24 184 194 / 35%)',

            // State glows
            glowFocus: '0 0 0 3px rgb(34 197 95 / 20%)',
            glowHover: '0 0 6px rgb(34 197 95 / 30%)',
            glowActive: '0 0 12px rgb(34 197 95 / 25%)',

            // Neutral
            glowNeutral: '0 0 8px rgb(100 116 139 / 30%)',
        },
    },
    // Opacity scales
    opacity: {
        disabled: '0.4',
        subtle: '0.6',
        medium: '0.8',
        visible: '1',
        hidden: '0',
        overlay: '0.95',
        backdrop: '0.75',
        scrim: '0.5',
        ghost: '0.05',
        faint: '0.1',
        light: '0.2',
    },
    // Animation durations
    duration: {
        instant: '0ms',
        fastest: '75ms',
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
        slower: '500ms',
        slowest: '800ms',
    },
    // Z-index layers
    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modal: 1040,
        popover: 1050,
        tooltip: 1060,
        toast: 1070,
        overlay: 1080,
        max: 9999,
    },
    // Glow effects (using primary emerald as base)
    glow: {
        xs: '0 0 2px rgb(34 197 95 / 60%)',
        sm: '0 0 4px rgb(34 197 95 / 50%)',
        base: '0 0 8px rgb(34 197 95 / 40%)',
        md: '0 0 12px rgb(34 197 95 / 35%)',
        lg: '0 0 16px rgb(34 197 95 / 30%)',
        xl: '0 0 24px rgb(34 197 95 / 25%)',
        '2xl': '0 0 32px rgb(34 197 95 / 20%)',
        '3xl': '0 0 48px rgb(34 197 95 / 15%)',
        none: 'none',
    },
    // Animation curves
    animations: {
        // Ease curves
        primaryIn: 'cubic-bezier(0.4, 0, 1, 1)',
        primaryOut: 'cubic-bezier(0, 0, 0.2, 1)',
        primaryInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

        // Smooth
        secondaryIn: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        secondaryOut: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
        secondaryInOut: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

        // Bouncy
        tertiaryIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        tertiaryOut: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
        tertiaryInOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

        // Spring-like
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',

        // Standard
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
    },
    // Typography scales (keeping your existing structure)
    typography: {
        display: {
            large: '4.5rem', // 72px
            medium: '3.75rem', // 60px
            small: '3rem', // 48px
        },
        headline: {
            large: '2.25rem', // 36px
            medium: '1.875rem', // 30px
            small: '1.5rem', // 24px
        },
        title: {
            large: '1.25rem', // 20px
            medium: '1.125rem', // 18px
            small: '1rem', // 16px
        },
        label: {
            large: '0.875rem', // 14px
            medium: '0.75rem', // 12px
            small: '0.675rem', // 10.8px
        },
        body: {
            large: '1rem', // 16px
            medium: '0.875rem', // 14px
            small: '0.75rem', // 12px
        },
    },
} satisfies BrandDescription['semantic']
