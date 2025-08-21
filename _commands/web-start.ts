#!/usr/bin/env -S pnpm exec tsx
import args from 'args'

import Console from '../utilities/Console'

import { command } from './lib/command'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import run from './lib/run'
import skyPath from './lib/skyPath'

args.option('port', 'The port on which the app will be running', 80)
args.option('open', 'Open in browser', false)

await command('web start', 'Start web', async (flags): Promise<void> => {
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

    const env: NodeJS.ProcessEnv = {
        ...process.env,
        NAME: name,
        NODE_ENV: 'production',
        COMMAND: 'start',
        PORT: JSON.stringify(flags.port),
        OPEN: JSON.stringify(flags.open),
        HOST: 'true',
    }

    run(`pnpm exec tsx --no-warnings ${skyPath}/_commands/_web.ts`, {
        env,
    })
})
