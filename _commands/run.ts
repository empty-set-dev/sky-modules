#!/usr/bin/env -S pnpm exec tsx

import args from 'args'

import __run from './__run'

// eslint-disable-next-line @typescript-eslint/no-empty-function
args.command('run', 'Run', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

const modulePath = args.sub.length >= 2 ? args.sub[args.sub.length - 1] : ''

try {
    __run(`clear && pnpm exec tsx ${modulePath}`)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (err: unknown) {
    //
}
