import Console from 'sky/utilities/Console'

import buildDefines from './lib/buildDefines'
import { command } from './lib/command'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import run from './lib/run'
import skyPath from './lib/skyPath'

await command('web build', 'Build web', async (): Promise<void> => {
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

    if (!buildDefines(skyConfig)) {
        return
    }

    const env: NodeJS.ProcessEnv = {
        ...process.env,
        NAME: name,
        NODE_ENV: 'production',
        COMMAND: 'build',
        PORT: 'null',
        OPEN: 'null',
        HOST: 'null',
    }

    run(`pnpm exec bun --no-warnings ${skyPath}/_commands/lib/web.ts`, {
        env,
    })
})
