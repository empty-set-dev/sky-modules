// 🎨 Sky Brand Configuration
import type { BrandDescription } from '@sky-modules/design/Brand'

// Sky theme
export default {
    foundation: {
        colors: {
            brand: {
                50: '#f0fdfa',
                100: '#ccfbf1',
                200: '#99f6e4',
                300: '#5eead4',
                400: '#2dd4bf',
                500: '#14b8a6',
                600: '#0d9488',
                700: '#0f766e',
                800: '#115e59',
                900: '#134e4a',
                950: '#042f2e',
            },
        },
    },
    semantic: {
        spacing: {
            none: '0',
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            '2xl': '3rem',
            '3xl': '4rem',
            '4xl': '5rem',
            '5xl': '6rem',
            '6xl': '8rem',
        },
        sizing: {
            xs: '1rem',
            sm: '1.5rem',
            md: '2rem',
            lg: '2.5rem',
            xl: '3rem',
            '2xl': '4rem',
            '3xl': '5rem',
            '4xl': '6rem',
            '5xl': '8rem',
            '6xl': '10rem',
            full: '100%',
            screen: '100vh',
        },
        colors: {
            background: {
                primary: 'oklch(4% 0 0)',
                secondary: 'oklch(7% 0 0)',
                tertiary: 'oklch(11% 0 0)',
                inverse: 'oklch(98% 0 0)',
                backdrop: 'oklch(4% 0 0 / 80%)',
                overlay: 'oklch(4% 0 0 / 95%)',
                scrim: 'oklch(0% 0 0 / 50%)',
            },
            foreground: {
                primary: 'oklch(98% 0 0)',
                secondary: 'oklch(85% 0 0)',
                tertiary: 'oklch(68% 0 0)',
                inverse: 'oklch(4% 0 0)',
                disabled: 'oklch(52% 0 0)',
                placeholder: 'oklch(38% 0 0)',
            },
            border: {
                primary: 'oklch(100% 0 0 / 10%)',
                secondary: 'oklch(100% 0 0 / 5%)',
                tertiary: 'oklch(100% 0 0 / 2%)',
                inverse: 'oklch(0% 0 0 / 10%)',
                focus: 'oklch(80% 0.15 195)',
                error: 'oklch(63% 0.25 25)',
                warning: 'oklch(75% 0.15 75)',
                success: 'oklch(80% 0.15 195)',
                info: 'oklch(72% 0.14 195)',
            },
            brand: {
                primary: 'oklch(80% 0.15 195)',
                primaryHover: 'oklch(77% 0.18 165)',
                primaryActive: 'oklch(85% 0.12 165)',
                primarySubtle: 'oklch(80% 0.15 195 / 10%)',
                secondary: 'oklch(70% 0.22 320)',
                secondaryHover: 'oklch(75% 0.20 320)',
                secondaryActive: 'oklch(80% 0.18 320)',
                secondarySubtle: 'oklch(70% 0.22 320 / 10%)',
            },
            status: {
                success: '#34d399',
                successHover: '#10b981',
                successActive: '#059669',
                successSubtle: '#34d399 / 10%',
                error: '#ef4444',
                errorHover: '#dc2626',
                errorActive: '#b91c1c',
                errorSubtle: '#ef4444 / 10%',
                warning: '#f59e0b',
                warningHover: '#d97706',
                warningActive: '#b45309',
                warningSubtle: '#f59e0b / 10%',
                info: '#22d3ee',
                infoHover: '#06b6d4',
                infoActive: '#0891b2',
                infoSubtle: '#22d3ee / 10%',
            },
            surface: {
                raised: 'oklch(19% 0 0)',
                overlay: 'oklch(19% 0 0 / 90%)',
                sunken: 'oklch(7% 0 0)',
                selected: 'oklch(80% 0.15 195 / 10%)',
                disabled: 'oklch(52% 0 0 / 50%)',
            },
            effects: {
                // Primary/Secondary/Tertiary hierarchy - logo colors
                glowPrimary: '0 0 12px #22d3ee / 40%', // Cyan
                glowSecondary: '0 0 12px #e879f9 / 40%', // Pink/Fuchsia
                glowTertiary: '0 0 12px #34d399 / 40%', // Green

                // Interactive states
                glowFocus: '0 0 8px #22d3ee / 50%',
                glowHover: '0 0 6px #22d3ee / 60%',
                glowActive: '0 0 14px #22d3ee / 35%',
                glowSubtle: '0 0 4px #22d3ee / 70%',
                glowStrong: '0 0 20px #22d3ee / 30%',

                // Contextual glows - using logo colors
                glowBrand: '0 0 10px #22d3ee / 45%', // Cyan
                glowSuccess: '0 0 8px #34d399 / 40%', // Green
                glowError: '0 0 8px #ef4444 / 40%', // Red
                glowWarning: '0 0 8px #f59e0b / 40%', // Amber
                glowInfo: '0 0 8px #e879f9 / 40%', // Pink/Fuchsia
            },
        },
        typography: {
            display: {
                large: '4.5rem',
                medium: '3.75rem',
                small: '3rem',
            },
            headline: {
                large: '2.25rem',
                medium: '1.875rem',
                small: '1.5rem',
            },
            title: {
                large: '1.25rem',
                medium: '1.125rem',
                small: '1rem',
            },
            label: {
                large: '0.875rem',
                medium: '0.75rem',
                small: '0.675rem',
            },
            body: {
                large: '1rem',
                medium: '0.875rem',
                small: '0.75rem',
            },
        },
    },
    global: {
        mode: 'dark',
        accessibility: {
            reducedMotion: false,
            highContrast: false,
            focusRing: {
                width: '2px',
                style: 'solid',
                color: 'oklch(80% 0.15 195)',
                offset: '2px',
            },
        },
        i18n: {
            direction: 'ltr',
            locale: 'en-US',
            timezone: 'UTC',
            currency: 'USD',
            numberFormat: {
                decimal: '.',
                thousands: ',',
            },
            dateFormat: {
                short: 'MM/dd/yyyy',
                medium: 'MMM dd, yyyy',
                long: 'MMMM dd, yyyy',
                full: 'EEEE, MMMM dd, yyyy',
            },
        },
        content: {
            tone: 'professional',
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
            },
        },
    },
} satisfies BrandDescription
