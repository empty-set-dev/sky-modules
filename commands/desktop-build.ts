import path from 'path'

import Console from 'sky/utilities/Console'
import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import run from './lib/run'
import sdkPath from './lib/skyPath'

export default async function buildDesktop(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string

    if (appName == null || appName === '') {
        Console.error(`${appName}: missing app name`)
        return
    }

    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    const skyAppConfig = getAppConfig(appName, skyConfig)

    if (!skyAppConfig) {
        return
    }

    if (!buildDefines(skyConfig)) {
        return
    }

    run(path.resolve(sdkPath, 'node_modules/.bin/tauri') + ' build', {
        cwd: path.resolve(skyAppConfig.path, '.dev'),
    })
}
