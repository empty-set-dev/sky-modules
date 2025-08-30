import fs from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import { loadAppCofig } from './lib/loadSkyConfig'
import replaceFileVariables from './lib/replaceFileVariables'
import skyPath from './lib/skyPath'

export default async function initUniversal(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (skyAppConfig.target !== 'node') {
        throw Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    try {
        fs.cpSync(path.resolve(skyPath, 'commands/assets/node-initial'), skyAppConfig.path, {
            recursive: true,
            force: false,
        })
    } finally {
        const variables = {
            PROJECT_ID: skyConfig.id,
            APP_ID: skyAppConfig.id,
        }
        replaceFileVariables(path.join(skyAppConfig.path, 'App.ts'), variables)
        replaceFileVariables(path.join(skyAppConfig.path, 'imports.ts'), variables)
    }
}
