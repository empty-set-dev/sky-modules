#!/usr/bin/env -S npx tsx
import { fileURLToPath } from 'url'

import args from 'args'
import { createServer } from 'vite'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Open in browser', false)

const flags = args.parse(process.argv, {
    name: 'sky browser dev',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace browser {
    dev()

    export async function dev(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const skyConfig = __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        const skyAppConfig = __getAppConfig(name, skyConfig)

        if (!skyAppConfig) {
            return
        }

        const server = await createServer({
            configFile: false,
            root: __dirname,
            server: {
                port: flags.port,
            },
        })
        await server.listen()

        server.printUrls()
        server.bindCLIShortcuts({ print: true })
    }
}
