import path from 'path'

import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: [
            {
                find: 'sky',
                replacement: path.resolve(__dirname, '../..'),
            },
            {
                find: 'tests/browser',
                replacement: path.resolve(__dirname, '../../tests/browser'),
            },
            {
                find: '(.*)',
                replacement: path.resolve(__dirname, '../../node_modules'),
            },
        ],
    },
})
