import fs from 'fs'
import path from 'path'

import * as vite from 'vite'

export interface SkyApp {
    target: string
    path: string
    public: string
    proxy?: vite.ServerOptions['proxy']
}

export interface SkyModule {
    path: string
}

export interface SkyConfig {
    apps: Record<string, SkyApp>
    modules: Record<string, SkyModule>
    scripts: Record<string, string> | boolean
}

export default async function __loadSkyConfig(): Promise<null | SkyConfig> {
    const cwd = process.cwd()

    function findSkyConfig(): null | string {
        function findIn(dotsAndSlashes: string): null | string {
            const fullpath = path.join(cwd, dotsAndSlashes, 'sky.config.ts')

            const exists = fs.existsSync(fullpath)

            if (exists) {
                return fullpath
            } else {
                if (path.resolve(cwd, dotsAndSlashes) === '/') {
                    return null
                }

                return findIn(path.join('..', dotsAndSlashes))
            }
        }

        return findIn('.')
    }

    const skyConfigPath = findSkyConfig()
    if (!skyConfigPath) {
        // eslint-disable-next-line no-console
        console.error('missing "sky.config.ts"')
        return null
    }

    const config = (await import(skyConfigPath)).default as SkyConfig

    let hasError = false
    Object.keys(config.apps).forEach(k => {
        if (!__getAppConfig(k, config)) {
            hasError = true
        }
    })

    return hasError ? null : config
}

export function __getAppConfig(name: string, config: SkyConfig): null | SkyApp {
    const skyAppConfig = config.apps[name]

    if (!skyAppConfig) {
        // eslint-disable-next-line no-console
        console.error(`${name}: missing app description in "sky.config.ts"`)
        return null
    }

    if (!skyAppConfig.path) {
        // eslint-disable-next-line no-console
        console.error(`${name}: missing app path in "sky.config.ts"`)
        return null
    }

    if (!skyAppConfig.target) {
        // eslint-disable-next-line no-console
        console.error(`${name}: missing app target in "sky.config.ts"`)
        return null
    }

    return skyAppConfig
}
