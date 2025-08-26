import fs from 'fs'
import path from 'path'

import Console from 'sky/utilities/Console'

import { command } from './lib/command'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import skyPath from './lib/skyPath'

await command('web init', 'Init web', async (): Promise<void> => {
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

    fs.cpSync(path.resolve(skyPath, '_commands/assets/web-initial'), skyAppConfig.path, {
        recursive: true,
        force: false,
    })
})
