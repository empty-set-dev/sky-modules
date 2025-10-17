import Brand from '../Brand'

export default {
    colors: {
        neutral: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
            950: '#0a0a0a',
        },
        brand: {
            primary: {
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
            xs: ['0.75rem', { lineHeight: '1rem' }], // 12px - extra small text
            sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px - small text
            md: ['1rem', { lineHeight: '1.5rem' }], // 16px - base text
            lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px - large text
            xl: ['1.25rem', { lineHeight: '1.875rem' }], // 20px - extra large text
            '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px - heading 6
            '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - heading 5
            '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px - heading 4
            '5xl': ['3rem', { lineHeight: '3rem' }], // 48px - heading 3
            '6xl': ['3.75rem', { lineHeight: '3.75rem' }], // 60px - heading 2
            '7xl': ['4.5rem', { lineHeight: '4.5rem' }], // 72px - heading 1
            '8xl': ['6rem', { lineHeight: '6rem' }], // 96px - display large
            '9xl': ['8rem', { lineHeight: '8rem' }], // 128px - display huge
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
            tight: '1.25',
            snug: '1.375',
            normal: '1.5',
            relaxed: '1.625',
            loose: '2',
        },
    },
    spacing: {
        xs: '0.25rem', // 4px   - micro spacing
        sm: '0.5rem', // 8px   - small spacing
        md: '1rem', // 16px  - base spacing
        lg: '1.5rem', // 24px  - medium spacing
        xl: '2rem', // 32px  - large spacing
        '2xl': '3rem', // 48px  - extra large
        '3xl': '4.5rem', // 72px  - sections
        '4xl': '6rem', // 96px  - large sections
        '5xl': '9rem', // 144px - hero sections
        '6xl': '12rem', // 192px - huge spacing
        '7xl': '18rem', // 288px - extreme spacing
        '8xl': '24rem', // 384px - max spacing
        '9xl': '32rem', // 512px - viewport margins
    },
    sizing: {
        xs: '1.25rem', // 20px  - tiny icon
        sm: '2rem', // 32px  - small button
        md: '2.5rem', // 40px  - standard button
        lg: '3rem', // 48px  - large button
        xl: '4rem', // 64px  - large element
        '2xl': '5rem', // 80px  - avatar
        '3xl': '6rem', // 96px  - large avatar
        '4xl': '8rem', // 128px - card
        '5xl': '10rem', // 160px - medium card
        '6xl': '14rem', // 224px - large card
        '7xl': '18rem', // 288px - hero element
        '8xl': '24rem', // 384px - large hero
        '9xl': '32rem', // 512px - max container
    },
    radius: {
        xs: '0.125rem', // 2px  - subtle rounding
        sm: '0.25rem', // 4px  - small rounding
        md: '0.375rem', // 6px  - medium rounding
        lg: '0.5rem', // 8px  - large rounding
        xl: '0.75rem', // 12px - extra large rounding
        '2xl': '1rem', // 16px - very rounded
        '3xl': '1.5rem', // 24px - highly rounded
        full: '9999px', // fully rounded
    },
    borderWidth: {
        xs: '0.5px', // hairline border
        sm: '1px', // thin border
        md: '2px', // medium border
        lg: '3px', // thick border
        xl: '4px', // extra thick border
        '2xl': '6px', // very thick border
        '3xl': '8px', // extremely thick border
    },
    boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // subtle shadow
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // small shadow
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // medium shadow
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // large shadow
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // extra large shadow
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // very large shadow
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.35)', // extreme shadow
    },
    dropShadow: {
        xs: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05))', // subtle drop shadow
        sm: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06))', // small drop shadow
        md: 'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06))', // medium drop shadow
        lg: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))', // large drop shadow
        xl: 'drop-shadow(0 20px 13px rgba(0, 0, 0, 0.03)) drop-shadow(0 8px 5px rgba(0, 0, 0, 0.08))', // extra large drop shadow
        '2xl': 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))', // very large drop shadow
        '3xl': 'drop-shadow(0 35px 35px rgba(0, 0, 0, 0.25))', // extreme drop shadow
    },
    blur: {
        xs: '2px', // subtle blur
        sm: '4px', // small blur
        md: '8px', // medium blur
        lg: '16px', // large blur
        xl: '24px', // extra large blur
        '2xl': '40px', // very large blur
        '3xl': '64px', // extreme blur
    },
    glow: {
        xs: '0 0 4px rgba(59, 130, 246, 0.3)', // subtle glow
        sm: '0 0 8px rgba(59, 130, 246, 0.4)', // small glow
        md: '0 0 12px rgba(59, 130, 246, 0.5)', // medium glow
        lg: '0 0 16px rgba(59, 130, 246, 0.6)', // large glow
        xl: '0 0 24px rgba(59, 130, 246, 0.7)', // extra large glow
        '2xl': '0 0 32px rgba(59, 130, 246, 0.8)', // very large glow
        '3xl': '0 0 48px rgba(59, 130, 246, 0.9)', // extreme glow
    },
    screens: {
        xs: '480px', // mobile landscape
        sm: '640px', // small tablet
        md: '768px', // tablet
        lg: '1024px', // laptop
        xl: '1280px', // desktop
        '2xl': '1536px', // large desktop
        '3xl': '1920px', // extra large desktop
    },
} satisfies Brand['foundation']
