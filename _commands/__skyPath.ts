import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

let __skyPath = path.relative(process.cwd(), path.resolve(__dirname, '../'))

if (__skyPath === '') {
    __skyPath = '.'
}

export default __skyPath
