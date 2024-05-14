import fs from 'fs'

interface SkyApp {
    name: string
    entry: string
    platforms: string[]
}

interface SkyModule {
    name: string
    path: string
}

interface SkyLib {
    path: string
}

interface SkyScript {
    name: string
    action: string
}

interface SkyConfig {
    apps: SkyApp[]
    modules: SkyModule[]
    libs: SkyLib[]
    scripts: SkyScript[]
}

export default function __loadSkyConfig(): null | SkyConfig {
    const exists = fs.existsSync('sky.config.json')
    if (!exists) {
        // eslint-disable-next-line no-console
        console.error('missing "sky.config.json"')
        return null
    }

    return JSON.parse(fs.readFileSync('sky.config.json', 'utf-8'))
}

export function __getModuleConfig(name: string, config: SkyConfig): null | SkyApp {
    const skyAppConfig = config.apps.find(app => app.name === name)

    if (!skyAppConfig) {
        // eslint-disable-next-line no-console
        console.error('missing app description in "sky.config.json"')
        return null
    }

    if (!skyAppConfig['entry']) {
        // eslint-disable-next-line no-console
        console.error('missing app entry in "sky.config.json"')
        return null
    }

    if (!skyAppConfig['platforms']) {
        // eslint-disable-next-line no-console
        console.error('missing app platforms in "sky.config.json"')
        return null
    }

    return skyAppConfig
}
