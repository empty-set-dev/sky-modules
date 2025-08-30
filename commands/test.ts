import { ArgumentsCamelCase } from 'yargs'

import runShell from './lib/run'
import skyPath from './lib/skyPath'

export default function test(argv: ArgumentsCamelCase<{ folder: string }>): void {
    const folder = argv.folder ?? '.'

    try {
        runShell(
            `pnpm exec ${skyPath}/node_modules/.bin/jest --config ${skyPath}/commands/configs/jest.config.js ${folder}`
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        //
    }
}
