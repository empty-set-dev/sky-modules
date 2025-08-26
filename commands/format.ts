#!/usr/bin/env -S pnpm exec bun
import run from './lib/run'

export default function format(): void {
    run(
        "cross-env NODE_OPTIONS=--max-old-space-size=8192 eslint --fix '**/*.{ts,tsx,js,jsx,mjs,cjs}'"
    )
}
