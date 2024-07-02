#!/usr/bin/env -S npx tsx
import fs from 'fs'

import { b, e, purple } from './__coloredConsole'
import { SkyConfig } from './__loadSkyConfig'

export namespace init {
    tsconfig()

    export function tsconfig(): void {
        const skyConfigJson: SkyConfig = fs.existsSync('sky.config.json')
            ? JSON.parse(fs.readFileSync('sky.config.json', 'utf-8'))
            : {
                  apps: [],
                  modules: [],
                  scripts: {},
              }

        skyConfigJson.apps ??= []
        skyConfigJson.modules ??= []
        skyConfigJson.scripts ??= {}

        process.stdout.write(`${b}${purple}Rewrite sky.config.json${e}`)
        fs.writeFileSync('sky.config.json', JSON.stringify(skyConfigJson, null, '    '), 'utf-8')
        process.stdout.write(` 👌\n`)
    }
}
