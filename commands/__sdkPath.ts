import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let __sdkPath = path.relative(process.cwd(), path.resolve(__dirname, '../'))
if (__sdkPath === '') {
    __sdkPath = '.'
}

export default __sdkPath
