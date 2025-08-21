#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'
import path from 'path'

import Console, { magenta, bright, reset } from '../utilities/Console'

import skyPath from './lib/skyPath'

initSkyConfig()

function initSkyConfig(): void {
    if (fs.existsSync('sky.config.ts')) {
        Console.log('sky.config.ts already exists')
        return
    }

    process.stdout.write(`${magenta}${bright}Add sky.config.ts${reset}`)
    fs.copyFileSync(path.join(skyPath, '_commands/configs/sky.config.ts'), 'sky.config.ts')
    process.stdout.write(` 👌\n`)
}
