import fs from 'fs'
import path from 'path'

import Console, { green, bright, reset } from 'sky/utilities/Console'

import { command } from './lib/command'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import sdkPath from './lib/skyPath'

await command('desktop init', 'Init desktop (Tauri)', async (): Promise<void> => {
    const name = process.argv[4]

    if (name == null || name === '') {
        Console.error('missing app name')
        return
    }

    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    const skyAppConfig = getAppConfig(name, skyConfig)

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

    process.stdout.write(
        `${green}${bright}Init ${green}${bright}${name} ${green}${bright}desktop${reset} 👌\n`
    )
})
