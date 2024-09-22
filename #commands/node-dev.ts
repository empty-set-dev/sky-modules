#!/usr/bin/env -S npx tsx
import __getAppEntry from './_getAppEntry'
import __loadSkyConfig, { __getAppConfig } from './_loadSkyConfig'
import __run from './_run'

export namespace node {
    dev()

    export async function dev(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
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

        const entry = __getAppEntry(name, skyAppConfig)

        __run(`tsx --watch --expose-gc --no-warnings ${entry}`, {
            env: {
                ...process.env,
                NODE_ENV: 'development',
            },
        })
    }
}
