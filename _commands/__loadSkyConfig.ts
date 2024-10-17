import fs from 'fs'
import path from 'path'

import { errorConsole } from 'sky/helpers/console'
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
    modules: Record<string, SkyModule>
    examples: Record<string, SkyApp>
    apps: Record<string, SkyApp>
    scripts: Record<string, string> | boolean
}

const cwd = process.cwd()

export function __findSkyConfig(): null | string {
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

export default async function __loadSkyConfig(): Promise<null | SkyConfig> {
    const skyConfigPath = __findSkyConfig()

    if (!skyConfigPath) {
        errorConsole('missing "sky.config.ts"')
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
    const skyAppConfig = config.apps[name] ?? config.examples[name]

    if (!skyAppConfig) {
        errorConsole(`${name}: missing app description in "sky.config.ts"`)
        return null
    }

    if (!skyAppConfig.target) {
        errorConsole(`${name}: missing app target in "sky.config.ts"`)
        return null
    }

    if (
        (skyAppConfig.target === 'web' || skyAppConfig.target === 'universal') &&
        !skyAppConfig.public
    ) {
        errorConsole(`${name}: missing app public in "sky.config.ts"`)
        return null
    }
    return skyAppConfig
}
