#!/usr/bin/env -S npx tsx
import fs from 'fs'

import { b, e, purple } from './__coloredConsole'

export namespace init {
    tsconfig()

    export function tsconfig(): void {
        const skyConfigJson = fs.existsSync('sky.config.json')
            ? JSON.parse(fs.readFileSync('sky.config.json', 'utf-8'))
            : {
                  apps: [],
                  tests: [],
                  modules: [],
                  libs: [],
                  scripts: {},
              }

        skyConfigJson.apps ??= []
        skyConfigJson.tests ??= []
        skyConfigJson.modules ??= []
        skyConfigJson.libs ??= []
        skyConfigJson.scripts ??= {}

        process.stdout.write(`${b}${purple}Rewrite sky.config.json${e}`)
        fs.writeFileSync('sky.config.json', JSON.stringify(skyConfigJson, null, '    '), 'utf-8')
        process.stdout.write(` 👌\n`)
    }
}
