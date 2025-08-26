import args from 'args'

import { command } from './lib/command'
import run from './lib/run'
import skyPath from './lib/skyPath'

await command('test', 'Test', () => {
    const modulePath = args.sub.length >= 2 ? args.sub[args.sub.length - 1] : ''

    try {
        run(`pnpm exec ${skyPath}/node_modules/.bin/jest ${modulePath}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
        //
    }
})
