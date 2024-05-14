#!/usr/bin/env -S npx tsx
import path from 'path'
import { fileURLToPath } from 'url'

import args from 'args'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __loadTsConfig from './__loadTsConfig'
import __sdkPath from './__sdkPath'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

args.option('port', 'The port on which the app will be running', 3000)
args.option('api-port', 'The api port on which the api will be running', 3001)
args.option('open', 'Open in browser', false)

const sdkNodeModulesPath = path.resolve(__dirname, '../node_modules')

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

        const skyModuleConfig = __getAppConfig(name, skyConfig)

        if (!skyModuleConfig) {
            return
        }

        if (!skyModuleConfig['public']) {
            // eslint-disable-next-line no-console
            console.error('missing app public in "sky.config.json"')
            return
        }
    }
}
