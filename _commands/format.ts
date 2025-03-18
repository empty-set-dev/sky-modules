#!/usr/bin/env -S npx tsx
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

__run("eslint --fix '**/*.{ts,tsx,js,jsx,mjs,cjs}' --ignore-pattern '.sky/**/*'")
