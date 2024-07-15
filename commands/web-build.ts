#!/usr/bin/env -S npx tsx
import path from 'path'

import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__sdkPath'

export namespace web {
    build()

    export async function build(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
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

        const env = {
            ...process.env,
            NAME: name,
            NODE_ENV: 'production',
            COMMAND: 'build',
            PORT: 'null',
            OPEN: 'null',
        }

        __run(
            `node --loader ${path.resolve(
                __sdkPath,
                'node_modules/ts-node/esm.mjs'
            )} --no-warnings ${__sdkPath}/commands/__web.ts`,
            {
                env,
            }
        )
    }
}
