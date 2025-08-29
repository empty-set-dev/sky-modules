import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import { loadAppCofig } from './lib/loadSkyConfig'
import run from './lib/run'
import sdkPath from './lib/skyPath'

export default async function startDesktop(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (skyAppConfig.target !== 'universal') {
        throw Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    buildDefines(skyConfig)

    run(path.resolve(sdkPath, 'node_modules/.bin/tauri') + ' start', {
        cwd: path.resolve(skyAppConfig.path, '.dev'),
    })
}
