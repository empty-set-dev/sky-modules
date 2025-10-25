import { defineConfig } from 'vitest/config'

// Get folder parameter - find the last argument that doesn't start with --
const args = process.argv.slice(2)
const folder = args.findLast(arg => !arg.startsWith('--') && !arg.includes('vitest')) || '.'

export default defineConfig({
    resolve: {
        conditions: ['browser', 'development']
    },
    test: {
        environment: 'node',
        // Parallel execution settings
        pool: 'threads',
        poolOptions: {
            threads: {
                minThreads: 1,
                maxThreads: 4,
            },
        },
        // Watch mode settings
        watch: false,
        watchExclude: ['**/node_modules/**', '**/.dev/**', '**/dist/**', '**/build/**'],
        include: [
            '**/*.test.js',
            '**/*.test.jsx',
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.js',
            '**/*.spec.jsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
        ],
        exclude: ['**/.dev/**', '**/node_modules/**', '**/dist/**', '**/build/**'],
        coverage: {
            enabled: true,
            reporter: ['text', 'html', 'lcov', 'json'],
            reportsDirectory: '../../.dev/coverage',
            include: [
                `${folder}/**/*.js`,
                `${folder}/**/*.jsx`,
                `${folder}/**/*.ts`,
                `${folder}/**/*.tsx`,
            ],
            exclude: ['**/*.test.*', '**/*.spec.*', '**/index.ts', '**/global.ts', '**/.dev/**'],
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
    },
})
