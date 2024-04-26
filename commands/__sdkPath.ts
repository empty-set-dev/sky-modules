import path from 'path'

const __sdkPath = path.relative(process.cwd(), path.resolve(__dirname, '../'))

export default __sdkPath
