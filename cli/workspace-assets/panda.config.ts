import { defineConfig } from '@pandacss/dev'

export default defineConfig({
    // Whether to use css reset
    preflight: false,

    // JSX framework for component generation
    jsxFramework: 'react',

    // Very specific include - only the files we actually use
    include: ['./examples/universal/App.tsx'],

    // Files to exclude
    exclude: ['**/node_modules/**'],

    // The output directory for your css system
    outdir: '.dev/styled-system',

    // Fix for readonly property assignment error
    strictTokens: false,
    strictPropertyValues: false,

    // Configure CSS extraction
    watch: true,
})
