import child_process from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import postcssMergeQueries from 'postcss-merge-queries'
import tailwindcss from 'tailwindcss'
import vike from 'vike/plugin'
import { InlineConfig } from 'vite'
import * as vite from 'vite'

import { SkyApp, SkyConfig } from './__loadSkyConfig'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const skyConfig = JSON.parse(process.env.SKY_CONFIG) as SkyConfig
const skyAppConfig = JSON.parse(process.env.SKY_APP_CONFIG) as SkyApp
const port = JSON.parse(process.env.PORT)
const open = JSON.parse(process.env.OPEN)
const command = process.env.COMMAND

await web()

if (open) {
    const start =
        process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open'
    child_process.execSync(`${start} http://localhost:${port}`)
}

export async function web(): Promise<void> {
    if (command === 'build') {
        await vite.build(config(skyAppConfig))
        await vite.build(config(skyAppConfig, true))
        return
    }

    if (command === 'start') {
        const server = await vite.preview({
            ...config(skyAppConfig),
            server: {
                host: '0.0.0.0',
            },
        })
        server.printUrls()
        server.bindCLIShortcuts({ print: true })
        return
    }

    const server = await vite.createServer(config(skyAppConfig))
    await server.listen(port)
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
}

function config(skyAppConfig: SkyApp, ssr?: boolean): InlineConfig {
    const plugins: InlineConfig['plugins'] = [react()]

    const libs = ['react-router-dom', 'three', 'lottie-web', 'seedrandom', 'universal-cookie']

    const resolve = {
        alias: [
            {
                find: 'libs',
                replacement: path.resolve(__dirname, '../libs'),
            },
            {
                find: 'sky',
                replacement: path.resolve(__dirname, '..'),
            },
            ...libs.map(lib => ({
                find: lib,
                replacement: path.resolve(__dirname, `../node_modules/${lib}`),
            })),
            {
                find: '@',
                replacement: path.resolve(skyAppConfig.path),
            },
            ...skyConfig.apps.map(skyAppConfig => ({
                find: skyAppConfig.name,
                replacement: path.resolve(skyAppConfig.path),
            })),
            ...skyConfig.modules.map(skyModuleConfig => ({
                find: skyModuleConfig.name,
                replacement: path.resolve(skyModuleConfig.path),
            })),
            {
                find: 'public',
                replacement: path.resolve(skyAppConfig.public),
            },
        ],
    }

    if (skyAppConfig.target !== 'web') {
        resolve.alias.push({
            find: 'react-native',
            replacement: path.resolve(__dirname, '../node_modules/react-native-web'),
        })
    } else {
        plugins.push(viteCommonjs(), vike())
    }

    const config: InlineConfig = {
        root: skyAppConfig.path,
        plugins,
        resolve,
        esbuild: {
            keepNames: true,
        },
        build: {
            assetsDir: skyAppConfig.public,
            emptyOutDir: true,
            ssr,
            outDir: path.resolve(`.sky/${skyAppConfig.name}/web`),
            target: 'esnext',
        },
        css: {
            postcss: {
                plugins: [tailwindcss(), autoprefixer(), postcssMergeQueries()],
            },
            modules: {
                generateScopedName: '[local]',
            },
        },
        preview: {
            port,
        },
        publicDir: path.resolve(skyAppConfig.public),
    }

    return config
}
