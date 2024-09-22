#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __run from './_run'

args.command('format', 'Format ts, tsx', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

__run("eslint --fix '**/*.{js,jsx,ts,tsx}'")
