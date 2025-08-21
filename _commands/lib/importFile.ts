import fs from 'fs'
import path from 'path'

import skyPath from './skyPath'

export default async function importFile(importPath: string): Promise<unknown> {
    const fullImportPath = path.join(skyPath, '_commands', importPath)

    if (!fs.existsSync(fullImportPath)) {
        return
    }

    return await import(fullImportPath)
}
