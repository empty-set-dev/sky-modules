import fs from 'fs'
import path from 'path'

import SkyApp from '../configuration/SkyApp'

export default function __getAppEntry(name: string, app: SkyApp): string {
    const entry = getAppEntryByPath(app.path)

    if (entry == null) {
        throw new Error(`${name}: entry not found`)
    }

    return entry
}

function getAppEntryByPath(folderPath: string): undefined | string {
    if (fs.existsSync(path.join(folderPath, 'index.tsx'))) {
        return path.join(folderPath, 'index.tsx')
    }

    if (fs.existsSync(path.join(folderPath, 'index.ts'))) {
        return path.join(folderPath, 'index.ts')
    }
}
