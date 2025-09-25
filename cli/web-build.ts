import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import { loadAppCofig } from './lib/loadSkyConfig'
import run from './lib/run'
import skyPath from './lib/skyPath'

export default async function buildWeb(
    argv: ArgumentsCamelCase<{
        appName: string
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

    buildDefines(skyConfig)

    const args = `${argv._[1]} ${appName} --port 3000`
    const tsconfig = `--tsconfig-override ${skyAppConfig.path}/tsconfig.json`

    await run(`bun run ${skyPath}/commands/lib/web.ts ${tsconfig} ${args}`, {
        env: {
            ...process.env,
            NODE_ENV: 'production',
        },
    })
}
