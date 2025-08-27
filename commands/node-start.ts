import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import getAppEntry from './lib/getAppEntry'
import { loadAppCofig } from './lib/loadSkyConfig'
import run from './lib/run'

export default async function startNode(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (!buildDefines(skyConfig)) {
        return
    }

    const entry = getAppEntry(appName, skyAppConfig)

    const args = argv.args as string[]

    run(
        `pnpm bun --watch --expose-gc --no-warnings --tsconfig ${
            skyAppConfig.path
        }/tsconfig.json ${entry} ${args.join(' ')}`,
        {
            env: {
                ...process.env,
                NODE_ENV: 'production',
            },
        }
    )
}
