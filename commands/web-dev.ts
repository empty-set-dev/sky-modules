import { SkyUniversalApp, SkyWebApp } from 'sky/configuration/SkyApp'
import Console from 'sky/utilities/Console'
import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import loadSkyConfig, { findSkyConfig, getAppConfig } from './lib/loadSkyConfig'
import web from './lib/web'

export default async function devWeb(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string

    if (appName == null || appName === '') {
        Console.error('missing app name')
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

    if (!buildDefines(skyConfig)) {
        return
    }

    if (skyAppConfig.target !== 'web' && skyAppConfig.target !== 'universal') {
        throw Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    const skyConfigPath = findSkyConfig() as string

    await web({
        appName,
        command: argv._[1] as string,
        host: argv.host as boolean,
        open: argv.open as boolean,
        port: argv.port as number,
        skyAppConfig: skyAppConfig as SkyWebApp | SkyUniversalApp,
        skyConfig,
        skyConfigPath,
    })
}
