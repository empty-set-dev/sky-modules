import '@sky-modules/cli/configuration/Sky.App.global'
import '@sky-modules/cli/configuration/Sky.Config.global'
import '@sky-modules/cli/configuration/Sky.Module.global'
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

    for (const name of Object.keys(skyConfig.playground)) {
        const example = skyConfig.playground[name]

        if (isExternalModule(example.path)) {
            break
        }

        allProjectPaths.push(example.path)
        initTsConfig(example, skyConfig)
    }

    initTsConfig(null, skyConfig)

    for (const name of Object.keys(skyConfig.apps)) {
        const app = skyConfig.playground[name]

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
            return { jsx: 'react-jsx' } // дефолт для модулей и неопределенных случаев
    }
}

function initTsConfig(module: Sky.Module | Sky.App | null, skyConfig: Sky.Config): void {
    const rootDir = path.relative(module?.path ?? '.', '.')

    const modulesAndAppsPaths = [
        {
            name: 'defines',
            path: './.dev/defines/*',
        },
        ...Object.keys(skyConfig.modules).map(name => ({
            name,
            path: './' + skyConfig.modules[name].path + '/*',
        })),
        {
            name: '#',
            path: module?.path == null ? './*' : './' + (module?.path ?? '') + '/*',
        },
        ...Object.keys(skyConfig.apps).map(name => ({
            name,
            path: './' + skyConfig.apps[name].path + '/*',
        })),
    ]

    function hasPublic(module: unknown): module is { public: string } {
        return typeof (<Partial<{ public?: string }>>module)?.public === 'string'
    }

    if (hasPublic(module)) {
        modulesAndAppsPaths.push({
            name: '@',
            path: './' + module.public + '/*',
        })
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
            jsx: jsxConfig.jsx,
            ...(jsxConfig.jsxImportSource && { jsxImportSource: jsxConfig.jsxImportSource }),
            module: 'esnext',
            target: 'es2018',
            moduleResolution: 'bundler',
            esModuleInterop: true,
            resolveJsonModule: true,
            experimentalDecorators: true,
            tsBuildInfoFile: path.join('.dev/build', module?.id ?? '.', 'tsbuildinfo'),
            rootDir: rootDir || '.',
            ...(module ? { baseUrl: rootDir || '.' } : null),
            paths: {} as Record<string, string[]>,
        },

        include: ['.', './**/*.jsx', './**/*.tsx', './**/*.svelte', './**/*.vue', '.sky/**/*'],
        exclude: ['.dev', 'playground', 'boilerplates', 'dist', 'node_modules'],
    }

    modulesAndAppsPaths.forEach(({ name, path: modulePath }) => {
        const paths = (tsConfig.compilerOptions.paths[`${name}/*`] ??= [])

        if (Array.isArray(modulePath)) {
            modulePath.forEach(modulePath => paths.push(modulePath))
        } else {
            paths.push(modulePath)
        }
    })

    process.stdout.write(
        `${green}${bright}Update config ${path.join(module?.path ?? '.', 'tsconfig.json')}${reset}`
    )
    fs.writeFileSync(
        path.resolve(module?.path ?? '.', 'tsconfig.json'),
        JSON.stringify(tsConfig, null, '    ')
    )
    process.stdout.write(` 👌\n`)
}
