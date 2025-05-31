import fs from 'fs'
import path from 'path'

import { errorConsole } from '../utilities/console'

export interface SkyApp {
    target: 'web' | 'node' | 'universal'
    path: string
    public: string
}

export interface SkyModule {
    path: string
}

export interface SkyConfig {
    name: string
    modules: Record<string, SkyModule>
    examples: Record<string, SkyApp>
    apps: Record<string, SkyApp>
    scripts: Record<string, string> | boolean
}

const cwd = process.cwd()

export function __findSkyConfig(): null | string {
    function findIn(dotsAndSlashes: string): null | string {
        const fullPath = path.join(cwd, dotsAndSlashes, 'sky.config.ts')

        const exists = fs.existsSync(fullPath)

        if (exists) {
            return fullPath
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

    if (!config.name) {
        errorConsole(`missing name in "sky.config.ts"`)
        return null
    }

    let hasError = false
    Object.keys(config.modules).forEach(k => {
        config.modules[k].path ??= k
    })
    Object.keys(config.apps).forEach(k => {
        if (!__getAppConfig(k, config)) {
            hasError = true
        }
    })
    Object.keys(config.examples).forEach(k => {
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

    skyAppConfig.path ??= name

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
