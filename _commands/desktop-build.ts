#!/usr/bin/env -S pnpm exec tsx
import path from 'path'

import Console from '../utilities/Console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__skyPath'

await buildDesktop()

async function buildDesktop(): Promise<void> {
    const name = process.argv[4]

    if (name == null || name === '') {
        Console.error('missing app name')
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

    __run(path.resolve(__sdkPath, 'node_modules/.bin/tauri') + ' build', {
        cwd: path.resolve(skyAppConfig.path),
    })
}
