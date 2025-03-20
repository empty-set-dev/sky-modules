#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { logConsole, magenta, bright, reset } from '../helpers/console'

import __sdkPath from './__sdkPath'

initGitIgnore()

function initGitIgnore(): void {
    if (fs.existsSync('.gitignore')) {
        logConsole('.gitignore already exists')
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
