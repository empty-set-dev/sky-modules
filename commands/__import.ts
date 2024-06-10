import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default function __import(importPath: string): undefined | Promise<unknown> {
    if (!fs.existsSync(`${__dirname}/${importPath}`)) {
        return
    }

    return import(`${__dirname}/${importPath}`)
}
