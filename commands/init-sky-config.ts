#!/usr/bin/env -S pnpm exec bun
import fs from 'fs'
import path from 'path'

import Console, { green, bright, reset } from 'sky/utilities/Console'

import skyPath from './lib/skyPath'

export default function initSkyConfig(): void {
    if (fs.existsSync('sky.config.ts')) {
        Console.log('sky.config.ts already exists')
        return
    }

    process.stdout.write(`${green}${bright}Add sky.config.ts${reset}`)
    fs.copyFileSync(path.join(skyPath, '_commands/configs/sky.config.ts'), 'sky.config.ts')
    process.stdout.write(` 👌\n`)
}
