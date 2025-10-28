import '@sky-modules/cli/configuration/Sky.App.namespace'
import '@sky-modules/cli/configuration/Sky.Config.namespace'
import '@sky-modules/cli/configuration/Sky.Module.namespace'
import fs from 'fs'
import path from 'path'

import cliPath from './utilities/cliPath'
import { bright, green, reset } from './utilities/Console'
import loadSkyConfig from './utilities/loadSkyConfig'
import workspaceRoot from './utilities/workspaceRoot'

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
        initTsConfig(module, skyConfig, false)
    }

    for (const name of Object.keys(skyConfig.playgrounds)) {
        const example = skyConfig.playgrounds[name]

        if (isExternalModule(example.path)) {
            break
        }

        allProjectPaths.push(example.path)
        initTsConfig(example, skyConfig, true)
    }

    for (const name of Object.keys(skyConfig.apps)) {
        const app = skyConfig.playgrounds[name]

        if (isExternalModule(app.path)) {
            break
        }

        allProjectPaths.push(app.path)
        initTsConfig(app, skyConfig, true)
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

function initTsConfig(module: Sky.Module | Sky.App, skyConfig: Sky.Config, isApp: boolean): void {
    if (!workspaceRoot) {
        return
    }

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
            jsx: jsxConfig.jsx,
            ...(jsxConfig.jsxImportSource && { jsxImportSource: jsxConfig.jsxImportSource }),
            module: 'esnext',
            target: 'es2022',
            moduleResolution: 'bundler',
            resolvePackageJsonImports: true,
            allowImportingTsExtensions: true,
            noEmit: true,
            esModuleInterop: true,
            resolveJsonModule: true,
            experimentalDecorators: true,
            incremental: true,
            tsBuildInfoFile: path.join(
                path.relative(module.path, workspaceRoot),
                '.dev/build',
                module?.id ?? '.',
                'tsbuildinfo'
            ),
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

    const modulesAndAppsPaths = [
        {
            name: '#',
            path: './*',
        },
        {
            name: '~defines',
            path: path.relative(module.path, './.dev/defines/*'),
        },
        ...Object.keys(skyConfig.modules)
            .filter(name => !skyConfig.modules[name].package)
            .map(name => ({
                name: '~' + name,
                path: path.relative(module.path, skyConfig.modules[name].path + '/*'),
            })),
        ...Object.keys(skyConfig.apps).map(name => ({
            name: '~' + name,
            path: path.relative(module.path, skyConfig.apps[name].path + '/*'),
        })),
    ]

    if (hasPublic(module)) {
        modulesAndAppsPaths.push({
            name: '~public',
            path: path.relative(module.path, module.public + '/*'),
        })
    }

    for (const module_ of Object.values(skyConfig.modules)) {
        if (!module_.package || module_.path === module.path) {
            continue
        }

        tsConfig.compilerOptions.paths[module_.package] = [path.relative(module.path, module_.path)]
    }

    modulesAndAppsPaths.forEach(({ name, path: modulePath }) => {
        const tsConfigPaths = (tsConfig.compilerOptions.paths[`${name}/*`] ??= [])
        tsConfigPaths.push(modulePath)
    })

    if (isApp) {
        tsConfig.compilerOptions.paths['#setup'] = ['./setup']
        tsConfig.compilerOptions.paths['#server/*'] = ['./server/*']
    } else {
        const defaultImportsPaths =
            './' + path.relative(module.path, path.join(cliPath, 'default-imports'))

        tsConfig.compilerOptions.paths['~setup'] = [defaultImportsPaths + '/setup,ts']
        tsConfig.compilerOptions.paths['~project/*'] = [defaultImportsPaths + '/*']
        tsConfig.compilerOptions.paths['~x/*'] = [defaultImportsPaths + '/x/*']
        tsConfig.compilerOptions.paths['~screens/*'] = [defaultImportsPaths + '/screens/*']
    }

    const packageJson = {
        type: 'module',
        imports: {
            '#defines': [path.relative(module.path, './.dev/defines/*')],
            '#setup': ['./setup'],
            '#/*': ['./*'],
            '#server/*': ['./server/*'],
        },
    }

    process.stdout.write(
        `${green}${bright}Update ${path.join(module?.path ?? '.', 'package.json')}${reset}`
    )
    fs.writeFileSync(
        path.resolve(module?.path ?? '.', 'package.json'),
        JSON.stringify(packageJson, null, '    ')
    )

    process.stdout.write(
        `${green}${bright}Update ${path.join(module?.path ?? '.', 'tsconfig.json')}${reset}`
    )
    fs.writeFileSync(
        path.resolve(module?.path ?? '.', 'tsconfig.json'),
        JSON.stringify(tsConfig, null, '    ')
    )
    process.stdout.write(` 👌\n`)
}
