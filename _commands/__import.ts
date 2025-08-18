import fs from 'fs'
import path from 'path'

import __skyPath from './__skyPath'

export default async function __import(importPath: string): Promise<unknown> {
    const fullImportPath = path.join(__skyPath, '_commands', importPath)

    if (!fs.existsSync(fullImportPath)) {
        return
    }

    return await import(importPath)
}
