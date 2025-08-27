import fs from 'fs'
import path from 'path'

import { green, bright, reset } from 'sky/utilities/Console'
import { ArgumentsCamelCase } from 'yargs'

import { loadAppCofig } from './lib/loadSkyConfig'
import sdkPath from './lib/skyPath'

export default async function initDesktop(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig] = configs

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
