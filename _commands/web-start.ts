#!/usr/bin/env -S npx tsx
import args from 'args'
import { errorConsole } from 'sky/helpers/console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__sdkPath'

args.option('port', 'The port on which the app will be running', 80)
args.option('open', 'Open in browser', false)

const flags = args.parse(process.argv, {
    name: 'sky web start',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace web {
    start()

    export async function start(): Promise<void> {
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

        const env = {
            ...process.env,
            NAME: name,
            NODE_ENV: 'production',
            COMMAND: 'start',
            PORT: JSON.stringify(flags.port),
            OPEN: JSON.stringify(flags.open),
            HOST: 'true',
        }

        __run(`npx tsx --no-warnings ${__sdkPath}/_commands/_web.ts`, {
            env,
        })
    }
}
