import fs from 'fs'
import path from 'path'

import { green, bright, reset } from './utilities/Console'
import loadSkyConfig from './utilities/loadSkyConfig'
import skyPath from './utilities/skyPath'

export default async function initPackages(): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    process.stdout.write(`${green}${bright}Copy files${reset}`)

    if (skyPath !== '.' && !fs.existsSync('.dev')) {
        fs.mkdirSync('.dev')
    }

    if (!fs.existsSync('README.md')) {
        fs.copyFileSync(path.join(skyPath, 'cli/workspace-assets/README.md'), 'README.md')
    }

    fs.copyFileSync(path.join(skyPath, 'cli/workspace-assets/.editorconfig'), '.editorconfig')
    fs.copyFileSync(path.join(skyPath, 'cli/workspace-assets/eslint-config.ts'), 'eslint.config.ts')
    fs.copyFileSync(
        path.join(skyPath, 'cli/workspace-assets/prettier.config.js'),
        'prettier.config.js'
    )

    if (skyPath !== '.') {
        fs.copyFileSync(
            path.join(skyPath, 'cli/workspace-assets/init-sky.mts'),
            '.dev/init-sky.mts'
        )
    }

    process.stdout.write(` 👌\n`)
}
