#!/usr/bin/env -S pnpm exec bun
import args from 'args'

import { command } from './lib/command'
import run from './lib/run'

await command('run', 'Run', () => {
    const modulePath = args.sub.length >= 2 ? args.sub[args.sub.length - 1] : ''

    try {
        run(`clear && pnpm exec bun ${modulePath}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
        //
    }
})
