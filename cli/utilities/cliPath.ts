import path from 'path'
import { fileURLToPath } from 'url'

let cliPath = path.relative(
    process.cwd(),
    path.join(fileURLToPath(new URL('.', import.meta.url).toString()), '../')
)

if (cliPath === '') {
    cliPath = '.'
}

export default cliPath
