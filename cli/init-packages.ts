import fs from 'fs'
import path from 'path'

import Console, { green, bright, reset } from './utilities/Console'
import loadSkyConfig from './utilities/loadSkyConfig'
import run from './utilities/run'
import skyPath from './utilities/skyPath'

// const installDevPackages = `pnpm i -D \
// eslint \
// @eslint/js \
// globals \
// eslint-config-prettier \
// eslint-plugin-prettier \
// eslint-plugin-react \
// eslint-plugin-react-hooks \
// eslint-plugin-import \
// @typescript-eslint/eslint-plugin \
// @typescript-eslint/parser \
// prettier\
// `

export default async function initPackages(): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    // process.stdout.write(`${green}${bright}Install packages${reset}\n`)
    // Console.log(installPackages)
    // await run(installPackages)
    // Console.log(installDevPackages)
    // await run(installDevPackages)
    // process.stdout.write(`\n${green}${bright}Install packages${reset} 👌\n`)

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
