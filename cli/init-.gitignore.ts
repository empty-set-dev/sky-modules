import fs from 'fs'
import path from 'path'

import cliPath from './utilities/cliPath'
import Console, { green, bright, reset } from './utilities/Console'

export default function initGitIgnore(): void {
    if (fs.existsSync('.gitignore')) {
        Console.log('.gitignore already exists')
        return
    }

    process.stdout.write(`${green}${bright}Init .gitignore${reset}`)
    fs.copyFileSync(path.join(cliPath, 'workspace-assets/.gitignore'), '.gitignore')

    process.stdout.write(` 👌\n`)
}
