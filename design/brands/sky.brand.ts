// 🎨 Default Theme Configuration
import foundation from './sky.brand.foundation'
import semantic from './sky.brand.semantic'

import type Brand from '@sky-modules/design/Brand'

// Modern, vibrant theme with emerald, pink and teal accent colors
const defaultTheme = {
    name: 'default',
    foundation: {
        ...foundation,
        colors: {
            ...foundation.colors,
            // Semantic colors (keeping existing ones)
            brand: foundation.colors.brand,
        },
    },
    semantic,
    // Global settings
    global: {
        theme: 'light',
        mode: 'default',
        accessibility: {
            reducedMotion: false,
            highContrast: false,
            focusRing: {
                width: '2px',
                style: 'solid',
                color: '#22c55f',
                offset: '2px',
                blur: '0px',
            },
            focusVisible: true,
            skipLinks: true,
            ariaLive: 'polite',
        },
        i18n: {
            direction: 'ltr',
            locale: 'en-US',
            timezone: 'UTC',
            currency: 'USD',
            numberFormat: {
                decimal: '.',
                thousands: ',',
                grouping: [3],
            },
            dateFormat: {
                short: 'MM/dd/yyyy',
                medium: 'MMM dd, yyyy',
                long: 'MMMM dd, yyyy',
                full: 'EEEE, MMMM dd, yyyy',
            },
            timeFormat: {
                short: 'HH:mm',
                medium: 'HH:mm:ss',
                long: 'HH:mm:ss z',
            },
        },
        content: {
            tone: 'friendly',
            voice: 'active',
            microcopy: {
                loading: 'Loading...',
                empty: 'No data available',
                error: 'Something went wrong',
                success: 'Success!',
                retry: 'Try again',
                cancel: 'Cancel',
                confirm: 'Confirm',
                save: 'Save',
                delete: 'Delete',
                edit: 'Edit',
                create: 'Create',
                update: 'Update',
                search: 'Search',
                filter: 'Filter',
                sort: 'Sort',
                more: 'More',
                less: 'Less',
                previous: 'Previous',
                next: 'Next',
                close: 'Close',
                open: 'Open',
                back: 'Back',
                forward: 'Forward',
                submit: 'Submit',
                reset: 'Reset',
                clear: 'Clear',
                apply: 'Apply',
            },
        },
        preferences: {
            defaultColorScheme: 'emerald',
            defaultAccent: 'primary',
            enableAnimations: true,
            enableSounds: false,
            compactMode: false,
        },
    },
    components: {} as Brand['components'],
    charts: {} as Brand['charts'],
    layout: {} as Brand['layout'],
} satisfies Brand

export default defaultTheme
