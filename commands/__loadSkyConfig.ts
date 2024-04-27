import fs from 'fs'

interface SkyModule {
    name: string
    entry: string
    platforms: string[]
}

interface SkyScript {
    name: string
    action: string
}

interface SkyConfig {
    modules: SkyModule[]
    apps: SkyModule[]
    tests: SkyModule[]
    scripts: SkyScript[]
}

export default function __loadSkyConfig(): SkyConfig {
    const exists = fs.existsSync('sky.config.json')
    if (!exists) {
        // eslint-disable-next-line no-console
        console.error('missing "sky.config.json"')
        return
    }

    return JSON.parse(fs.readFileSync('sky.config.json', 'utf-8'))
}

export function __getModuleConfig(name: string, config: SkyConfig): SkyModule {
    const skyModuleConfig =
        config.apps.find(app => app.name === name) ?? config.tests.find(app => app.name === name)

    if (!skyModuleConfig) {
        // eslint-disable-next-line no-console
        console.error('missing app description in "sky.config.json"')
        return
    }

    if (!skyModuleConfig['entry']) {
        // eslint-disable-next-line no-console
        console.error('missing app entry in "sky.config.json"')
        return
    }

    if (!skyModuleConfig['platforms']) {
        // eslint-disable-next-line no-console
        console.error('missing app platforms in "sky.config.json"')
        return
    }

    return skyModuleConfig
}
