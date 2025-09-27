import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './utilities/buildDefines'
import getAppEntry from './utilities/getAppEntry'
import { loadAppCofig } from './utilities/loadSkyConfig'
import run from './utilities/run'

export default async function startNode(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (skyAppConfig.target !== 'node') {
        throw new Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    buildDefines(skyConfig)

    const entry = getAppEntry(appName, skyAppConfig)

    const args = argv.args as string[]

    await run(
        `bun run --watch --expose-gc --tsconfig-override ${path.resolve(
            skyAppConfig.path
        )}/tsconfig.json ${entry} ${args.join(' ')}`,
        {
            env: {
                ...process.env,
                NODE_ENV: 'production',
            },
        }
    )
}
