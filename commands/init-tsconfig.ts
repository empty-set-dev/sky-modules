#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'

import { b, e, purple } from './__coloredConsole'
import __sdkPath from './__sdkPath'

export namespace init {
    tsconfig()

    export function tsconfig(): void {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8')) as {
            apps?: string[]
            modules?: string[]
        }

        const paths = [
            ...(packageJson.modules ?? []).map(dep => `${dep}/*`),
            path.join(__sdkPath, '*'),
            path.join(__sdkPath, 'node_modules/*'),
        ]

        const include = packageJson.apps ?? []

        const exclude = [
            'node_modules',
            ...(packageJson.modules ?? []).map(dep => `${dep}/node_modules`),
            path.join(__sdkPath, 'node_modules'),
        ]

        const tsConfig = {
            compilerOptions: {
                lib: ['ES2021', 'DOM'],
                jsx: 'react-jsx',
                module: 'ES2022',
                target: 'ES2017',
                moduleResolution: 'node',
                esModuleInterop: true,
                typeRoots: [path.join(__sdkPath, 'node_modules/@types')],
                baseUrl: '.',
                paths: {
                    '*': [paths],
                    ...(packageJson.modules ?? []).reduce((prevValue, curValue) => {
                        prevValue[`${curValue}/*`] = `${curValue}/*`
                        return prevValue
                    }, {}),
                },
            },
            include,
            exclude,
        }

        process.stdout.write(`${b}${purple}rewrite configs${e}`)
        fs.writeFileSync(path.resolve('tsconfig.json'), JSON.stringify(tsConfig))
        process.stdout.write(` 👌\n`)
    }
}
