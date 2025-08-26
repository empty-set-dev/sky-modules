import fs from 'fs'
import path from 'path'

import Console, { green, bright, reset } from 'sky/utilities/Console'
import { ArgumentsCamelCase } from 'yargs'

import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import sdkPath from './lib/skyPath'

export default async function initDesktop(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string

    if (appName == null || appName === '') {
        Console.error('missing app appName')
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

    if (!fs.existsSync(path.resolve(skyAppConfig.path, '.dev/src-tauri'))) {
        fs.cpSync(
            path.resolve(sdkPath, '_commands/assets/desktop-initial'),
            path.resolve(skyAppConfig.path, '.dev/src-tauri'),
            {
                recursive: true,
            }
        )
    }

    process.stdout.write(`${green}${bright}Init ${appName} desktop${reset} 👌\n`)
}
