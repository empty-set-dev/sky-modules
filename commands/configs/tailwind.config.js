/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './**/*/*.{js, jsx, ts,tsx,scss,sass}',
        '!**/node_modules/*',
        '!.sky/*',
        '!**/.dev/*',
    ],
    theme: {
        screens: {
            sm: '576px',
            md: '868px',
            lg: '992px',
            xl: '1200px',
            xxl: '1400px',
        },
        extend: {},
    },
    plugins: [],
}
