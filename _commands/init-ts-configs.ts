#!/usr/bin/env -S npx tsx
import fs from 'fs'
import path from 'path'

import { b, e, purple } from './__coloredConsole'
import __loadSkyConfig, { SkyApp, SkyConfig, SkyModule } from './__loadSkyConfig'
import __sdkPath from './__sdkPath'

export namespace init {
    tsconfigs()

    export async function tsconfigs(): Promise<void> {
        const skyConfig = await __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        Object.keys(skyConfig.modules).map(name => tsconfig(skyConfig.modules[name], skyConfig))
        Object.keys(skyConfig.apps).map(name => tsconfig(skyConfig.apps[name], skyConfig))
    }
}

function tsconfig(module: SkyModule | SkyApp, skyConfig: SkyConfig): void {
    const pkgsPaths = [
        ...new Set(
            Object.keys(skyConfig.modules).map(name =>
                path.relative(module.path, path.join(skyConfig.modules[name].path, '@pkgs'))
            )
        ).values(),
    ]

    const publicPaths = [
        ...new Set(
            Object.keys(skyConfig.apps)
                .filter(name => skyConfig.apps[name].public)
                .map(name => path.relative(module.path, skyConfig.apps[name].public))
        ).values(),
    ]

    const modulesAndAppsPaths = [
        ...pkgsPaths.map(pkgsPath => ({
            name: '@pkgs',
            path: pkgsPath,
        })),
        ...Object.keys(skyConfig.modules).map(name => ({
            name,
            path: path.relative(module.path, skyConfig.modules[name].path),
        })),
        {
            name: '#',
            path: path.relative(module.path, module.path),
        },
        ...Object.keys(skyConfig.apps).map(name => ({
            name,
            path: path.relative(module.path, skyConfig.apps[name].path),
        })),
        ...publicPaths.map(publicPath => ({
            name: 'public',
            path: publicPath,
        })),
    ]

    const modulePaths = [
        ...Object.keys(skyConfig.modules).map(name => path.relative(module.path, skyConfig.modules[name].path)),
    ]

    const include = [
        path.relative(module.path, 'sky.config.ts'),
        path.relative(module.path, 'deploy.ts'),
        ...modulesAndAppsPaths.map(({ path }) => (path === '' ? './' : `${path}`)),
    ]

    const exclude = [
        ...modulePaths.map(
            modulePath => `${modulePath === '' ? '' : `${modulePath}/`}node_modules`
        ),
    ]

    const tsConfig = {
        compilerOptions: {
            strict: true,
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
            paths: {} as Record<string, string[]>,
        },

        include,
        exclude,
    }

    modulesAndAppsPaths.forEach(({ name, path }) => {
        tsConfig.compilerOptions.paths[`${name}/*`] ??= []
        tsConfig.compilerOptions.paths[`${name}/*`].push(path === '' ? './*' : `${path}/*`)
    })

    process.stdout.write(
        `${b}${purple}Rewrite config ${path.join(module.path, 'tsconfig.json')}${e}`
    )
    fs.writeFileSync(
        path.resolve(module.path, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, '    ')
    )
    process.stdout.write(` 👌\n`)
}
