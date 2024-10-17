#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { magenta, bright, reset } from 'sky/helpers/console'
import { errorConsole } from 'sky/helpers/console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __sdkPath from './__sdkPath'

export namespace desktop {
    init()

    export async function init(): Promise<void> {
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

        if (!fs.existsSync(path.resolve(skyAppConfig.path, 'src-tauri'))) {
            fs.cpSync(
                path.resolve(__sdkPath, '_commands/assets/desktop-initial'),
                path.resolve(skyAppConfig.path, 'src-tauri'),
                {
                    recursive: true,
                }
            )
        }

        process.stdout.write(`${magenta}${bright}Init${reset} 👌\n`)
    }
}
