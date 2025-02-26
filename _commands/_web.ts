import child_process from 'child_process'
import { networkInterfaces } from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
//@ts-ignore
import postcssMergeQueries from 'postcss-merge-queries'
import tailwindcss from 'tailwindcss'
import { telefunc, config as telefuncConfig } from 'telefunc'
import { telefunc as telefuncPlugin } from 'telefunc/vite'
import { createDevMiddleware, renderPage } from 'vike/server'
import * as vite from 'vite'

import { errorConsole } from '../helpers/console'
import { green, cyan, gray, bright, reset } from '../helpers/console'
import { logConsole } from '../helpers/console'

import { __findSkyConfig, __getAppConfig, SkyApp, SkyConfig } from './__loadSkyConfig'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const port = JSON.parse(process.env.PORT!) as number
const open = JSON.parse(process.env.OPEN!) as boolean
const host = JSON.parse(process.env.HOST!) as boolean
const name = process.env.NAME!
const command = process.env.COMMAND

const cwd = process.cwd()

const skyConfigPath = __findSkyConfig()!
const skyRootPath = path.dirname(skyConfigPath)
const skyConfig = (await import(skyConfigPath)).default as SkyConfig
const skyAppConfig = __getAppConfig(name, skyConfig)!

if (!skyAppConfig.public) {
    throw Error('public not defined')
}

await web()

if (open) {
    const start =
        process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open'
    child_process.execSync(`${start} http://localhost:${port}`)
}

export async function web(): Promise<void> {
    if (command === 'build') {
        await vite.build(await config(skyAppConfig))

        if (skyAppConfig.target === 'web') {
            await vite.build(await config(skyAppConfig, true))
        }

        return
    }

    if (command === 'start' || command === 'dev' || command === 'preview') {
        const express = (await import('express')).default
        const compression = (await import('compression')).default
        const sirv = (await import('sirv')).default

        const app = express()
        app.use(compression())
        app.use(express.text())

        telefuncConfig.root = path.resolve(skyRootPath, skyAppConfig.path)
        app.all('/_telefunc', async (req, res) => {
            const context = {}
            const httpResponse = await telefunc({
                url: req.originalUrl,
                method: req.method,
                body: req.body,
                context,
            })
            const { body, statusCode, contentType } = httpResponse
            res.status(statusCode).type(contentType).send(body)
        })

        if (command === 'dev') {
            if (skyAppConfig.target === 'web') {
                const { devMiddleware } = await createDevMiddleware({
                    viteConfig: await config(skyAppConfig),
                })

                app.use(devMiddleware)
            } else {
                const devServer = await vite.createServer(await config(skyAppConfig))

                app.use(devServer.middlewares)
            }
        }

        if (command === 'preview') {
            const viteServer = await vite.preview({
                ...(await config(skyAppConfig)),
                server: {
                    middlewareMode: true,
                },
            })
            app.use(viteServer.middlewares)
        }

        app.use(sirv(skyAppConfig.public))

        if (command === 'start') {
            if (skyAppConfig.target === 'web') {
                app.use(sirv(`.sky/${name}/web/client`))
                app.use(sirv(`.sky/${name}/web/server`))
            } else {
                import(path.resolve(skyRootPath, skyAppConfig.path, 'server/index.ts'))
                app.use(sirv(`.sky/${name}/web`))
            }
        }

        if (skyAppConfig.target === 'web') {
            app.all('*', async (req, res, next) => {
                const pageContextInit = {
                    urlOriginal: req.originalUrl,
                    headersOriginal: req.headers,
                }
                const pageContext = await renderPage(pageContextInit)
                if (pageContext.errorWhileRendering) {
                    errorConsole(pageContext.errorWhileRendering)
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
        }

        await app.listen(port, host ? '0.0.0.0' : '127.0.0.1')

        logConsole(
            `  ${green}${bright}➜${reset}  ${bright}Local${reset}:   ${cyan}http${
                command === 'start' ? 's' : ''
            }://localhost:${bright}${port}${reset}${cyan}/${reset}`
        )

        if (!host) {
            logConsole(
                `  ${green}${bright}➜${reset}  ${bright}${gray}Network${reset}${gray}: use ${reset}` +
                    `${bright}--host${reset} ${gray}to expose${reset}`
            )
        } else {
            const nets = networkInterfaces()
            const addresses: string[] = []

            for (const name of Object.keys(nets)) {
                for (const net of nets[name]!) {
                    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
                    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
                    if (net.family === familyV4Value && !net.internal) {
                        addresses.push(net.address)
                    }
                }
            }

            addresses.forEach(address => {
                logConsole(
                    `  ${green}${bright}➜${reset}  ${bright}Network${reset}${gray}: ${cyan}http${
                        command === 'start' ? 's' : ''
                    }://${address}:${bright}${port}${reset}${cyan}/${reset}`
                )
            })
        }

        return
    }
}

async function config(skyAppConfig: SkyApp, ssr?: boolean): Promise<vite.InlineConfig> {
    const plugins: vite.InlineConfig['plugins'] = [
        react({
            babel: {
                parserOpts: {
                    plugins: ['decorators-legacy', 'classProperties'],
                },
            },
        }),
        telefuncPlugin(),
    ]

    const resolve = {
        alias: [
            {
                find: 'pkgs',
                replacement: path.resolve(__dirname, '../pkgs'),
            },
            {
                find: 'sky',
                replacement: path.resolve(__dirname, '..'),
            },
            {
                find: '#',
                replacement: path.resolve(skyRootPath, skyAppConfig.path),
            },
            ...Object.keys(skyConfig.apps).map(k => ({
                find: k,
                replacement: path.resolve(skyRootPath, skyConfig.apps[k].path),
            })),
            ...Object.keys(skyConfig.modules).map(k => ({
                find: k,
                replacement: path.resolve(skyRootPath, skyConfig.modules[k].path),
            })),
            {
                find: 'public',
                replacement: path.resolve(skyRootPath, skyAppConfig.public!),
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
        root: path.resolve(skyRootPath, skyAppConfig.path),
        base: '/',
        plugins,
        resolve,
        esbuild: {
            keepNames: true,
        },
        build: {
            assetsDir: path.relative(cwd, path.resolve(skyRootPath, skyAppConfig.public!)),
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
                generateScopedName: (className, filePath) => {
                    const fileName = path.basename(filePath, '.module.scss')

                    if (className === fileName || className.startsWith(`${fileName}-`)) {
                        return className
                    }

                    return `${fileName}-${className}`
                },
            },
            preprocessorOptions: {
                scss: {
                    api: 'modern',
                },
            },
        },
        preview: {
            port,
        },
        publicDir: path.resolve(skyRootPath, skyAppConfig.public!),
        optimizeDeps: {
            exclude: ['@mapbox'],
        },
    }

    if (skyAppConfig.proxy) {
        config.server = {
            proxy: skyAppConfig.proxy,
        }
    }

    return config
}
