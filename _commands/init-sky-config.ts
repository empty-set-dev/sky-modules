#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'
import path from 'path'

import { Console.log, magenta, bright, reset } from '../utilities/Console

import __sdkPath from './__skyPath'

initSkyConfig()

function initSkyConfig(): void {
    if (fs.existsSync('sky.config.ts')) {
        Console.log('sky.config.ts already exists')
        return
    }

    process.stdout.write(`${magenta}${bright}Add sky.config.ts${reset}`)
    fs.copyFileSync(path.join(__sdkPath, '_commands/configs/sky.config.ts'), 'sky.config.ts')
    process.stdout.write(` 👌\n`)
}
