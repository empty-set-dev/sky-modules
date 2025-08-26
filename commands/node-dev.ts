#!/usr/bin/env -S pnpm exec tsx
import Console from '../utilities/Console'

import buildDefines from './lib/buildDefines'
import { command } from './lib/command'
import getAppEntry from './lib/getAppEntry'
import loadSkyConfig, { getAppConfig } from './lib/loadSkyConfig'
import run from './lib/run'

await command('node dev', 'Dev node', async (): Promise<void> => {
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

    const entry = getAppEntry(name, skyAppConfig)

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
})
