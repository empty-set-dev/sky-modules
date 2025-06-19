#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'

import SkyApp from 'sky/configuration/SkyApp'

import { magenta, bright, reset } from '../utilities/console'

import { nodeCommands, mobileCommands, tauriCommands, webCommands } from './__commands'
import __loadSkyConfig from './__loadSkyConfig'

initPackage()

async function initPackage(): Promise<void> {
    const skyConfig = await __loadSkyConfig()

    if (!skyConfig) {
        return
    }

    const packageJson = fs.existsSync('package.json')
        ? JSON.parse(fs.readFileSync('package.json', 'utf-8'))
        : {}

    packageJson.name = skyConfig.package
        ? skyConfig.package
        : skyConfig.name.replaceAll(' ', '-').toLocaleLowerCase()
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

            if (app.target === 'universal') {
                tauriCommands.forEach(
                    command =>
                        (packageJson.scripts[`${name}:desktop:${command}`] =
                            `sky desktop ${command} ${name}`)
                )
            }

            if (app.target === 'universal') {
                mobileCommands.forEach(
                    command =>
                        (packageJson.scripts[`${name}:${command.replaceAll(' ', ':')}`] =
                            `sky ${command} ${name}`)
                )
            }

            if (app.target === 'universal' || app.target === 'web') {
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
