import { ArgumentsCamelCase } from 'yargs'

import runShell from './lib/run'
import skyPath from './lib/skyPath'

export default async function test(argv: ArgumentsCamelCase<{ folder: string }>): Promise<void> {
    const folder = argv.folder ?? '.'

    try {
        await runShell(`pnpm jest --config ${skyPath}/commands/configs/jest.config.js ${folder}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        //
    }
}
