import fs from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import sdkPath from './utilities/cliPath'
import { green, bright, reset } from './utilities/Console'
import { loadAppCofig } from './utilities/loadSkyConfig'

export default async function initDesktop(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig] = configs

    if (skyAppConfig.target !== 'universal') {
        throw new Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    if (!fs.existsSync(path.resolve(skyAppConfig.path, '.dev/src-tauri'))) {
        fs.cpSync(
            path.resolve(sdkPath, 'cli/assets/desktop-initial'),
            path.resolve(skyAppConfig.path, '.dev/src-tauri'),
            {
                recursive: true,
            }
        )
    }

    process.stdout.write(`${green}${bright}Init ${appName} desktop${reset} 👌\n`)
}
