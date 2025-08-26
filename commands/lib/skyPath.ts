import path from 'path'

import getScriptPath from 'sky/utilities/getScriptPath'

const scriptPath = getScriptPath(import.meta.url)
let skyPath = path.relative(process.cwd(), path.join(scriptPath, '../../'))

if (skyPath === '') {
    skyPath = '.'
}

export default skyPath
