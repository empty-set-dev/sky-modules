import { defineConfig } from '@pandacss/dev'

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    jsxFramework: 'react',

    // Where to look for your css declarations
    include: ['./**/*.{js,jsx,ts,tsx}'],

    // Files to exclude
    exclude: ['**/node_modules/**', '**/.dev/**', 'node_modules', '.dev'],

    // Useful for theme customization
    theme: {
        extend: {},
    },

    // The output directory for your css system
    outdir: '.dev/styled-system',
})
