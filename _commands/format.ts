#!/usr/bin/env -S pnpm exec tsx
import args from 'args'

import __run from './__run'

args.command('format', 'Format ts, tsx, js, jsx, mjs, cjs')

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

format()

function format(): void {
    __run("eslint --fix '**/*.{ts,tsx,js,jsx,mjs,cjs}' --ignore-pattern '.sky/**/*'")
}
