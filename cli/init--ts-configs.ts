import '@sky-modules/cli/configuration/Sky.App.namespace'
import '@sky-modules/cli/configuration/Sky.Config.namespace'
import '@sky-modules/cli/configuration/Sky.Module.namespace'
import fs from 'fs'
import path from 'path'

import { bright, green, reset } from './utilities/Console'
import loadSkyConfig from './utilities/loadSkyConfig'

export default async function initTsConfigs(): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    const allProjectPaths: string[] = []

    for (const name of Object.keys(skyConfig.modules)) {
        const module = skyConfig.modules[name]

        if (isExternalModule(module.path)) {
            break
        }

        allProjectPaths.push(module.path)
        initTsConfig(module, skyConfig)
    }

    for (const name of Object.keys(skyConfig.playgrounds)) {
        const example = skyConfig.playgrounds[name]

        if (isExternalModule(example.path)) {
            break
        }

        allProjectPaths.push(example.path)
        initTsConfig(example, skyConfig)
    }

    initTsConfig(null, skyConfig)

    for (const name of Object.keys(skyConfig.apps)) {
        const app = skyConfig.playgrounds[name]

        if (isExternalModule(app.path)) {
            break
        }

        allProjectPaths.push(app.path)
        initTsConfig(app, skyConfig)
    }
}

function isExternalModule(modulePath: string): boolean {
    if (modulePath.match('node_modules') != null) {
        return true
    }

    if (modulePath.startsWith('../')) {
        return true
    }

    return false
}

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
        case 'angular':
            return { jsx: 'preserve' }
        case 'qwik':
            return { jsx: 'preserve', jsxImportSource: '@builder.io/qwik' }
        default:
            return { jsx: 'react-jsx' } // Default for modules and undefined cases
    }
}

function initTsConfig(module: Sky.Module | Sky.App | null, skyConfig: Sky.Config): void {
    function hasPublic(module: unknown): module is { public: string } {
        return typeof (<Partial<{ public?: string }>>module)?.public === 'string'
    }

    let relativeSkyPath = path.relative(module?.path ?? '.', process.cwd())

    if (relativeSkyPath === '') {
        relativeSkyPath = '.'
    }

    const jsxConfig = module != null ? getJsxConfig(module) : { jsx: 'react-jsx' }

    const tsConfig = {
        compilerOptions: {
            strict: true,
            alwaysStrict: true,
            exactOptionalPropertyTypes: true,
            noFallthroughCasesInSwitch: true,
            noImplicitAny: true,
            noImplicitReturns: true,
            noImplicitThis: true,
            lib: ['es2022', 'DOM'],
            types: [],
            jsx: jsxConfig.jsx,
            ...(jsxConfig.jsxImportSource && { jsxImportSource: jsxConfig.jsxImportSource }),
            module: 'esnext',
            target: 'es2018',
            moduleResolution: 'bundler',
            resolvePackageJsonImports: true,
            allowImportingTsExtensions: true,
            noEmit: true,
            esModuleInterop: true,
            resolveJsonModule: true,
            experimentalDecorators: true,
            incremental: true,
            tsBuildInfoFile: path.join('.dev/build', module?.id ?? '.', 'tsbuildinfo'),
            paths: {} as Record<string, string[]>,
        },

        include: ['.', './**/*.jsx', './**/*.tsx', './**/*.svelte', './**/*.vue', '.sky/**/*'],
        exclude: [
            '.dev',
            'playground',
            'dist',
            'node_modules',
            '**/*.spec.ts',
            '**/*.test.ts',
            '**/spec/**/*',
            '**/tests/**/*',
            '**/*.global.ts',
            '**/global.ts',
        ],
    }

    if (module) {
        const packageJson = {
            type: 'module',
            imports: {} as Record<string, string[]>,
        }

        const modulesAndAppsPaths = [
            {
                name: '#defines',
                path: path.relative(module.path, './.dev/defines/*'),
            },
            ...Object.keys(skyConfig.modules)
                .filter(name => !skyConfig.modules[name].package)
                .map(name => ({
                    name: '#' + name,
                    path: path.relative(module.path, skyConfig.modules[name].path + '/*'),
                })),
            {
                name: '#',
                path: './*',
            },
            {
                name: '#server',
                path: './server/*',
            },
            ...Object.keys(skyConfig.apps).map(name => ({
                name: '#' + name,
                path: path.relative(module.path, skyConfig.apps[name].path + '/*'),
            })),
        ]

        if (hasPublic(module)) {
            modulesAndAppsPaths.push({
                name: '#public',
                path: path.relative(module.path, module.public + '/*'),
            })
        }

        for (const module_ of Object.values(skyConfig.modules)) {
            if (!module_.package || module_.path === module.path) {
                continue
            }

            tsConfig.compilerOptions.paths[module_.package] = [
                path.relative(module.path, module_.path),
            ]
        }

        modulesAndAppsPaths.forEach(({ name, path: modulePath }) => {
            const paths = (packageJson.imports[`${name}/*`] ??= [])
            paths.push(modulePath)
            const tsConfigPaths = (tsConfig.compilerOptions.paths[`${name}/*`] ??= [])
            tsConfigPaths.push(modulePath)
        })

        packageJson.imports['#setup'] = ['./setup']
        tsConfig.compilerOptions.paths['#setup'] = ['./setup']

        tsConfig.compilerOptions.paths['~react-pages'] = ['./screens']

        process.stdout.write(
            `${green}${bright}Update config ${path.join(module?.path ?? '.', 'package.json')}${reset}`
        )
        fs.writeFileSync(
            path.resolve(module?.path ?? '.', 'package.json'),
            JSON.stringify(packageJson, null, '    ')
        )
        process.stdout.write(` 👌\n`)
    } else {
        tsConfig.compilerOptions.paths['#setup'] = [
            './node_modules/@sky-modules/cli/boilerplates/node-boilerplate/setup',
        ]
        tsConfig.compilerOptions.paths['#node/*'] = [
            './node_modules/@sky-modules/cli/boilerplates/node-boilerplate/*',
        ]
        tsConfig.compilerOptions.paths['#universal/*'] = [
            './node_modules/@sky-modules/cli/boilerplates/universal-boilerplate/*',
        ]
        tsConfig.compilerOptions.paths['#web/*'] = [
            './node_modules/@sky-modules/cli/boilerplates/web-boilerplate/*',
        ]
        tsConfig.compilerOptions.paths['public/*'] = [
            './node_modules/@sky-modules/cli/boilerplates/public/*',
        ]
        tsConfig.compilerOptions.paths['~react-pages'] = [
            './node_modules/@sky-modules/cli/boilerplates/universal-boilerplate/screens',
        ]
    }

    process.stdout.write(
        `${green}${bright}Update config ${path.join(module?.path ?? '.', 'tsconfig.json')}${reset}`
    )
    fs.writeFileSync(
        path.resolve(module?.path ?? '.', 'tsconfig.json'),
        JSON.stringify(tsConfig, null, '    ')
    )
    process.stdout.write(` 👌\n`)
}
