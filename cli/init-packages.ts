import fs from 'fs'
import path from 'path'

import Console, { green, bright, reset } from './utilities/Console'
import loadSkyConfig from './utilities/loadSkyConfig'
import run from './utilities/run'
import skyPath from './utilities/skyPath'

const installPackages = `pnpm i \
react@19.1.1 \
react-dom@19.1.1 \
telefunc@0.2.11 \
react-hook-form \
tsx\
`

const installDevPackages = `pnpm i -D \
eslint \
@eslint/js \
globals \
eslint-config-prettier \
eslint-plugin-prettier \
eslint-plugin-react \
eslint-plugin-react-hooks \
eslint-plugin-import \
@typescript-eslint/eslint-plugin \
@typescript-eslint/parser \
prettier \
vike@0.4.237 \
@types/react@19.1.1 \
@types/react-dom@19.1.1 \
@types/node\
`

export default async function initPackages(): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    process.stdout.write(`${green}${bright}Install packages${reset}\n`)
    Console.log(installPackages)
    await run(installPackages)
    Console.log(installDevPackages)
    await run(installDevPackages)
    process.stdout.write(`\n${green}${bright}Install packages${reset} 👌\n`)

    process.stdout.write(`${green}${bright}Copy files${reset}`)

    if (skyPath !== '.' && !fs.existsSync('.dev')) {
        fs.mkdirSync('.dev')
    }

    if (!fs.existsSync('README.md')) {
        fs.copyFileSync(path.join(skyPath, 'cli/configs/README.md'), 'README.md')
    }

    fs.copyFileSync(path.join(skyPath, 'cli/configs/.editorconfig'), '.editorconfig')
    fs.copyFileSync(path.join(skyPath, 'cli/configs/eslint-config.ts'), 'eslint.config.ts')
    fs.copyFileSync(path.join(skyPath, 'cli/configs/prettier.config.js'), 'prettier.config.js')

    if (skyPath !== '.') {
        fs.copyFileSync(path.join(skyPath, 'cli/configs/init-sky.mts'), '.dev/init-sky.mts')
    }

    process.stdout.write(` 👌\n`)
}
