import fs from 'fs'
import path from 'path'

import SkyApp from 'sky/configuration/SkyApp'
import SkyConfig from 'sky/configuration/SkyConfig'
import SkyModule from 'sky/configuration/SkyModule'
import { bright, green, reset } from 'sky/utilities/Console'

import loadSkyConfig from './lib/loadSkyConfig'
import skyPath from './lib/skyPath'

export default async function initTsConfigs(): Promise<void> {
    let externalModules: undefined | Record<string, string>

    if (fs.existsSync('.dev/external-modules.json')) {
        externalModules = JSON.parse(fs.readFileSync('.dev/external-modules.json', 'utf-8'))
    }

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

        initTsConfig(skyConfig.modules[name], true, skyConfig, externalModules)
    })
    Object.keys(skyConfig.examples).map(name =>
        initTsConfig(skyConfig.examples[name], false, skyConfig)
    )
    Object.keys(skyConfig.apps).map(name => initTsConfig(skyConfig.apps[name], false, skyConfig))
}

function initTsConfig(
    module: SkyModule | SkyApp,
    isModule: boolean,
    skyConfig: SkyConfig,
    externalModules?: null | Record<string, string>
): void {
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
                ? path.relative(module.path, path.join(skyPath, 'commands/assets/web-initial'))
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

    if (externalModules != null) {
        Object.keys(externalModules).forEach(k => {
            tsConfig.include.push(path.relative(module.path, externalModules[k]))
        })
    }

    modulesAndAppsPaths.forEach(({ name, path }) => {
        tsConfig.compilerOptions.paths[`${name}/*`] ??= []
        tsConfig.compilerOptions.paths[`${name}/*`].push(path === '' ? './*' : `${path}/*`)
    })

    process.stdout.write(
        `${green}${bright}Update config ${path.join(module.path, 'tsconfig.json')}${reset}`
    )
    fs.writeFileSync(
        path.resolve(module.path, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, '    ')
    )
    process.stdout.write(` 👌\n`)
}
