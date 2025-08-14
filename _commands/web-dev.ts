#!/usr/bin/env -S pnpm exec tsx
import args from 'args'

import Console from '../utilities/Console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__skyPath'

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Open in browser', false)
args.option('host', 'Expose', false)

const flags = args.parse(process.argv, {
    name: 'sky web dev',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

devWeb()

async function devWeb(): Promise<void> {
    const name = process.argv[4]

    if (name == null || name === '') {
        Console.error('missing app name')
        return
    }

    const skyConfig = await __loadSkyConfig()

    if (!skyConfig) {
        return
    }

    const skyAppConfig = __getAppConfig(name, skyConfig)

    if (!skyAppConfig) {
        return
    }

    const env: NodeJS.ProcessEnv = {
        ...process.env,
        NAME: name,
        NODE_ENV: 'development',
        COMMAND: 'dev',
        PORT: JSON.stringify(flags.port),
        OPEN: JSON.stringify(flags.open),
        HOST: JSON.stringify(flags.host),
    }

    __run(`pnpm exec tsx --no-warnings ${__sdkPath}/_commands/_web.ts`, {
        env,
    })
}
