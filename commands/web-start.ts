#!/usr/bin/env -S npx tsx
import args from 'args'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'

args.option('port', 'The port on which the app will be running', 3000)
args.option('api-port', 'The api port on which the api will be running', 3001)
args.option('open', 'Open in browser', false)

args.parse(process.argv, {
    name: 'sky web start',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace web {
    production()

    export function production(): void {
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

        if (!skyAppConfig['public']) {
            // eslint-disable-next-line no-console
            console.error('missing app public in "sky.config.json"')
            return
        }
    }
}
