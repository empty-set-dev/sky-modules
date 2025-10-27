import { defineConfig } from 'vitest/config'
import { join, dirname } from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Simple workspace root finder - no imports to avoid triggering watch
function findWorkspaceRoot() {
    let current = dirname(__dirname) // Start from cli directory
    while (current !== '/' && current.length > 1) {
        if (existsSync(join(current, '.sky'))) {
            return current
        }
        current = dirname(current)
    }
    // Fallback to directory above cli
    return dirname(__dirname)
}

const workspaceRoot = findWorkspaceRoot()

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
                maxThreads: process.env.VITEST_WATCH ? 1 : 4, // Single thread in watch mode
            },
        },
        // Prevent multiple runs
        singleThread: !!process.env.VITEST_WATCH,
        // Increased timeout for e2e tests
        testTimeout: 60000,
        hookTimeout: 60000,
        // Watch mode disabled by default, use --watch flag to enable
        watchExclude: [
            '**/node_modules/**',
            '**/.dev/**',
            '**/dist/**',
            '**/build/**',
            '**/*.global.ts',
            '**/index.ts',
            '**/global.ts',
            '**/dev-configs/**',
        ],
        // Store vitest cache in .dev
        cache: {
            dir: join(workspaceRoot, '.dev/vitest'),
        },
        include: [
            '**/*.test.js',
            '**/*.test.jsx',
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.js',
            '**/*.spec.jsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/*.e2e.spec.ts',
            '**/*.e2e.spec.js',
            '**/*.e2e.test.ts',
            '**/*.e2e.test.js',
        ],
        exclude: [
            '**/.dev/**',
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
        ],
        coverage: {
            // Coverage disabled by default, enable with --coverage flag or when folder is specified
            enabled: false,
            reporter: ['text', 'html', 'lcov', 'json'],
            reportsDirectory: join(workspaceRoot, '.dev/coverage'),
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
        // Ensure all output goes to .dev
        outputFile: {
            json: join(workspaceRoot, '.dev/vitest/results.json'),
        },
    },
})
