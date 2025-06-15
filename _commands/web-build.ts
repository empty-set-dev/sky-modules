#!/usr/bin/env -S pnpm exec tsx
import { errorConsole } from 'sky/utilities/console'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__skyPath'

buildWeb()

async function buildWeb(): Promise<void> {
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

    const env: NodeJS.ProcessEnv = {
        ...process.env,
        NAME: name,
        NODE_ENV: 'production',
        COMMAND: 'build',
        PORT: 'null',
        OPEN: 'null',
        HOST: 'null',
    }

    __run(`pnpm exec tsx --no-warnings ${__sdkPath}/_commands/_web.ts`, {
        env,
    })
}
