#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { b, e, purple } from './__coloredConsole'
import __sdkPath from './__sdkPath'

export namespace init {
    tsconfig()

    export function tsconfig(): void {
        if (fs.existsSync('sky.config.ts')) {
            return
        }

        process.stdout.write(`${b}${purple}Add sky.config.ts${e}`)
        fs.copyFileSync(path.join(__sdkPath, 'commands/configs/sky.config.ts'), 'sky.config.ts')
        process.stdout.write(` 👌\n`)
    }
}
