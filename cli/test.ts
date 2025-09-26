import { ArgumentsCamelCase } from 'yargs'

import runShell from './lib/run'
import skyPath from './lib/skyPath'

export default async function test(
    argv: ArgumentsCamelCase<{ mutation?: boolean; folder: string }>
): Promise<void> {
    const folder = argv.folder ?? '.'

    try {
        if (argv.mutation) {
            folder
                ? await runShell(
                      `${skyPath}/node_modules/.bin/stryker run ${skyPath}/cli/configs/stryker.config.json --mutate ` +
                          `"${folder}/**/*.js,${folder}/**/*.jsx,${folder}/**/*.ts,${folder}/**/*.tsx"`
                  )
                : await runShell(
                      `${skyPath}/node_modules/.bin/stryker run ${skyPath}/cli/configs/stryker.config.json`
                  )
        } else {
            await runShell(
                `${skyPath}/node_modules/.bin/vitest run --config ${skyPath}/cli/configs/vitest.config.js ${folder}`
            )
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        //
    }
}
