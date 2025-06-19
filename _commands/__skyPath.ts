import path from 'path'

import getScriptPath from '../utilities/getScriptPath'

const scriptPath = getScriptPath(import.meta.url)
let __skyPath = path.relative(process.cwd(), path.join(scriptPath, '../'))

if (__skyPath === '') {
    __skyPath = '.'
}

export default __skyPath
