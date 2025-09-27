import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import { loadAppCofig } from './lib/loadSkyConfig'
import run from './lib/run'
import skyPath from './lib/skyPath'

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

    await run(path.resolve(skyPath, 'node_modules/.bin/expo start'), {
        cwd: path.resolve(skyAppConfig.path, '.dev/expo'),
        env: {
            ...process.env,
            SKY_PATH: path.resolve(skyPath),
        },
    })
}
