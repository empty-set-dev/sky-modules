import { SkyUniversalApp, SkyWebApp } from 'sky/configuration/SkyApp'
import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import { findSkyConfig, loadAppCofig } from './lib/loadSkyConfig'
import web from './lib/web'

export default async function devWeb(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (skyAppConfig.target !== 'web' && skyAppConfig.target !== 'universal') {
        throw Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    if (!buildDefines(skyConfig)) {
        return
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
