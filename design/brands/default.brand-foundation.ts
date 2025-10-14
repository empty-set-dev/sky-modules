import type { BrandDescription } from '@sky-modules/design/Brand'

export default {
    colors: {
        // Primary: Emerald (success, growth, positive)
        primary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efad',
            400: '#4ade81',
            500: '#22c55f',
            600: '#16a34b',
            700: '#15803e',
            800: '#166534',
            900: '#14532d',
            950: '#052e16',
        },
        // Secondary: Persian Pink (creative, energetic)
        secondary: {
            50: '#fdf2f9',
            100: '#fce7f4',
            200: '#fad0eb',
            300: '#f7aad9',
            400: '#f27ec2',
            500: '#e84ca3',
            600: '#d72b82',
            700: '#ba1c68',
            800: '#9a1a56',
            900: '#811a4a',
            950: '#4e0928',
        },
        // Tertiary: Morning Glory (info, calm, tech)
        tertiary: {
            50: '#eefdfd',
            100: '#d3fafa',
            200: '#b2f4f5',
            300: '#74e9ec',
            400: '#34d5dc',
            500: '#18b8c2',
            600: '#1794a3',
            700: '#197785',
            800: '#1d616d',
            900: '#1d515c',
            950: '#0d353f',
        },
        // Neutral: Slate (modern grays)
        neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
        },
        // Brand: Sky Blue (keeping your existing brand color)
        brand: {
            50: '#eefdfd',
            100: '#d3fafa',
            200: '#b2f4f5',
            300: '#74e9ec',
            400: '#34d5dc',
            500: '#18b8c2',
            600: '#1794a3',
            700: '#197785',
            800: '#1d616d',
            900: '#1d515c',
            950: '#0d353f',
        },
    },
    spacing: {
        none: '0',
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '3rem', // 48px
        '3xl': '4rem', // 64px
        '4xl': '5rem', // 80px
        '5xl': '6rem', // 96px
        '6xl': '8rem', // 128px
        '7xl': '10rem', // 160px
        '8xl': '12rem', // 192px
        '9xl': '16rem', // 256px
    },
    sizing: {
        xs: '1rem', // 16px
        sm: '1.5rem', // 24px
        md: '2rem', // 32px
        lg: '2.5rem', // 40px
        xl: '3rem', // 48px
        '2xl': '4rem', // 64px
        '3xl': '5rem', // 80px
        '4xl': '6rem', // 96px
        '5xl': '8rem', // 128px
        '6xl': '10rem', // 160px
        '7xl': '12rem', // 192px
        '8xl': '16rem', // 256px
        '9xl': '20rem', // 320px
        full: '100%',
        screen: '100vh',
        min: 'min-content',
        max: 'max-content',
        fit: 'fit-content',
    },
    typography: {
        fontFamily: {
            sans: [
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'sans-serif',
            ],
            serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
            mono: [
                'ui-monospace',
                'SF Mono',
                'Monaco',
                'Cascadia Code',
                'Roboto Mono',
                'Consolas',
                'monospace',
            ],
            display: ['system-ui', '-apple-system', 'sans-serif'],
        },
        fontSize: {
            xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
            sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
            base: ['1rem', { lineHeight: '1.5rem' }], // 16px
            lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
            xl: ['1.25rem', { lineHeight: '1.875rem' }], // 20px
            '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
            '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
            '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
            '5xl': ['3rem', { lineHeight: '3rem' }], // 48px
            '6xl': ['3.75rem', { lineHeight: '3.75rem' }], // 60px
            '7xl': ['4.5rem', { lineHeight: '4.5rem' }], // 72px
            '8xl': ['6rem', { lineHeight: '6rem' }], // 96px
            '9xl': ['8rem', { lineHeight: '8rem' }], // 128px
        },
        letterSpacing: {
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0em',
            wide: '0.025em',
            wider: '0.05em',
            widest: '0.1em',
        },
        lineHeight: {
            none: '1',
            tight: '1.25',
            snug: '1.375',
            normal: '1.5',
            relaxed: '1.625',
            loose: '2',
        },
    },
    borderRadius: {
        none: '0',
        sm: '0.125rem', // 2px
        base: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
        xl: '0.75rem', // 12px
        '2xl': '1rem', // 16px
        '3xl': '1.5rem', // 24px
        '4xl': '2rem', // 32px
        full: '9999px',
    },
    borderWidth: {
        0: '0',
        default: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
    },
    boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 5%)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)',
        base: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)',
        md: '0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 10%), 0 8px 10px -6px rgb(0 0 0 / 10%)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 25%)',
        '3xl': '0 35px 60px -15px rgb(0 0 0 / 30%)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 6%)',
        none: 'none',
    },
    dropShadow: {
        sm: '0 1px 2px rgb(0 0 0 / 10%)',
        base: '0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 6%)',
        md: '0 4px 3px rgb(0 0 0 / 7%), 0 2px 2px rgb(0 0 0 / 6%)',
        lg: '0 10px 8px rgb(0 0 0 / 4%), 0 4px 3px rgb(0 0 0 / 10%)',
        xl: '0 20px 13px rgb(0 0 0 / 3%), 0 8px 5px rgb(0 0 0 / 8%)',
        '2xl': '0 25px 25px rgb(0 0 0 / 15%)',
        none: '0 0 #0000',
    },
    // Glow effects (using primary emerald color)
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
    blur: {
        none: '0',
        sm: '4px',
        base: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
    },
    screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
    },
    container: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
} satisfies BrandDescription['foundation']
