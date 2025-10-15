import fs from 'fs'
import path from 'path'

import cliPath from './utilities/cliPath'
import { green, bright, reset } from './utilities/Console'
import loadSkyConfig from './utilities/loadSkyConfig'

export default async function initConfigs(): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    process.stdout.write(`${green}${bright}Copy files${reset}`)

    fs.mkdirSync('.dev')

    if (!fs.existsSync('README.md')) {
        fs.copyFileSync(path.join(cliPath, 'workspace-assets/README.md'), 'README.md')
    }

    fs.copyFileSync(path.join(cliPath, 'workspace-assets/.editorconfig'), '.editorconfig')
    fs.copyFileSync(path.join(cliPath, 'workspace-assets/eslint-config.ts'), 'eslint.config.ts')
    fs.copyFileSync(path.join(cliPath, 'workspace-assets/prettier.config.js'), 'prettier.config.js')

    process.stdout.write(` 👌\n`)
}
