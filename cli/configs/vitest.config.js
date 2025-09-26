import fs from 'fs'
import path from 'path'

import { defineConfig } from 'vitest/config'

import Console from '../lib/Console'

const modulesDir = path.resolve(path.dirname(process.argv[3]))
let tsconfigDir = path.dirname(process.argv[4])

while (!fs.existsSync(`${tsconfigDir}/tsconfig.json`)) {
    if (tsconfigDir === '') {
        Console.error('tsconfig.json not found')
    }

    tsconfigDir = path.dirname(tsconfigDir)
}

const { compilerOptions } = JSON.parse(fs.readFileSync(`${tsconfigDir}/tsconfig.json`, 'utf-8'))

// Convert TypeScript paths to Vitest alias format
const alias = {}

if (compilerOptions.paths) {
    Object.entries(compilerOptions.paths).forEach(([key, value]) => {
        const cleanKey = key.replace('/*', '')
        const cleanValue = value[0].replace('/*', '')
        alias[cleanKey] = path.resolve(tsconfigDir, compilerOptions.baseUrl, cleanValue)
    })
}

export default defineConfig({
    test: {
        environment: 'node',
        root: modulesDir,
        include: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
        coverage: {
            enabled: false,
            reporter: ['text', 'html'],
            reportsDirectory: '../../.dev/coverage',
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
    },
    resolve: {
        alias,
    },
})
