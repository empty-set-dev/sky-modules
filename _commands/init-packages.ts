#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { logConsole } from '../helpers/console'
import { magenta, bright, reset } from '../helpers/console'

import __loadSkyConfig from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__sdkPath'

const installPackages = `pnpm i \
react@19.0.0 \
react-dom@19.0.0 \
telefunc@0.1.85\
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
vike@0.4.223 \
@types/react@19.0.0 \
@types/react-dom@19.0.0 \
@types/node\
`

export namespace init {
    packages()

    export async function packages(): Promise<void> {
        const skyConfig = await __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        process.stdout.write(`${magenta}${bright}Install packages${reset}\n`)
        logConsole(installPackages)
        __run(installPackages)
        logConsole(installDevPackages)
        __run(installDevPackages)
        process.stdout.write(`\n${magenta}${bright}Install packages${reset} 👌\n`)
        process.stdout.write(`${magenta}${bright}Copy files${reset}`)
        fs.copyFileSync(path.join(__sdkPath, '_commands/configs/.editorconfig'), '.editorconfig')
        fs.copyFileSync(
            path.join(__sdkPath, '_commands/configs/eslint.config.js'),
            'eslint.config.js'
        )
        fs.copyFileSync(
            path.join(__sdkPath, '_commands/configs/prettier.config.js'),
            'prettier.config.js'
        )
        fs.copyFileSync(path.join(__sdkPath, '_commands/configs/deploy.ts'), 'deploy.ts')

        if (Object.keys(skyConfig.modules).length > 0) {
            fs.copyFileSync(
                path.join(__sdkPath, '_commands/configs/jest.config.js'),
                'jest.config.js'
            )
        }

        fs.copyFileSync(
            path.join(__sdkPath, '_commands/configs/postcss.config.js'),
            'postcss.config.js'
        )
        fs.copyFileSync(
            path.join(__sdkPath, '_commands/configs/tailwind.config.js'),
            'tailwind.config.js'
        )
        process.stdout.write(` 👌\n`)
    }
}
