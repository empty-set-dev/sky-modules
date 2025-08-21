#!/usr/bin/env -S pnpm exec tsx
import Console from '../utilities/Console'

import __buildDefines from './__buildDefines'
import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__skyPath'

await buildWeb()

async function buildWeb(): Promise<void> {
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

    __buildDefines(skyConfig)

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
