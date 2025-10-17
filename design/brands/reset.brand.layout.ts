import Brand from '../Brand'

export default {
    container: {
        center: true, // center containers by default
        padding: {
            default: '1rem', // 16px - default container padding
            xs: '0.5rem', // 8px - mobile padding
            sm: '0.75rem', // 12px - small screen padding
            md: '1rem', // 16px - medium screen padding
            lg: '1.5rem', // 24px - large screen padding
            xl: '2rem', // 32px - extra large padding
            '2xl': '2.5rem', // 40px - very large padding
            '3xl': '3rem', // 48px - maximum padding
        },
        maxWidth: {
            xs: '20rem', // 320px - mobile container
            sm: '24rem', // 384px - small container
            md: '28rem', // 448px - medium container
            lg: '32rem', // 512px - large container
            xl: '36rem', // 576px - extra large container
            '2xl': '42rem', // 672px - very large container
            '3xl': '48rem', // 768px - wide container
            '4xl': '56rem', // 896px - extra wide container
            '5xl': '64rem', // 1024px - desktop container
            '6xl': '72rem', // 1152px - large desktop container
            '7xl': '80rem', // 1280px - extra large desktop
            '8xl': '96rem', // 1536px - huge container
            '9xl': '120rem', // 1920px - maximum container
        },
    },
} satisfies Brand['layout']