import fs from 'fs'
import path from 'path'

import { errorConsole } from 'sky/utilities/console'

import SkyApp from './_SkyApp'
import SkyConfig from './_SkyConfig'

const cwd = process.cwd()

export default async function __loadSkyConfig(): Promise<null | SkyConfig> {
    const skyConfigPath = __findSkyConfig()

    if (!skyConfigPath) {
        errorConsole('missing "sky.config.ts"')
        return null
    }

    const config = new SkyConfig((await import(skyConfigPath)).default)

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
