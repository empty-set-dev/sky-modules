import { ArgumentsCamelCase } from 'yargs'

import { loadAppCofig } from './lib/loadSkyConfig'
import run from './lib/run'
import skyPath from './lib/skyPath'

export default async function previewWeb(
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

    const [skyAppConfig] = configs

    if (skyAppConfig.target !== 'web' && skyAppConfig.target !== 'universal') {
        throw Error(`${appName}: bad target (${skyAppConfig.target})`)
    }

    const args = `${argv._[1]} ${appName} ${argv.host ? '--host' : ''} ${argv.open ? '--open' : ''} --port ${argv.port}`
    const tsconfig = `--tsconfig ${skyAppConfig.path}/tsconfig.json`

    await run(`pnpm bun run ${skyPath}/commands/lib/web.ts ${tsconfig} ${args}`, {
        env: {
            ...process.env,
            NODE_ENV: 'production',
        },
    })
}
