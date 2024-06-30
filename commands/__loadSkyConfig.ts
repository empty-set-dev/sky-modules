import fs from 'fs'

export interface SkyApp {
    name: string
    target: string
    path: string
    scripts?: boolean
    public?: string
    html?: string
}

export interface SkyModule {
    name: string
    path: string
}

export interface SkyLib {
    path: string
}

export interface SkyConfig {
    apps: SkyApp[]
    modules: SkyModule[]
    libs: SkyLib[]
    scripts: Record<string, string> | boolean
}

export default function __loadSkyConfig(): null | SkyConfig {
    const exists = fs.existsSync('sky.config.json')
    if (!exists) {
        // eslint-disable-next-line no-console
        console.error('missing "sky.config.json"')
        return null
    }

    const config = JSON.parse(fs.readFileSync('sky.config.json', 'utf-8')) as SkyConfig

    let hasError = false
    config.apps.forEach(app => {
        if (!__getAppConfig(app.name, config)) {
            hasError = true
        }
    })

    return hasError ? null : config
}

export function __getAppConfig(name: string, config: SkyConfig): null | SkyApp {
    const skyAppConfig = config.apps.find(app => app.name === name)

    if (!skyAppConfig) {
        // eslint-disable-next-line no-console
        console.error(`${name}: missing app description in "sky.config.json"`)
        return null
    }

    if (!skyAppConfig.path) {
        // eslint-disable-next-line no-console
        console.error(`${name}: missing app path in "sky.config.json"`)
        return null
    }

    if (!skyAppConfig.target) {
        // eslint-disable-next-line no-console
        console.error(`${name}: missing app target in "sky.config.json"`)
        return null
    }

    return skyAppConfig
}
