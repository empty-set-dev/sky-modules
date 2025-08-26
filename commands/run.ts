import args from 'args'

import runShell from './lib/run'

export default function run(): void {
    const modulePath = args.sub.length >= 2 ? args.sub[args.sub.length - 1] : ''

    try {
        runShell(`clear && pnpm exec bun ${modulePath}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
        //
    }
}
