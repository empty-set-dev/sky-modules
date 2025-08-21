#!/usr/bin/env -S pnpm exec tsx
import path from 'path'

import Console from '../utilities/Console'

import buildDefines from './lib/buildDefines'
import { command } from './lib/command'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import run from './lib/run'
import skyPath from './lib/skyPath'

await command('ios dev', 'Dev iOS', async (): Promise<void> => {
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

    await buildDefines(skyConfig)

    run(path.resolve(skyPath, 'node_modules/.bin/expo start'), {
        cwd: path.resolve(skyAppConfig.path, 'dev/expo'),
        env: {
            ...process.env,
            SKY_PATH: path.resolve(process.cwd(), skyPath),
        },
    })
})
