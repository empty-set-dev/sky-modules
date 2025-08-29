import fs from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import { loadAppCofig } from './lib/loadSkyConfig'
import skyPath from './lib/skyPath'

export default async function initUniversal(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig] = configs

    if (skyAppConfig.target !== 'universal') {
        throw Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    fs.cpSync(path.resolve(skyPath, 'commands/assets/universal-initial'), skyAppConfig.path, {
        recursive: true,
        force: false,
    })
}
