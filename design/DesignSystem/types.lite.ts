/**
 * Design system context type
 *
 * Provides design system state and actions for theming, branding,
 * accessibility, internationalization, and content management.
 *
 * @example
 * ```typescript
 * const { theme, toggleTheme, changeBrand } = useDesignSystem()
 * ```
 */
export interface DesignSystemContextType {
    /**
     * Current brand name (e.g., 'sky', 'custom')
     */
    brand?: string

    /**
     * Current color theme
     */
    theme?: 'light' | 'dark' | 'auto'

    /**
     * Current color palette variant
     */
    palette?: string

    /**
     * Change the active brand
     *
     * @param design - Brand name to switch to
     *
     * @example
     * ```typescript
     * changeBrand('sky')
     * ```
     */
    changeBrand: (design: string) => void

    /**
     * Toggle between light and dark themes
     *
     * @example
     * ```typescript
     * toggleTheme() // light -> dark -> light
     * ```
     */
    toggleTheme: () => void

    /**
     * Change the active color palette
     *
     * @param schema - Palette name to switch to
     *
     * @example
     * ```typescript
     * changePalette('high-contrast')
     * ```
     */
    changePalette: (schema: string) => void

    /**
     * Accessibility preferences and settings
     *
     * @future Currently defined for type safety, implementation in progress
     */
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

    /**
     * Internationalization settings
     *
     * @future Currently defined for type safety, implementation in progress
     */
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

    /**
     * Content tone, voice, and microcopy
     *
     * @future Currently defined for type safety, implementation in progress
     */
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
