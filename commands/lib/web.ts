import child_process from 'child_process'
import fs from 'fs'
import { networkInterfaces } from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

import tailwindVite from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import postcssMergeQueries from 'postcss-merge-queries'
import { SkyUniversalApp, SkyWebApp } from 'sky/configuration/SkyApp'
import SkyConfig from 'sky/configuration/SkyConfig'
import Console, { green, cyan, gray, bright, reset } from 'sky/utilities/Console'
import { telefunc, config as telefuncConfig } from 'telefunc'
import { telefunc as telefuncPlugin } from 'telefunc/vite'
import { createDevMiddleware, renderPage } from 'vike/server'
import * as vite from 'vite'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { findSkyConfig, loadAppCofig } from './loadSkyConfig'
import run from './run'

const dirname = fileURLToPath(new URL('.', import.meta.url) as Parameters<typeof fileURLToPath>[0])

await web()

export default async function web(): Promise<void> {
    const argv = await yargs(hideBin(process.argv))
        .option('port', {
            number: true,
            default: 3000,
        })
        .option('open', {
            number: true,
            default: false,
        })
        .option('host', {
            number: true,
            default: false,
        })
        .parse()

    const command = argv._[0] as string
    const appName = argv._[1] as string
    const { port, open, host } = argv

    const configs = await loadAppCofig(appName)

    if (configs == null) {
        return
    }

    const [skyAppConfig, skyConfig] = configs as [SkyWebApp | SkyUniversalApp, SkyConfig]

    const skyConfigPath = findSkyConfig() as string
    const skyRootPath = path.dirname(path.join(skyConfigPath, '../'))

    const devNameID = appName.replaceAll('/', '.')

    if (!skyAppConfig.public) {
        throw Error(`${appName}: public not defined`)
    }

    const clientConfig = await getConfig({ devNameID, skyRootPath, skyConfig, skyAppConfig, port })
    const serverConfig = await getConfig({
        devNameID,
        skyRootPath,
        skyConfig,
        skyAppConfig,
        port,
        ssr: true,
    })

    if (command === 'build') {
        await vite.build(clientConfig)

        if (skyAppConfig.target === 'web') {
            await vite.build(serverConfig)
        }

        return
    }

    if (command === 'dev' || command === 'start' || command === 'preview') {
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
            const { devMiddleware } = await createDevMiddleware({
                viteConfig: clientConfig,
            })

            app.use(devMiddleware)

            if (skyAppConfig.target === 'universal') {
                app.use(sirv(path.resolve(skyRootPath, skyAppConfig.path)))
            }
        }

        if (command === 'preview') {
            const viteServer = await vite.preview({
                ...(await getConfig({ devNameID, skyRootPath, skyConfig, skyAppConfig, port })),
                server: {
                    middlewareMode: true,
                },
            })
            app.use(viteServer.middlewares)
        }

        if (command === 'start') {
            if (skyAppConfig.target === 'web') {
                app.use(sirv(`.dev/build/${devNameID}/web/client`))
                app.use(sirv(`.dev/build/${devNameID}/web/server`))
            } else {
                app.use(sirv(`.dev/build/${devNameID}/web`))
            }
        }

        app.use(sirv(skyAppConfig.public))

        if (skyAppConfig.target === 'web') {
            app.all(/(.*)/, async (req, res, next) => {
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
                    // httpResponse.pipe(res)
                }
            })
        } else {
            const serverEntryPath = path.resolve(skyAppConfig.path, 'server/index.ts')

            if (fs.existsSync(serverEntryPath)) {
                run(
                    `pnpm bun --watch --expose-gc  --no-warnings --tsconfig ${path.resolve(
                        skyAppConfig.path,
                        'tsconfig.json'
                    )} ${serverEntryPath} &`
                )
            }
        }

        app.listen(port, host ? '0.0.0.0' : '127.0.0.1')

        Console.log(
            `  ${green}${bright}➜${reset}  ${bright}Local${reset}:   ${cyan}http${
                command === 'start' ? 's' : ''
            }://localhost:${bright}${port}${reset}${cyan}/${reset}`
        )

        if (open) {
            const start =
                process.platform == 'darwin'
                    ? 'open'
                    : process.platform == 'win32'
                      ? 'start'
                      : 'xdg-open'
            child_process.execSync(`${start} http://localhost:${port}`)
        }

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

interface GetConfigParameters {
    devNameID: string
    skyRootPath: string
    skyConfig: SkyConfig
    skyAppConfig: SkyWebApp | SkyUniversalApp
    port: number
    ssr?: boolean
}
async function getConfig(parameters: GetConfigParameters): Promise<vite.InlineConfig> {
    const { devNameID, skyRootPath, skyConfig, skyAppConfig, port, ssr } = parameters

    const plugins: vite.InlineConfig['plugins'] = [
        react({
            babel: {
                parserOpts: {
                    plugins: ['classProperties'],
                },
            },
        }),
        telefuncPlugin(),
        tailwindVite(),
    ]

    const resolve = {
        alias: [
            {
                find: 'pkgs',
                replacement: path.resolve(dirname, '../../pkgs'),
            },
            {
                find: 'defines',
                replacement: path.resolve(skyRootPath, '.dev/defines'),
            },
            {
                find: 'sky',
                replacement: path.resolve(dirname, '../..'),
            },
            {
                find: '#',
                replacement: path.resolve(skyRootPath, skyAppConfig.path),
            },
            ...Object.keys(skyConfig.apps).map(k => ({
                find: k,
                replacement: path.resolve(skyRootPath, skyConfig.apps[k].path),
            })),
            ...Object.keys(skyConfig.examples).map(k => ({
                find: k,
                replacement: path.resolve(skyRootPath, skyConfig.examples[k].path),
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
            replacement: path.resolve(dirname, '../../node_modules/react-native-web'),
        })
    } else {
        const vike = (await import('vike/plugin')).default
        plugins.push(vike())
    }

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
            outDir: path.resolve(`.dev/build/${devNameID}/web`),
            target: 'esnext',
        },
        css: {
            postcss: {
                plugins: [autoprefixer(), postcssMergeQueries()],
            },
            modules: {
                generateScopedName: className => className,
            },
        },
        preview: {
            port,
        },
        publicDir: path.resolve(skyRootPath, skyAppConfig.public),
        server: {
            cors: true,
            hmr: false,
            middlewareMode: true,
        },
    }

    return config
}
