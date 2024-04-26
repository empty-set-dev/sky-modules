#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __run from './__run'

args.command('format', 'Format ts, tsx', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

__run('eslint --fix **/*.{ts,tsx}')
