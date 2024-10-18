#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { magenta, bright, reset } from 'sky/helpers/console'

import __sdkPath from './__sdkPath'

export namespace init {
    tsconfig()

    export function tsconfig(): void {
        if (fs.existsSync('sky.config.ts')) {
            return
        }

        process.stdout.write(`${magenta}${bright}Add sky.config.ts${reset}`)
        fs.copyFileSync(path.join(__sdkPath, '_commands/configs/sky.config.ts'), 'sky.config.ts')
        process.stdout.write(` 👌\n`)
    }
}
