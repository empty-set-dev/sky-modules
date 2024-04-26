#!/usr/bin/env tsx
import fs from 'fs'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace init {
    package_()

    export function package_(): void {
        const packageJson = fs.existsSync('package.json')
            ? (JSON.parse(fs.readFileSync('package.json', 'utf-8')) as {
                  apps?: string[]
                  modules?: string[]
              })
            : {}

        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '    '), 'utf-8')
    }
}
