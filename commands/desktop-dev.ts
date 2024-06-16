#!/usr/bin/env -S npx tsx
import path from 'path'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__sdkPath'

export namespace tauri {
    dev()

    export function dev(): void {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const skyConfig = __loadSkyConfig()
        const skyAppConfig = __getAppConfig(name, skyConfig)

        if (!skyAppConfig) {
            return
        }

        __run(path.resolve(__sdkPath, 'node_modules/.bin/tauri') + ' dev', {
            cwd: path.resolve(skyAppConfig['tauri-assets']),
        })
    }
}
