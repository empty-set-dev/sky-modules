import 'sky/configuration/Sky.App.global'
import 'sky/configuration/Sky.Config.global'

import fs from 'fs'
import path from 'path'

import Console from './Console'
import getUnixPath from './getUnixPath'

const cwd = process.cwd()

export default async function loadSkyConfig(): Promise<null | Sky.Config> {
    const skyConfigPath = findSkyConfig()

    if (!skyConfigPath) {
        Console.error('missing "sky.config.ts"')
        return null
    }

    const parameters = (await import(getUnixPath(skyConfigPath))).default

    if (!parameters.name) {
        Console.error(`missing name in "sky.config.ts"`)
        return null
    }

    const config = new Sky.Config(parameters)

    let hasError = false
    Object.keys(config.modules).forEach(k => {
        config.modules[k].path ??= k
    })
    Object.keys(config.apps).forEach(k => {
        if (!getAppConfig(k, config)) {
            hasError = true
        }
    })
    Object.keys(config.examples).forEach(k => {
        if (!getAppConfig(k, config)) {
            hasError = true
        }
    })

    return hasError ? null : config
}

export function findSkyConfig(): null | string {
    function findIn(dotsAndSlashes: string): null | string {
        const fullPath = path.join(cwd, dotsAndSlashes, '.sky/sky.config.ts')

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

export async function loadAppCofig(appName: string): Promise<null | [Sky.App, Sky.Config]> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return null
    }

    const skyAppConfig = getAppConfig(appName, skyConfig)

    if (!skyAppConfig) {
        return null
    }

    return [skyAppConfig, skyConfig]
}

export function getAppConfig(name: string, config: Sky.Config): null | Sky.App {
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
