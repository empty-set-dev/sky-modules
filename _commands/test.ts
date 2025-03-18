#!/usr/bin/env -S npx tsx
import args from 'args'

import __run from './__run'

args.command('test', 'Test')

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

const modulePath = args.sub.length >= 2 ? args.sub[args.sub.length - 1] : ''

try {
    __run(`npx jest ${modulePath}`)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (err: unknown) {
    //
}
