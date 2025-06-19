#!/usr/bin/env -S pnpm exec tsx
import path from 'path'

import { errorConsole } from '../utilities/console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__skyPath'

devIos()

async function devIos(): Promise<void> {
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

    __run(path.resolve(__sdkPath, 'node_modules/.bin/expo start'), {
        cwd: path.resolve(skyAppConfig.path, 'dev/expo'),
        env: {
            ...process.env,
            SKY_PATH: path.resolve(process.cwd(), __sdkPath),
        },
    })
}
