#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { b, e, purple } from './__coloredConsole'
import __loadSkyConfig from './__loadSkyConfig'
import __sdkPath from './__sdkPath'

export namespace init {
    tsconfig()

    export function tsconfig(): void {
        const skyConfig = __loadSkyConfig()

        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8')) as {
            apps?: string[]
            modules?: string[]
        }

        const paths = [
            ...(skyConfig.apps ?? []).map(app => path.dirname(app.entry) + '/*'),
            ...(skyConfig.tests ?? []).map(app => path.dirname(app.entry) + '/*'),
            path.join(__sdkPath, '*'),
            path.join(__sdkPath, 'node_modules/*'),
        ]

        const include = packageJson.apps ?? []

        const exclude = [
            'node_modules',
            ...(packageJson.modules ?? []).map(dep => `${dep}/node_modules`),
        ]

        const sdkNodeModulesPath = path.join(__sdkPath, 'node_modules')
        if (sdkNodeModulesPath !== 'node_modules') {
            exclude.push(sdkNodeModulesPath)
        }

        const tsConfig = {
            compilerOptions: {
                lib: ['ES2021', 'DOM'],
                jsx: 'react-jsx',
                module: 'ES2022',
                target: 'ES2017',
                moduleResolution: 'node',
                esModuleInterop: true,
                resolveJsonModule: true,
                typeRoots: [path.join(__sdkPath, 'node_modules/@types')],
                baseUrl: '.',
                paths: {
                    '*': paths,
                    ...(packageJson.modules ?? []).reduce((prevValue, curValue) => {
                        prevValue[`${curValue}/*`] = `${curValue}/*`
                        return prevValue
                    }, {}),
                },
            },
        }

        if (include.length > 0) {
            tsConfig['include'] = include
        }

        if (exclude.length > 0) {
            tsConfig['exclude'] = exclude
        }

        process.stdout.write(`${b}${purple}Rewrite configs${e}`)
        fs.writeFileSync(path.resolve('tsconfig.json'), JSON.stringify(tsConfig, null, '    '))
        process.stdout.write(` 👌\n`)
    }
}
