#!/usr/bin/env -S npx tsx
import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'

export namespace web {
    build()

    export async function build(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            return
        }

        const skyConfig = __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        const skyAppConfig = __getAppConfig(name, skyConfig)

        if (!skyAppConfig) {
            return
        }
    }
}
