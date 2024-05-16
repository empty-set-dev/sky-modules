#!/usr/bin/env -S npx tsx
import fs from 'fs'

import { b, e, purple } from './__coloredConsole'
import __loadSkyConfig from './__loadSkyConfig'

export namespace init {
    const browserCommands = ['dev', 'build', 'start']
    const nodeCommands = ['dev', 'build', 'start']
    const tauriCommands = ['init', 'dev', 'build', 'start']

    package_()

    export function package_(): void {
        const skyConfig = __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        const packageJson = fs.existsSync('package.json')
            ? JSON.parse(fs.readFileSync('package.json', 'utf-8'))
            : {}

        packageJson.type = 'module'
        packageJson.browserslist ??= {
            production: ['>0.2%', 'not dead', 'not op_mini all'],
            development: [
                'last 1 chrome version',
                'last 1 firefox version',
                'last 1 safari version',
                'last 1 ie version',
            ],
        }

        if (skyConfig.scripts === false) {
            delete packageJson.scripts
        } else {
            packageJson.scripts = { ...(skyConfig.scripts as Record<string, string>) }
            skyConfig.apps.forEach(app => {
                if (app.scripts === false) {
                    return
                }

                if (app.target === 'node') {
                    nodeCommands.forEach(
                        command =>
                            (packageJson.scripts[
                                `${app.name}:node:${command}`
                            ] = `sky node ${command} ${app.name}`)
                    )
                }

                if (
                    app.target === 'native' ||
                    app.target === 'universal' ||
                    app.target === 'desktop'
                ) {
                    tauriCommands.forEach(
                        command =>
                            (packageJson.scripts[
                                `${app.name}:tauri:${command}`
                            ] = `sky tauri ${command} ${app.name}`)
                    )
                }

                if (app.target === 'universal' || app.target === 'browser') {
                    browserCommands.forEach(
                        command =>
                            (packageJson.scripts[
                                `${app.name}:browser:${command}`
                            ] = `sky browser ${command} ${app.name}`)
                    )
                }
            })
            packageJson.scripts['format'] = 'sky format'
        }

        process.stdout.write(`${b}${purple}Rewrite package.json${e}`)
        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '    '), 'utf-8')
        process.stdout.write(` 👌\n`)
    }
}
