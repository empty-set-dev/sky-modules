import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './utilities/buildDefines'
import cliPath from './utilities/cliPath'
import { loadAppCofig } from './utilities/loadSkyConfig'
import run from './utilities/run'

export default async function devWeb(
    argv: ArgumentsCamelCase<{
        appName: string
        port: number
        open: boolean
        host: boolean
    }>
): Promise<void> {
    const appName = argv.appName as string
    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs

    if (skyAppConfig.target !== 'web' && skyAppConfig.target !== 'universal') {
        throw new Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    buildDefines(skyConfig.workspace, skyConfig.modules, skyConfig.apps)

    const args = `${argv._[1]} ${appName} ${argv.host ? '--host' : ''} ${argv.open ? '--open' : ''} --port ${argv.port}`
    const tsconfig = `--tsconfig-override ${skyAppConfig.path}/tsconfig.json`

    await run(`bun run ${cliPath}/utilities/web.ts ${tsconfig} ${args}`, {
        env: {
            ...process.env,
            NODE_ENV: 'development',
        },
    })
}
