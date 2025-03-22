#!/usr/bin/env -S pnpm exec tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __run from './__run'

args.command('run', 'Run', () => {})

const modulePath = args.sub.length >= 2 ? args.sub[args.sub.length - 1] : ''

try {
    __run(`clear && pnpm exec tsx ${modulePath}`)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (err: unknown) {
    //
}
