import fs from 'fs'
import path from 'path'

import { SkyApp } from './__loadSkyConfig'

export default function __getAppEntry(app: SkyApp): string {
    const entry = getEntry(app.path)

    if (!entry) {
        throw new Error(`${app.name}: entry not found`)
    }

    return entry
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
