#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'
import path from 'path'

import { errorConsole } from 'sky/utilities/console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __sdkPath from './__skyPath'

initUniversal()

async function initUniversal(): Promise<void> {
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

    fs.cpSync(path.resolve(__sdkPath, '_commands/assets/universal-initial'), skyAppConfig.path, {
        recursive: true,
        force: false,
    })
}
