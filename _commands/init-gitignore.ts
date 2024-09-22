#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import args from 'args'

import { b, e, purple } from './_coloredConsole'
import __sdkPath from './_sdkPath'

args.parse(process.argv, {
    name: 'sky init gitignore',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace init {
    gitignore()

    export function gitignore(): void {
        process.stdout.write(`${b}${purple}Copy files${e}`)
        fs.copyFileSync(path.join(__sdkPath, '_commands/configs/.gitignore'), '.gitignore')
        process.stdout.write(` 👌\n`)
    }
}
