/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*/*.{ts,tsx,scss,sass}', '!**/node_modules/*', '!.sky/*', '!**/.dev/*'],
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            xxl: '1400px',
        },
        extend: {},
    },
    plugins: [],
}
