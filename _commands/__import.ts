import fs from 'fs'
import path from 'path'

import __skyPath from './__skyPath'

export default function __import(importPath: string): undefined | Promise<unknown> {
    const fullImportPath = path.join(__skyPath, '_commands', importPath)

    if (!fs.existsSync(fullImportPath)) {
        return
    }

    return import(importPath)
}
