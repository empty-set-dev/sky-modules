import fs from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import { loadAppCofig } from './lib/loadSkyConfig'
import replaceFileVariables from './lib/replaceFileVariables'
import skyPath from './lib/skyPath'

export default async function initWeb(
    argv: ArgumentsCamelCase<{
        appName: string
        server?: boolean
    }>
): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig] = configs

    if (skyAppConfig.target !== 'web' && skyAppConfig.target !== 'universal') {
        throw Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    try {
        if (argv.server === true) {
            fs.cpSync(
                path.resolve(skyPath, 'commands/assets/web-initial/server'),
                path.join(skyAppConfig.path, 'server'),
                {
                    recursive: true,
                    force: false,
                }
            )
            return
        }

        fs.cpSync(path.resolve(skyPath, 'commands/assets/web-initial'), skyAppConfig.path, {
            recursive: true,
            force: false,
        })
    } finally {
        const variables = {
            APP_ID: skyAppConfig.id,
        }
        replaceFileVariables(path.join(skyAppConfig.path, 'App.tsx'), variables)
        replaceFileVariables(path.join(skyAppConfig.path, 'server/AppServer.tsx'), variables)
        replaceFileVariables(path.join(skyAppConfig.path, 'server/imports.ts'), variables)
    }
}
