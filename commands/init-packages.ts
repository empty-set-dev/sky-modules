#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

import { b, e, purple } from './__coloredConsole'
import __run from './__run'
import __sdkPath from './__sdkPath'

const command = `npm i -D \
eslint eslint-config-prettier \
eslint-plugin-prettier \
eslint-plugin-react \
eslint-plugin-react-hooks \
@typescript-eslint/eslint-plugin \
@typescript-eslint/parser \
prettier \
tsx\
`

export namespace init {
    packages()

    export function packages(): void {
        process.stdout.write(`${b}${purple}Install packages${e}\n`)
        __run(command)
        process.stdout.write(`\n${b}${purple}Install packages${e} 👌\n`)
        process.stdout.write(`${b}${purple}Copy files${e}`)
        fs.copyFileSync(path.join(__sdkPath, 'configs/.editorconfig'), '.editorconfig')
        fs.copyFileSync(path.join(__sdkPath, 'configs/.eslintrc.cjs'), '.eslintrc.cjs')
        fs.copyFileSync(path.join(__sdkPath, 'configs/.prettierrc.cjs'), '.prettierrc.cjs')
        process.stdout.write(` 👌\n`)
    }
}
