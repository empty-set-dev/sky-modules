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

export function __getBrowserEntries(
    pagesPath: string
): { entry: string; path: string; component: React.FC }[] {
    return getBrowserEntries(pagesPath, pagesPath)
}

function getBrowserEntries(
    pagesPath: string,
    folder: string
): { entry: string; path: string; component: React.FC }[] {
    const entries = []

    const list = fs.readdirSync(folder)
    list.forEach(item => {
        const itemPath = path.join(folder, item)

        if (
            item === 'index.tsx' ||
            item === 'index.ts' ||
            item === 'index.js' ||
            item === 'index.jsx'
        ) {
            let pagePath = path.relative(pagesPath, folder)
            pagePath = pagePath.replaceAll(/\[(.*?)\]/g, ':$1')

            entries.push({
                entry: itemPath,
                path: `/${pagePath}`,
                getComponent: () => import(path.join(folder, item)),
            })

            return
        }

        if (fs.statSync(itemPath).isDirectory()) {
            entries.push(...getBrowserEntries(pagesPath, itemPath))
        }
    })

    return entries
}
