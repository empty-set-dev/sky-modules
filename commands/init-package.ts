#!/usr/bin/env tsx
import fs from 'fs'

import { b, e, purple } from './__coloredConsole'

export namespace init {
    package_()

    export function package_(): void {
        const packageJson = fs.existsSync('package.json')
            ? JSON.parse(fs.readFileSync('package.json', 'utf-8'))
            : {}

        process.stdout.write(`${b}${purple}Rewrite package.json${e}`)
        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '    '), 'utf-8')
        process.stdout.write(` 👌\n`)
    }
}
