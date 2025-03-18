#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import args from 'args'

import { magenta, bright, reset } from '../helpers/console'

import __sdkPath from './__sdkPath'

args.parse(process.argv, {
    name: 'sky init gitignore',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace init {
    gitignore()

    export function gitignore(): void {
        if (fs.existsSync('.gitignore')) {
            return
        }

        process.stdout.write(`${magenta}${bright}Copy files${reset}`)
        fs.copyFileSync(path.join(__sdkPath, '_commands/configs/.gitignore'), '.gitignore')

        if (__sdkPath !== '.') {
            const content = fs.readFileSync('.gitignore')
            fs.writeFileSync('.gitignore', `${content}\npackage.json\n`, 'utf-8')
        }

        process.stdout.write(` 👌\n`)
    }
}
