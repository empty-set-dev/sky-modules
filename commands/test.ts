#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */

import args from 'args'

import __run from './__run'

args.command('test', 'Test', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

const modulePath = args.sub[args.sub.length - 1]

await __run(`tsx ${modulePath}`)
