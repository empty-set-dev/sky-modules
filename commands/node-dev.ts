#!/usr/bin/env -S npx tsx
import __loadSkyConfig, { __getModuleConfig } from './__loadSkyConfig'
import __run from './__run'

export namespace node {
    dev()

    export function dev(): void {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const skyConfig = __loadSkyConfig()
        const skyModuleConfig = __getModuleConfig(name, skyConfig)

        if (!skyModuleConfig) {
            return
        }

        __run(`tsx watch --expose-gc ${skyModuleConfig.entry}`)
    }
}
