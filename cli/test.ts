import { ArgumentsCamelCase } from 'yargs'

import runShell from './lib/run'
import skyPath from './lib/skyPath'

export default async function test(
    argv: ArgumentsCamelCase<{ mutation?: boolean; folder: string }>
): Promise<void> {
    const folder = argv.folder ?? '.'

    try {
        if (argv.mutation) {
            await runShell(`pnpm stryker run ${skyPath}/cli/configs/stryker.config.json`)
        } else {
            await runShell(`pnpm jest --config ${skyPath}/cli/configs/jest.config.js ${folder}`)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        //
    }
}
