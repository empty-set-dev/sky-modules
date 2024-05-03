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

        if (!skyConfig) {
            return
        }

        const allModulePaths = [
            ...(skyConfig.apps ?? []).map(app => path.dirname(app.entry)),
            ...(skyConfig.modules ?? []).map(module => module.path),
        ]
        const modulePaths = [...(skyConfig.modules ?? []).map(module => module.path)]

        const paths = [
            ...modulePaths.map(modulePath => path.join(modulePath, 'node_modules/*')),
            path.join(__sdkPath, '*'),
            path.join(__sdkPath, 'node_modules/*'),
        ]

        const include = allModulePaths

        const exclude = [
            'node_modules',
            ...modulePaths.map(modulePath => `${modulePath}/node_modules`),
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
                experimentalDecorators: true,
                typeRoots: [path.join(__sdkPath, 'node_modules/@types')],
                baseUrl: '.',
                paths: {
                    '*': paths,
                    ...allModulePaths.reduce((prevValue, curValue) => {
                        prevValue[`${curValue}/*`] = [`${curValue}/*`]
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
