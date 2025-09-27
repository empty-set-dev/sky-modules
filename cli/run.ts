import { ArgumentsCamelCase } from 'yargs'

import runShell from './utilities/run'

export default async function run(argv: ArgumentsCamelCase): Promise<void> {
    const scriptPath = argv.scriptPath as string

    try {
        await runShell(`pnpm exec bun ${scriptPath}`)
    } catch {
        //
    }
}
