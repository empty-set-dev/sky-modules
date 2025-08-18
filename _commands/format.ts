#!/usr/bin/env -S pnpm exec tsx
import args from 'args'

import __run from './__run'

// eslint-disable-next-line @typescript-eslint/no-empty-function
args.command('format', 'Format ts, tsx, js, jsx, mjs, cjs', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

format()

function format(): void {
    __run(
        "cross-env NODE_OPTIONS=--max-old-space-size=8192 eslint --fix '**/*.{ts,tsx,js,jsx,mjs,cjs}' --ignore-pattern '.sky/**/*'"
    )
}
