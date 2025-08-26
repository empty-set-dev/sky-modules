#!/usr/bin/env -S pnpm exec bun
import path from 'path'

import Console from 'sky/utilities/Console'

import buildDefines from './lib/buildDefines'
import { command } from './lib/command'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import run from './lib/run'
import sdkPath from './lib/skyPath'

await command('desktop dev', 'Dev desktop (Tauri)', async (): Promise<void> => {
    const name = process.argv[4]

    if (name == null || name === '') {
        Console.error('missing app name')
        return
    }

    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    const skyAppConfig = getAppConfig(name, skyConfig)

    if (!skyAppConfig) {
        return
    }

    if (!buildDefines(skyConfig)) {
        return
    }

    run(path.resolve(sdkPath, 'node_modules/.bin/tauri') + ' dev', {
        cwd: path.resolve(skyAppConfig.path, '.dev'),
    })
})
