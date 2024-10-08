#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */

import args from 'args'

import __run from './__run'

args.command('run', 'Run', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

const modulePath = args.sub.length >= 2 ? args.sub[args.sub.length - 1] : ''

try {
    __run(`clear && npx tsx ${modulePath}`)
} catch (err: unknown) {
    //
}
