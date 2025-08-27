import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import { loadAppCofig } from './lib/loadSkyConfig'
import run from './lib/run'
import sdkPath from './lib/skyPath'

export default async function devDesktop(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (!buildDefines(skyConfig)) {
        return
    }

    run(path.resolve(sdkPath, 'node_modules/.bin/tauri') + ' dev', {
        cwd: path.resolve(skyAppConfig.path, '.dev'),
    })
}
