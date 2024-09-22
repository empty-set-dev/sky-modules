#!/usr/bin/env -S npx tsx
import path from 'path'

import args from 'args'

import __loadSkyConfig, { __getAppConfig } from './_loadSkyConfig'
import __run from './_run'
import __sdkPath from './_sdkPath'

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
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
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
        }

        __run(
            `node --loader ${path.resolve(
                __sdkPath,
                'node_modules/ts-node/esm.mjs'
            )} --no-warnings ${__sdkPath}/commands/__web.ts`,
            {
                env,
            }
        )
    }
}
