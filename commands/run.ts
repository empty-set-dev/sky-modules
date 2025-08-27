import { ArgumentsCamelCase } from 'yargs'

import runShell from './lib/run'

export default function run(argv: ArgumentsCamelCase): void {
    const scriptPath = argv.scriptPath as string

    try {
        runShell(`pnpm exec bun ${scriptPath}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        //
    }
}
