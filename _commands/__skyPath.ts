import path from 'path'

import getScriptPath from 'sky/utilities/getScriptPath'

const scriptPath = getScriptPath(import.meta.url)
const __skyPath = path.relative(process.cwd(), path.join(scriptPath, '../'))

export default __skyPath
