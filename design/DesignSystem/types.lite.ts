export interface DesignSystemContextType {
    brand?: string
    theme?: 'light' | 'dark' | 'auto'
    palette?: string
    changeBrand: (design: string) => void
    toggleTheme: () => void
    changePalette: (schema: string) => void

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
