#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __run from './__run'

args.command('test', 'Test', () => {})

const modulePath = args.sub.length >= 2 ? args.sub[args.sub.length - 1] : ''

__run(`npx jest ${modulePath}`)
try {
    __run(`npx jest ${modulePath}`)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (err: unknown) {
    //
}
