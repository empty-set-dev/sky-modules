#!/usr/bin/env -S pnpm exec bun
import fs from 'fs'
import path from 'path'

import Console, { green, bright, reset } from '../utilities/Console'

import skyPath from './lib/skyPath'

export default function initGitIgnore(): void {
    if (fs.existsSync('.gitignore')) {
        Console.log('.gitignore already exists')
        return
    }

    process.stdout.write(`${green}${bright}Init .gitignore${reset}`)
    fs.copyFileSync(path.join(skyPath, '_commands/configs/.gitignore'), '.gitignore')

    if (skyPath !== '.') {
        const content = fs.readFileSync('.gitignore')
        fs.writeFileSync('.gitignore', `${content}\npackage.json\n`, 'utf-8')
    }

    process.stdout.write(` 👌\n`)
}
