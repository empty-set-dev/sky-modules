#!/usr/bin/env -S npx tsx
import path from 'path'
import { fileURLToPath } from 'url'

import { b, e, purple, red } from './__coloredConsole'
import __getProgressPlugin from './__getProgressPlugin'
import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __loadTsConfig from './__loadTsConfig'
import __sdkPath from './__sdkPath'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sdkNodeModulesPath = path.resolve(__dirname, '../node_modules')

export namespace browser {
    build()

    export async function build(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
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
