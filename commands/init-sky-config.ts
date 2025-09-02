import fs, { mkdirSync } from 'fs'
import path from 'path'

import Console, { green, bright, reset } from './lib/Console'
import skyPath from './lib/skyPath'

export default function initSkyConfig(): void {
    if (fs.existsSync('.sky/sky.config.ts')) {
        Console.log('sky.config.ts already exists')
        return
    }

    process.stdout.write(`${green}${bright}Add sky.config.ts${reset}`)
    mkdirSync('.sky')
    fs.copyFileSync(path.join(skyPath, 'commands/configs/sky.config.ts'), '.sky/sky.config.ts')
    process.stdout.write(` 👌\n`)
}
