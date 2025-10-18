import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './utilities/buildDefines'
import { loadAppCofig } from './utilities/loadSkyConfig'
import run from './utilities/run'

export default async function devAndroid(
    argv: ArgumentsCamelCase<{ appName: string }>
): Promise<void> {
    const appName = argv.appName
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (skyAppConfig.target !== 'universal') {
        throw new Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    buildDefines(skyConfig)

    await run('expo start', {
        cwd: path.resolve(skyAppConfig.path, '.dev/expo'),
        env: process.env,
    })
}
