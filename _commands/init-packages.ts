#!/usr/bin/env -S npx tsx
/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'

import { purple, bright, reset } from 'sky/helpers/console'

import __loadSkyConfig from './__loadSkyConfig'
import __run from './__run'
import __sdkPath from './__sdkPath'

const installPackages = `npm i \
react \
react-dom\
`

const installDevPackages = `npm i -D \
eslint eslint-config-prettier \
eslint-plugin-prettier \
eslint-plugin-react \
eslint-plugin-react-hooks \
eslint-plugin-import \
@typescript-eslint/eslint-plugin \
@typescript-eslint/parser \
prettier \
vike \
tsx\
`

export namespace init {
    packages()

    export async function packages(): Promise<void> {
        const skyConfig = await __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        process.stdout.write(`${purple}${bright}Install packages${reset}\n`)
        console.log(installPackages)
        __run(installPackages)
        console.log(installDevPackages)
        __run(installDevPackages)
        process.stdout.write(`\n${purple}${bright}Install packages${reset} 👌\n`)
        process.stdout.write(`${purple}${bright}Copy files${reset}`)
        fs.copyFileSync(path.join(__sdkPath, '_commands/configs/.editorconfig'), '.editorconfig')
        fs.copyFileSync(path.join(__sdkPath, '_commands/configs/.eslintrc.cjs'), '.eslintrc.cjs')
        fs.copyFileSync(
            path.join(__sdkPath, '_commands/configs/.prettierrc.cjs'),
            '.prettierrc.cjs'
        )
        fs.copyFileSync(path.join(__sdkPath, '_commands/configs/deploy.ts'), 'deploy.ts')

        if (Object.keys(skyConfig.modules).length > 0) {
            fs.copyFileSync(
                path.join(__sdkPath, '_commands/configs/jest.config.cjs'),
                'jest.config.cjs'
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
