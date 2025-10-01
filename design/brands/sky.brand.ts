// 🎨 Sky Brand Configuration
import type { BrandDescription } from '@sky-modules/design/Brand'

// Sky theme
export default {
    name: 'sky',
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
        colors: {
            background: {
                primary: '#0a0a0a',
                secondary: '#121212',
                tertiary: '#1c1c1c',
                inverse: '#fafafa',
                backdrop: 'rgb(10 10 10 / 80%)',
                overlay: 'rgb(10 10 10 / 95%)',
                scrim: 'rgb(0 0 0 / 50%)',
            },
            foreground: {
                primary: '#fafafa',
                secondary: '#d4d4d8',
                tertiary: '#a1a1aa',
                inverse: '#0a0a0a',
                disabled: '#71717a',
                placeholder: '#52525b',
            },
            border: {
                primary: 'rgb(255 255 255 / 10%)',
                secondary: 'rgb(255 255 255 / 5%)',
                tertiary: 'rgb(255 255 255 / 2%)',
                inverse: 'rgb(0 0 0 / 10%)',
                focus: '#22d3ee',
                error: '#ef4444',
                warning: '#f59e0b',
                success: '#22d3ee',
                info: '#22d3ee',
            },
            brand: {
                primary: '#22d3ee',
                primaryHover: '#06b6d4',
                primaryActive: '#0891b2',
                primarySubtle: 'rgb(34 211 238 / 10%)',
                secondary: '#e879f9',
                secondaryHover: '#d946ef',
                secondaryActive: '#c026d3',
                secondarySubtle: 'rgb(232 121 249 / 10%)',
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
                raised: '#303030',
                overlay: 'rgb(48 48 48 / 90%)',
                sunken: '#121212',
                selected: 'rgb(34 211 238 / 10%)',
                disabled: 'rgb(113 113 122 / 50%)',
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
        opacity: {
            disabled: '0.4',
            subtle: '0.6',
            medium: '0.8',
            visible: '1',
            hidden: '0',
            overlay: '0.95',
            backdrop: '0.80',
        },
        duration: {
            instant: '0ms',
            fast: '120ms',
            normal: '200ms',
            slow: '300ms',
            slower: '500ms',
        },
        zIndex: {
            dropdown: 1000,
            sticky: 1020,
            fixed: 1030,
            modal: 1040,
            popover: 1050,
            tooltip: 1060,
            toast: 1070,
            overlay: 1080,
        },
        glow: {
            xs: '0 0 2px rgb(34 211 238 / 70%)',
            sm: '0 0 4px rgb(34 211 238 / 60%)',
            base: '0 0 8px rgb(34 211 238 / 50%)',
            md: '0 0 12px rgb(34 211 238 / 40%)',
            lg: '0 0 16px rgb(34 211 238 / 35%)',
            xl: '0 0 24px rgb(34 211 238 / 30%)',
            '2xl': '0 0 32px rgb(34 211 238 / 25%)',
            '3xl': '0 0 48px rgb(34 211 238 / 20%)',
            none: 'none',
        },
        animations: {
            primaryIn: 'cubic-bezier(0.4, 0, 1, 1)',
            primaryOut: 'cubic-bezier(0, 0, 0.2, 1)',
            primaryInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            secondaryIn: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            secondaryOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            secondaryInOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            tertiaryIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            tertiaryOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            tertiaryInOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
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
                color: '#22d3ee',
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
