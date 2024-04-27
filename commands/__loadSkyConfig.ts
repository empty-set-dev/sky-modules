import fs from 'fs'

export default function __loadSkyConfig(): {
    apps: {
        name: string
        entry: string
        platforms: string[]
    }[]
    tests: {
        name: string
        entry: string
        platforms: string[]
    }[]
    scripts: {
        name: string
        action: string
    }[]
} {
    const exists = fs.existsSync('sky.config.json')
    if (!exists) {
        // eslint-disable-next-line no-console
        console.error('missing "sky.config.json"')
        return
    }

    return JSON.parse(fs.readFileSync('sky.config.json', 'utf-8'))
}
