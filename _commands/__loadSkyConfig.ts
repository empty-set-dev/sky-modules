import fs from 'fs'
import path from 'path'

import SkyApp from '../configuration/SkyApp'
import SkyConfig from '../configuration/SkyConfig'
import Console from '../utilities/Console'

const cwd = process.cwd()

export default async function __loadSkyConfig(): Promise<null | SkyConfig> {
    const skyConfigPath = __findSkyConfig()

    if (!skyConfigPath) {
        Console.error('missing "sky.config.ts"')
        return null
    }

    const config = new SkyConfig((await import(skyConfigPath.replace('D:\\', 'file:///D:\\'))).default)

    if (!config.name) {
        Console.error(`missing name in "sky.config.ts"`)
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
        Console.error(`${name}: missing app description in "sky.config.ts"`)
        return null
    }

    skyAppConfig.path ??= name

    if (!skyAppConfig.target) {
        Console.error(`${name}: missing app target in "sky.config.ts"`)
        return null
    }

    if (
        (skyAppConfig.target === 'web' || skyAppConfig.target === 'universal') &&
        !skyAppConfig.public
    ) {
        Console.error(`${name}: missing app public in "sky.config.ts"`)
        return null
    }

    return skyAppConfig
}
