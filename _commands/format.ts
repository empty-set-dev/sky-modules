#!/usr/bin/env -S pnpm exec tsx
import { command } from './lib/command'
import run from './lib/run'

await command('format', 'Format ts, tsx, js, jsx, mjs, cjs', (): void => {
    run(
        "cross-env NODE_OPTIONS=--max-old-space-size=8192 eslint --fix '**/*.{ts,tsx,js,jsx,mjs,cjs}'"
    )
})
