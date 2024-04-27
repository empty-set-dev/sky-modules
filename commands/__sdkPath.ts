import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const __sdkPath = path.relative(process.cwd(), path.resolve(__dirname, '../'))

export default __sdkPath
