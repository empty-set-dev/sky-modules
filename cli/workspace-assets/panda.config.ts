import { defineConfig } from '@pandacss/dev'

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    // JSX framework for component generation
    jsxFramework: 'react',

    // Include files that use Panda CSS
    include: [
        './playground/universal/**/*.{js,jsx,ts,tsx}',
        '../../universal/playground/**/*.{js,jsx,ts,tsx}'
    ],

    // Files to exclude
    exclude: ['**/node_modules/**', '**/.dev/**'],

    // The output directory for your css system
    outdir: '.dev/styled-system',

    // Configure CSS extraction
    watch: true,
})
