import { defineConfig } from 'vitest/config'

const folder = process.argv[5]

export default defineConfig({
    test: {
        environment: 'node',
        include: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
        coverage: {
            enabled: true,
            reporter: ['text', 'html'],
            reportsDirectory: '../../.dev/coverage',
            include: [
                `${folder}/**/*.js`,
                `${folder}/**/*.jsx`,
                `${folder}/**/*.ts`,
                `${folder}/**/*.tsx`,
            ],
            exclude: ['**/*.test.*', '**/*.spec.*', '**/index.ts', '**/global.ts'],
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
    },
})
