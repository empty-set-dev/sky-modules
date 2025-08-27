import { ArgumentsCamelCase } from 'yargs'

import runShell from './lib/run'
import skyPath from './lib/skyPath'

export default function test(argv: ArgumentsCamelCase): void {
    const folder = argv.scriptPath as string

    try {
        runShell(`pnpm exec ${skyPath}/node_modules/.bin/jest ${folder}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        //
    }
}
