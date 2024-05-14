#!/usr/bin/env -S npx tsx
import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'

export namespace node {
    start()

    export function start(): void {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const skyConfig = __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        const skyModuleConfig = __getAppConfig(name, skyConfig)

        if (!skyModuleConfig) {
            return
        }

        __run(`tsx --watch --expose-gc --no-warnings ${skyModuleConfig.entry}`)
    }
}
