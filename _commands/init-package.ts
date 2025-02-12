#!/usr/bin/env -S npx tsx
import fs from 'fs'

import { magenta, bright, reset } from '../helpers/console'

import __loadSkyConfig, { SkyApp } from './__loadSkyConfig'

export namespace init {
    const nodeCommands = ['dev', 'start']
    const tauriCommands = ['init', 'dev', 'build', 'start']
    const mobileCommands = [
        'mobile init',
        'ios dev',
        'android dev',
        'ios build',
        'android build',
        'ios start',
        'android start',
    ]
    const webCommands = ['dev', 'build', 'preview', 'start']

    package_()

    export async function package_(): Promise<void> {
        const skyConfig = await __loadSkyConfig()

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

        packageJson.scripts = { ...(skyConfig.scripts as Record<string, string>) }

        if (Object.keys(skyConfig.apps).length > 0) {
            Object.keys(skyConfig.apps).forEach(name => {
                const app: SkyApp = skyConfig.apps[name]
                if (app.target === 'node') {
                    nodeCommands.forEach(
                        command =>
                            (packageJson.scripts[`${name}:node:${command}`] =
                                `sky node ${command} ${name}`)
                    )
                }

                if (
                    app.target === 'native' ||
                    app.target === 'universal' ||
                    app.target === 'desktop'
                ) {
                    tauriCommands.forEach(
                        command =>
                            (packageJson.scripts[`${name}:desktop:${command}`] =
                                `sky desktop ${command} ${name}`)
                    )
                }

                if (
                    app.target === 'native' ||
                    app.target === 'universal' ||
                    app.target === 'mobile'
                ) {
                    mobileCommands.forEach(
                        command =>
                            (packageJson.scripts[`${name}:${command.replaceAll(' ', ':')}`] =
                                `sky ${command} ${name}`)
                    )
                }

                if (app.target === 'universal') {
                    webCommands.forEach(
                        command =>
                            (packageJson.scripts[`${name}:web:${command}`] =
                                `sky web ${command} ${name}`)
                    )
                }

                if (app.target === 'web') {
                    webCommands.forEach(
                        command =>
                            (packageJson.scripts[`${name}:web:${command}`] =
                                `sky web ${command} ${name}`)
                    )
                }
            })

            packageJson.scripts['format'] = 'sky format'
            packageJson.scripts['test'] = 'sky test'
        } else {
            delete packageJson.scripts
        }

        process.stdout.write(`${magenta}${bright}Rewrite package.json${reset}`)
        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '    '), 'utf-8')
        process.stdout.write(` 👌\n`)
    }
}
