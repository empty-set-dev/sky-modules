#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import args from 'args'

import __loadSkyConfig, { __getAppConfig } from './_loadSkyConfig'
import __sdkPath from './_sdkPath'

args.parse(process.argv, {
    name: 'sky web init',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace web {
    init()

    export async function init(): Promise<void> {
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

        fs.cpSync(path.resolve(__sdkPath, 'commands/assets/web-initial'), skyAppConfig.path, {
            recursive: true,
        })
    }
}
