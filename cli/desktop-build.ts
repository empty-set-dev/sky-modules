import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './utilities/buildDefines'
import { loadAppCofig } from './utilities/loadSkyConfig'
import run from './utilities/run'
import sdkPath from './utilities/cliPath'

export default async function buildDesktop(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (skyAppConfig.target !== 'universal') {
        throw new Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    buildDefines(skyConfig)

    await run(path.resolve(sdkPath, 'node_modules/.bin/tauri') + ' build', {
        cwd: path.resolve(skyAppConfig.path, '.dev'),
    })
}
