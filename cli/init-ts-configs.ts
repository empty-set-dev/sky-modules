import 'sky/configuration/Sky.App.global'
import 'sky/configuration/Sky.Config.global'
import 'sky/configuration/Sky.Module.global'
import fs from 'fs'
import path from 'path'

import { bright, green, reset } from './lib/Console'
import loadSkyConfig from './lib/loadSkyConfig'
import skyPath from './lib/skyPath'

function getJsxConfig(module: Sky.Module | Sky.App): { jsx: string; jsxImportSource?: string } {
    const jsxFramework = (module as Sky.App).jsx

    switch (jsxFramework) {
        case 'react':
            return { jsx: 'react-jsx' }
        case 'solid':
            return { jsx: 'preserve', jsxImportSource: 'solid-js' }
        case 'svelte':
            return { jsx: 'preserve' }
        case 'vue':
            return { jsx: 'preserve' }
        case 'qwik':
            return { jsx: 'preserve', jsxImportSource: '@builder.io/qwik' }
        default:
            return { jsx: 'react-jsx' } // дефолт для модулей и неопределенных случаев
    }
}

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
        if (skyConfig.modules[name].path.match('node_modules') != null) {
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
    module: Sky.Module | Sky.App,
    isModule: boolean,
    skyConfig: Sky.Config,
    externalModules?: null | Record<string, string>
): void {
    const modulesAndAppsPaths = [
        {
            name: 'pkgs',
            path: [
                ...new Set(
                    Object.keys(skyConfig.modules).map(name =>
                        path.relative(module.path, path.join(skyConfig.modules[name].path, 'pkgs'))
                    )
                ).values(),
            ],
        },
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
                ? path.relative(module.path, path.join(skyPath, 'boilerplates/web-boilerplate'))
                : '.',
        },
        ...Object.keys(skyConfig.apps).map(name => ({
            name,
            path: path.relative(module.path, skyConfig.apps[name].path),
        })),
    ]

    function hasPublic(module: unknown): module is { public: string } {
        return typeof (<Partial<{ public?: string }>>module).public === 'string'
    }

    if (hasPublic(module)) {
        modulesAndAppsPaths.push({
            name: '@',
            path: path.relative(module.path, module.public),
        })
    }

    let relativeSkyPath = path.relative(module.path, process.cwd())

    if (relativeSkyPath === '') {
        relativeSkyPath = '.'
    }

    const jsxConfig = getJsxConfig(module)

    const tsConfig = {
        compilerOptions: {
            noEmit: true,
            strict: true,
            alwaysStrict: true,
            exactOptionalPropertyTypes: true,
            noFallthroughCasesInSwitch: true,
            noImplicitAny: true,
            noImplicitReturns: true,
            noImplicitThis: true,
            lib: ['es2022', 'DOM'],
            jsx: jsxConfig.jsx,
            ...(jsxConfig.jsxImportSource && { jsxImportSource: jsxConfig.jsxImportSource }),
            module: 'esnext',
            target: 'es2017',
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
                ? [path.join(relativeSkyPath, '.sky/sky.config.ts'), relativeSkyPath]
                : [
                      path.relative(module.path, '.sky/sky.config.ts'),
                      ...modulesAndAppsPaths.map(({ path }) => (path === '' ? '.' : `${path}`)),
                  ],

        exclude: [
            '.dev',
            ...(skyPath === '.'
                ? [path.join(relativeSkyPath, 'node_modules')]
                : [
                      ...Object.keys(skyConfig.modules).map(name =>
                          path.relative(
                              module.path,
                              path.join(skyConfig.modules[name].path, 'node_modules')
                          )
                      ),
                      path.relative(module.path, path.join(process.cwd(), 'node_modules')),
                  ]),
        ],
    }

    if (externalModules != null) {
        Object.keys(externalModules).forEach(k => {
            tsConfig.include.push(path.relative(module.path, externalModules[k]))
        })
    }

    modulesAndAppsPaths.forEach(({ name, path: modulePath }) => {
        tsConfig.compilerOptions.paths[`${name}/*`] ??= []
        const paths = tsConfig.compilerOptions.paths[`${name}/*`]
        if (Array.isArray(modulePath)) {
            modulePath.forEach(modulePath =>
                paths.push(modulePath === '' ? './*' : `${modulePath}/*`)
            )
        } else {
            paths.push(modulePath === '' ? './*' : `${modulePath}/*`)
        }
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
