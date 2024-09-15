import child_process from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import postcssMergeQueries from 'postcss-merge-queries'
import tailwindcss from 'tailwindcss'
import { renderPage } from 'vike/server'
import * as vite from 'vite'

import { SkyApp, SkyConfig } from './__loadSkyConfig'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const pkgs = ['lottie-web', 'universal-cookie']

const port = JSON.parse(process.env.PORT)
const open = JSON.parse(process.env.OPEN)
const name = process.env.NAME
const command = process.env.COMMAND

const skyConfig = (await import(path.join(process.cwd(), 'sky.config.ts'))).default as SkyConfig
const skyAppConfig = skyConfig.apps[name] as SkyApp

await web()

if (open) {
    const start =
        process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open'
    child_process.execSync(`${start} http://localhost:${port}`)
}

export async function web(): Promise<void> {
    if (command === 'dev') {
        serverEntry()
        const server = await vite.createServer(await config(skyAppConfig))
        await server.listen(port)
        server.printUrls()
        server.bindCLIShortcuts({ print: true })
        return
    }

    if (command === 'build') {
        await vite.build(await config(skyAppConfig))
        await vite.build(await config(skyAppConfig, true))
        return
    }

    if (command === 'preview') {
        serverEntry()
        const server = await vite.preview(await config(skyAppConfig))
        server.printUrls()
        server.bindCLIShortcuts({ print: true })
        return
    }

    if (command === 'start') {
        serverEntry()
        const express = (await import('express')).default
        const compression = (await import('compression')).default
        const sirv = (await import('sirv')).default

        const server = express()
        server.use(compression())
        server.use(sirv(skyAppConfig.public))
        server.use(sirv(`.sky/${name}/web/client`))
        server.use(sirv(`.sky/${name}/web/server`))
        server.all('*', async (req, res, next) => {
            const pageContextInit = {
                urlOriginal: req.originalUrl,
                headersOriginal: req.headers,
            }
            const pageContext = await renderPage(pageContextInit)
            if (pageContext.errorWhileRendering) {
                // eslint-disable-next-line no-console
                console.error(pageContext.errorWhileRendering)
            }
            const { httpResponse } = pageContext
            if (!httpResponse) {
                return next()
            } else {
                const { body, statusCode, headers, earlyHints } = httpResponse

                if (res.writeEarlyHints) {
                    res.writeEarlyHints({ link: earlyHints.map(e => e.earlyHintLink) })
                }

                headers.forEach(([name, value]) => res.setHeader(name, value))
                res.status(statusCode)
                // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/streaming
                res.send(body)
            }
        })
        await server.listen(port)
        // eslint-disable-next-line no-console
        console.log('Server listening')

        return
    }
}

async function serverEntry(): Promise<void> {
    // if (fs.existsSync(path.join(skyAppConfig.path, 'server/index.ts'))) {
    //     await import(path.resolve(skyAppConfig.path, 'server/index.ts'))
    // }
}

async function config(skyAppConfig: SkyApp, ssr?: boolean): Promise<vite.InlineConfig> {
    const plugins: vite.InlineConfig['plugins'] = [react()]

    const resolve = {
        alias: [
            {
                find: '@pkgs',
                replacement: path.resolve(__dirname, '../@pkgs'),
            },
            {
                find: 'sky',
                replacement: path.resolve(__dirname, '..'),
            },
            ...pkgs.map(pkg => ({
                find: pkg,
                replacement: path.resolve(__dirname, `../node_modules/${pkg}`),
            })),
            {
                find: '#',
                replacement: path.resolve(skyAppConfig.path),
            },
            ...Object.keys(skyConfig.apps).map(k => ({
                find: k,
                replacement: path.resolve(skyConfig.apps[k].path),
            })),
            ...Object.keys(skyConfig.modules).map(k => ({
                find: k,
                replacement: path.resolve(skyConfig.modules[k].path),
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
        const vike = (await import('vike/plugin')).default
        plugins.push(vike())
    }

    const config: vite.InlineConfig = {
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
            outDir: path.resolve(`.sky/${name}/web`),
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

    if (skyAppConfig.proxy) {
        config.server = {
            proxy: skyAppConfig.proxy,
        }
    }

    return config
}
