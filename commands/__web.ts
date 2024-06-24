import child_process from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import vike from 'vike/plugin'
import { InlineConfig } from 'vite'

import { SkyApp } from './__loadSkyConfig'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'

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
        const vite = await import('vite')
        vite.build(config(skyAppConfig))
        return
    }

    if (isProduction) {
        const express = (await import('express')).default
        const compression = (await import('compression')).default
        const app = express()
        app.use(compression())
        const sirv = (await import('sirv')).default

        app.use(sirv(`.sky/${skyAppConfig.name}/web`))

        app.listen(port)
        // eslint-disable-next-line no-console
        console.log('Listening...')

        return
    }

    const vite = await import('vite')
    const server = await vite.createServer(config(skyAppConfig))
    await server.listen(port)
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
}

function config(skyAppConfig: SkyApp): InlineConfig {
    const plugins = [react()]

    const resolve = {
        alias: [
            {
                find: 'sky',
                replacement: path.resolve(__dirname, '..'),
            },
            {
                find: '@',
                replacement: path.resolve(skyAppConfig.path),
            },
            {
                find: skyAppConfig.name,
                replacement: path.resolve(skyAppConfig.path),
            },
            {
                find: '(.*)',
                replacement: path.resolve(__dirname, '../node_modules'),
            },
            {
                find: 'react',
                replacement: path.resolve(__dirname, '../node_modules/react'),
            },
            {
                find: 'react-dom',
                replacement: path.resolve(__dirname, '../node_modules/react-dom'),
            },
            {
                find: 'three',
                replacement: path.resolve(__dirname, '../node_modules/three'),
            },
        ],
    }

    if (skyAppConfig.target !== 'web') {
        resolve.alias.push({
            find: 'react-native',
            replacement: path.resolve(__dirname, '../node_modules/react-native-web'),
        })
    } else {
        plugins.push(vike())
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
            outDir: path.resolve(`.sky/${skyAppConfig.name}/web`),
            target: 'esnext',
        },
        css: {
            postcss: {
                plugins: [tailwindcss(), autoprefixer()],
            },
        },
    }

    return config
}
