#!/usr/bin/env -S pnpm exec bun
import Console from 'sky/utilities/Console'
import { ArgumentsCamelCase } from 'yargs'

import buildDefines from './lib/buildDefines'
import getAppEntry from './lib/getAppEntry'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import run from './lib/run'

export default async function devNode(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as string

    if (appName == null || appName === '') {
        Console.error('missing app name')
        return
    }

    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    const skyAppConfig = getAppConfig(appName, skyConfig)

    if (!skyAppConfig) {
        return
    }

    if (!buildDefines(skyConfig)) {
        return
    }

    const entry = getAppEntry(appName, skyAppConfig)

    const args = process.argv.slice(5)

    run(
        `npx tsx --watch --expose-gc --no-warnings --tsconfig ${
            skyAppConfig.path
        }/tsconfig.json ${entry} ${args.join(' ')}`,
        {
            env: {
                ...process.env,
                NODE_ENV: 'development',
            },
        }
    )
}
