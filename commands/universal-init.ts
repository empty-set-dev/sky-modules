import fs from 'fs'
import path from 'path'

import Console from 'sky/utilities/Console'

import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import skyPath from './lib/skyPath'

await command('universal init', 'Init universal', async (): Promise<void> => {
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

    fs.cpSync(path.resolve(skyPath, '_commands/assets/universal-initial'), skyAppConfig.path, {
        recursive: true,
        force: false,
    })
})
