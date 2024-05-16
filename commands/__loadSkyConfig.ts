import fs from 'fs'

export interface SkyApp {
    name: string
    platforms: string[]
    path: string
    scripts?: boolean
    public?: string
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

    config.apps.forEach(app => {
        __getAppConfig(app.name, config)
    })

    return config
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

    if (!skyAppConfig.platforms) {
        // eslint-disable-next-line no-console
        console.error(`${name}: missing app platforms in "sky.config.json"`)
        return null
    }

    return skyAppConfig
}
