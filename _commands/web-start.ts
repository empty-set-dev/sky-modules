#!/usr/bin/env -S pnpm exec tsx
import args from 'args'

import { errorConsole } from '../utilities/console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__skyPath'

args.option('port', 'The port on which the app will be running', 80)
args.option('open', 'Open in browser', false)

const flags = args.parse(process.argv, {
    name: 'sky web start',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

startWeb()

async function startWeb(): Promise<void> {
    const name = process.argv[4]

    if (name == null || name === '') {
        errorConsole('missing app name')
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
        NODE_ENV: 'production',
        COMMAND: 'start',
        PORT: JSON.stringify(flags.port),
        OPEN: JSON.stringify(flags.open),
        HOST: 'true',
    }

    __run(`pnpm exec tsx --no-warnings ${__sdkPath}/_commands/_web.ts`, {
        env,
    })
}
