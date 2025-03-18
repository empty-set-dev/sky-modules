#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { logConsole, magenta, bright, reset } from '../helpers/console'

import __sdkPath from './__sdkPath'

initSkyConfig()

function initSkyConfig(): void {
    if (fs.existsSync('sky.config.ts')) {
        logConsole('sky.config.ts already exists')
        return
    }

    process.stdout.write(`${magenta}${bright}Add sky.config.ts${reset}`)
    fs.copyFileSync(path.join(__sdkPath, '_commands/configs/sky.config.ts'), 'sky.config.ts')
    process.stdout.write(` 👌\n`)
}
