#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'
import path from 'path'

import { bright, magenta, reset } from '../utilities/Console'

import loadSkyConfig from './lib/loadSkyConfig'
import SkyApp from './lib/SkyApp'
import SkyConfig from './lib/SkyConfig'
import SkyModule from './lib/SkyModule'
import skyPath from './lib/skyPath'

let modules: undefined | Record<string, string>

if (fs.existsSync('.dev/modules.json')) {
    modules = JSON.parse(fs.readFileSync('.dev/modules.json', 'utf-8'))
}

await initTsConfigs()

async function initTsConfigs(): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    Object.keys(skyConfig.modules).map(name => {
        if (skyConfig.modules[name].path.startsWith('node_modules')) {
            return
        }

        if (skyConfig.modules[name].path.startsWith('../')) {
            return
        }

        initTsConfig(skyConfig.modules[name], true, skyConfig)
    })
    Object.keys(skyConfig.examples).map(name =>
        initTsConfig(skyConfig.examples[name], false, skyConfig)
    )
    Object.keys(skyConfig.apps).map(name => initTsConfig(skyConfig.apps[name], false, skyConfig))
}

function initTsConfig(module: SkyModule | SkyApp, isModule: boolean, skyConfig: SkyConfig): void {
    const modulesAndAppsPaths = [
        ...[
            ...new Set(
                Object.keys(skyConfig.modules).map(name =>
                    path.relative(module.path, path.join(skyConfig.modules[name].path, 'pkgs'))
                )
            ).values(),
        ].map(pkgsPath => ({
            name: 'pkgs',
            path: pkgsPath,
        })),
        {
            name: 'defines',
            path: path.relative(module.path, '.dev/defines'),
        },
        ...Object.keys(skyConfig.modules).map(name => ({
            name,
            path: path.relative(module.path, skyConfig.modules[name].path),
        })),
        {
            name: '#',
            path: isModule
                ? path.relative(module.path, path.join(skyPath, '_commands/assets/web-initial'))
                : '.',
        },
        ...Object.keys(skyConfig.apps).map(name => ({
            name,
            path: path.relative(module.path, skyConfig.apps[name].path),
        })),
    ]

    if ((module as SkyApp).public) {
        modulesAndAppsPaths.push({
            name: 'public',
            path: path.relative(module.path, (module as SkyApp).public!),
        })
    }

    let relativeSkyPath = path.relative(module.path, process.cwd())

    if (relativeSkyPath === '') {
        relativeSkyPath = '.'
    }

    const tsConfig = {
        compilerOptions: {
            strict: true,
            lib: ['ES2021', 'DOM'],
            jsx: 'react-jsx',
            module: 'ES2022',
            target: 'ES2017',
            moduleResolution: 'bundler',
            esModuleInterop: true,
            resolveJsonModule: true,
            experimentalDecorators: true,
            typeRoots: Object.keys(skyConfig.modules).map(name =>
                path.relative(
                    module.path,
                    path.join(skyConfig.modules[name].path, 'node_modules/@types')
                )
            ),
            baseUrl: '.',
            paths: {} as Record<string, string[]>,
        },

        include:
            skyPath === '.'
                ? [relativeSkyPath]
                : [
                      path.relative(module.path, 'sky.config.ts'),
                      path.relative(module.path, 'deploy.ts'),
                      ...modulesAndAppsPaths.map(({ path }) => (path === '' ? '.' : `${path}`)),
                  ],

        exclude:
            skyPath === '.'
                ? [path.join(relativeSkyPath, 'node_modules')]
                : [
                      ...Object.keys(skyConfig.modules).map(name =>
                          path.relative(
                              module.path,
                              path.join(skyConfig.modules[name].path, 'node_modules')
                          )
                      ),
                      path.relative(module.path, path.join(process.cwd(), 'node_modules')),
                  ],
    }

    if (modules) {
        Object.keys(modules).forEach(k => {
            tsConfig.include.push(path.relative(module.path, modules[k]))
        })
    }

    modulesAndAppsPaths.forEach(({ name, path }) => {
        tsConfig.compilerOptions.paths[`${name}/*`] ??= []
        tsConfig.compilerOptions.paths[`${name}/*`].push(path === '' ? './*' : `${path}/*`)
    })

    process.stdout.write(
        `${magenta}${bright}Rewrite config ${path.join(module.path, 'tsconfig.json')}${reset}`
    )
    fs.writeFileSync(
        path.resolve(module.path, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, '    ')
    )
    process.stdout.write(` 👌\n`)
}
