import fs from 'fs'
import path from 'path'

import { SkyApp } from './__loadSkyConfig'

export default function __getAppEntries(app: SkyApp): string[] {
    if (app.platforms.includes('node') || app.platforms.includes('native')) {
        const entry = getEntry(app.path)
        if (!entry) {
            throw new Error(`${app.name}: entry not found`)
        }
        return [entry]
    } else if (app.platforms.includes('browser')) {
        if (!fs.existsSync(path.join(app.path, 'pages'))) {
            throw new Error(`${app.name}: pages not found`)
        }

        const entries = getBrowserEntries(path.join(app.path, 'pages'), '/')
    }

    throw new Error(`${app.name}: no platform`)
}

function getBrowserEntries(pagesPath: string, url: string) {
    
}

function getEntry(folderPath: string): string {
    if (fs.existsSync(path.join(folderPath, 'index.tsx'))) {
        return path.join(folderPath, 'index.tsx')
    }
    if (fs.existsSync(path.join(folderPath, 'index.ts'))) {
        return path.join(folderPath, 'index.ts')
    }
    if (fs.existsSync(path.join(folderPath, 'index.jsx'))) {
        return path.join(folderPath, 'index.jsx')
    }
    if (fs.existsSync(path.join(folderPath, 'index.js'))) {
        return path.join(folderPath, 'index.js')
    }
}
