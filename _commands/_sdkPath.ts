import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

let __sdkPath = path.relative(process.cwd(), path.resolve(__dirname, '../'))
if (__sdkPath === '') {
    __sdkPath = '.'
}

export default __sdkPath
