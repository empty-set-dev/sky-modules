import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function __import(importPath: string): undefined | Promise<unknown> {
    if (!fs.existsSync(`${__dirname}/${importPath}`)) {
        return
    }

    return import(`${__dirname}/${importPath}`)
}
