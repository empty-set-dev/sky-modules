#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { b, e, purple } from './__coloredConsole'
import __loadSkyConfig, { __getModuleConfig } from './__loadSkyConfig'
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
        const skyModuleConfig = __getModuleConfig(name, skyConfig)

        if (!skyModuleConfig) {
            return
        }

        if (!skyModuleConfig['tauri-assets']) {
            // eslint-disable-next-line no-console
            console.error('missing app tauri-assets in "sky.config.json"')
            return
        }

        if (!fs.existsSync(path.resolve(skyModuleConfig['tauri-assets'], 'src-tauri'))) {
            fs.cpSync(
                path.resolve(__sdkPath, 'commands/__tauri'),
                path.resolve(skyModuleConfig['tauri-assets'], 'src-tauri'),
                {
                    recursive: true,
                }
            )
        }

        process.stdout.write(`${b}${purple}Init${e} 👌\n`)
    }
}
