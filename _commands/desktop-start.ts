#!/usr/bin/env -S npx tsx
import path from 'path'

import { errorConsole } from '../helpers/console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__sdkPath'

startDesktop()

async function startDesktop(): Promise<void> {
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

    __run(path.resolve(__sdkPath, 'node_modules/.bin/tauri') + ' start', {
        cwd: path.resolve(skyAppConfig.path),
    })
}
