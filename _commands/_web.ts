import child_process from 'child_process'
import fs from 'fs'
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

import SkyApp from '../configuration/SkyApp'
import SkyConfig from '../configuration/SkyConfig'
import Console, { green, cyan, gray, bright, reset } from '../utilities/Console'

import { __findSkyConfig, __getAppConfig } from './__loadSkyConfig'
import __run from './__run'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const port = JSON.parse(process.env.PORT!) as number
const open = JSON.parse(process.env.OPEN!) as boolean
const host = JSON.parse(process.env.HOST!) as boolean
const name = process.env.NAME!
const command = process.env.COMMAND

const skyConfigPath = __findSkyConfig()!
const skyRootPath = path.dirname(skyConfigPath)
const skyConfig = (await import(skyConfigPath.replace('D:\\', 'file:///D:\\'))).default as SkyConfig
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
        await vite.build(await getConfig(skyAppConfig))

        if (skyAppConfig.target === 'web') {
            await vite.build(await getConfig(skyAppConfig, true))
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

        app.use(sirv(skyAppConfig.public))

        if (command === 'dev') {
            if (skyAppConfig.target === 'universal') {
                const { middlewares } = await vite.createServer(await getConfig(skyAppConfig))
                app.use(middlewares)
                app.use(sirv(path.resolve(skyRootPath, skyAppConfig.path)))
            } else {
                const { devMiddleware } = await createDevMiddleware({
                    viteConfig: await getConfig(skyAppConfig),
                })

                app.use(devMiddleware)
            }
        }

        if (command === 'preview') {
            const viteServer = await vite.preview({
                ...(await getConfig(skyAppConfig)),
                server: {
                    middlewareMode: true,
                },
            })
            app.use(viteServer.middlewares)
        }

        if (command === 'start') {
            if (skyAppConfig.target === 'web') {
                app.use(sirv(`.sky/${name}/web/client`))
                app.use(sirv(`.sky/${name}/web/server`))
            } else {
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
                    Console.error(pageContext.errorWhileRendering)
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
        } else {
            const serverEntryPath = path.resolve(skyAppConfig.path, 'server/index.ts')

            if (fs.existsSync(serverEntryPath)) {
                __run(
                    `npx tsx --watch --expose-gc  --no-warnings --tsconfig ${path.resolve(
                        skyAppConfig.path,
                        'tsconfig.json'
                    )} ${serverEntryPath} &`
                )
            }
        }

        await app.listen(port, host ? '0.0.0.0' : '127.0.0.1')

        Console.log(
            `  ${green}${bright}➜${reset}  ${bright}Local${reset}:   ${cyan}http${
                command === 'start' ? 's' : ''
            }://localhost:${bright}${port}${reset}${cyan}/${reset}`
        )

        if (!host) {
            Console.log(
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
                Console.log(
                    `  ${green}${bright}➜${reset}  ${bright}Network${reset}${gray}: ${cyan}http${
                        command === 'start' ? 's' : ''
                    }://${address}:${bright}${port}${reset}${cyan}/${reset}`
                )
            })
        }

        return
    }
}

async function getConfig(skyAppConfig: SkyApp, ssr?: boolean): Promise<vite.InlineConfig> {
    const plugins: vite.InlineConfig['plugins'] = [
        react({
            babel: {
                parserOpts: {
                    plugins: ['classProperties'],
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

    if (skyAppConfig.target === 'universal') {
        resolve.alias.push({
            find: 'react-native',
            replacement: path.resolve(__dirname, '../node_modules/react-native-web'),
        })
    } else {
        const vike = (await import('vike/plugin')).default
        plugins.push(vike())
    }

    const define: Record<string, unknown> = {}
    Object.keys(process.env).map(k => {
        if (k.startsWith('PUBLIC_ENV__')) {
            define[k] = JSON.stringify(process.env[k])
        }
    })

    const root = path.resolve(skyRootPath, skyAppConfig.path)

    const config: vite.InlineConfig = {
        root,
        base: '/',
        plugins,
        resolve,
        esbuild: {
            minifyIdentifiers: false,
            keepNames: true,
        },
        build: {
            assetsDir: './',
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
                generateScopedName: className => className,
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
        define,
        server: {
            cors: true,
            hmr: false,
            middlewareMode: true,
        },
    }

    return config
}
