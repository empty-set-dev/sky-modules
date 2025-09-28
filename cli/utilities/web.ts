import 'sky/configuration/Sky.App.global'
import 'sky/core/runtime'
import child_process from 'child_process'
import fs from 'fs'
import { networkInterfaces } from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

import tailwindcss from '@tailwindcss/postcss'
import tailwindPlugin from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import postcssMergeQueries from 'postcss-merge-queries'
import { telefunc, config as telefuncConfig } from 'telefunc'
import { telefunc as telefuncPlugin } from 'telefunc/vite'
import { renderPage, createDevMiddleware } from 'vike/server'
import * as vite from 'vite'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import Console, { green, cyan, gray, bright, reset } from './Console'
import getCommandMode from './getCommandMode'
import { findSkyConfig, loadAppCofig } from './loadSkyConfig'

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

    const mode = getCommandMode('web', command)
    dotenv.config({
        path: ['.env', `.env.${mode}`, '.env.local', `.env.${mode}.local`],
        quiet: true,
    })

    const [skyAppConfig, skyConfig] = configs as [Sky.Web.App | Sky.Universal.App, Sky.Config]

    const skyConfigPath = findSkyConfig() as string
    const skyRootPath = path.dirname(path.join(skyConfigPath, '../'))

    const devNameID = skyAppConfig.id

    if (!skyAppConfig.public) {
        throw new Error(`${appName}: public not defined`)
    }

    function getClientConfig(): Promise<vite.InlineConfig> {
        return getConfig({ devNameID, skyRootPath, skyConfig, skyAppConfig, port })
    }

    function getServerConfig(): Promise<vite.InlineConfig> {
        return getConfig({
            devNameID,
            skyRootPath,
            skyConfig,
            skyAppConfig,
            port,
            ssr: true,
        })
    }

    if (command === 'build') {
        await vite.build(await getClientConfig())

        if (skyAppConfig.target === 'web') {
            await vite.build(await getServerConfig())
        }

        return
    }

    if (command === 'dev' || command === 'start' || command === 'preview') {
        const express = (await import('express')).default
        const compression = (await import('compression')).default
        const sirv = (await import('sirv')).default

        type Request = Parameters<Parameters<typeof app.all>[1]>[0]
        type Response = Parameters<Parameters<typeof app.all>[1]>[1]

        const app = express()
        app.use(compression())
        app.use(express.text())

        telefuncConfig.root = path.resolve(skyRootPath, skyAppConfig.path)

        async function telefuncHandler(req: Request, res: Response): Promise<void> {
            // await runtime

            const context = {}
            const httpResponse = await telefunc({
                url: req.originalUrl,
                method: req.method,
                body: req.body,
                context,
            })
            const { body, statusCode, contentType } = httpResponse
            res.status(statusCode).type(contentType).send(body)
        }

        app.all('/_telefunc', async (req, res) => {
            return telefuncHandler(req, res)
        })

        const serverPath = path.resolve(skyAppConfig.path, 'server')

        if (fs.existsSync(serverPath)) {
            await import(serverPath)
        }

        if (command === 'dev') {
            if (skyAppConfig.target === 'universal') {
                const { middlewares } = await vite.createServer(await getClientConfig())
                app.use(middlewares)
                app.use(sirv(path.resolve(skyRootPath, skyAppConfig.path)))
            } else {
                const { devMiddleware } = await createDevMiddleware({
                    viteConfig: await getClientConfig(),
                })
                app.use(devMiddleware)
            }
        } else if (command === 'preview') {
            const viteServer = await vite.preview(await getClientConfig())
            app.use(viteServer.middlewares)
        } else if (command === 'start') {
            if (skyAppConfig.target === 'web') {
                app.use(sirv(`.dev/build/${devNameID}/web/client`))
                app.use(sirv(`.dev/build/${devNameID}/web/server`))
            } else {
                app.use(sirv(`.dev/build/${devNameID}/web`))
            }
        }

        app.use(sirv(skyAppConfig.public))

        if (skyAppConfig.target === 'web') {
            app.get(/\/(.*)/, async (req, res, next) => {
                const pageContextInit = {
                    urlOriginal: req.originalUrl,
                    headersOriginal: req.headers,
                }

                let pageContext: undefined | Awaited<ReturnType<typeof renderPage>>

                pageContext = await renderPage(pageContextInit)

                if (pageContext.errorWhileRendering) {
                    Console.error(pageContext.errorWhileRendering)
                }

                const { httpResponse } = pageContext

                if (!httpResponse) {
                    return next()
                } else {
                    const { statusCode, headers, earlyHints } = httpResponse

                    if (res.writeEarlyHints) {
                        res.writeEarlyHints({ link: earlyHints.map(e => e.earlyHintLink) })
                    }

                    headers.forEach(([name, value]) => res.setHeader(name, value))
                    res.status(statusCode)
                    httpResponse.pipe(res)
                }
            })
        }

        app.listen(port, host ? '0.0.0.0' : '127.0.0.1')

        Console.log(
            `  ${green}${bright}➜${reset}  ${bright}Local${reset}:   ${green}http${
                command === 'start' ? 's' : ''
            }://localhost:${bright}${port}${reset}${green}/${reset}`
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
                    /**
                     * Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                     * 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
                     */
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
    }
}

interface GetConfigParameters {
    devNameID: string
    skyRootPath: string
    skyConfig: Sky.Config
    skyAppConfig: Sky.Web.App | Sky.Universal.App
    port: number
    ssr?: boolean
}
async function getConfig(parameters: GetConfigParameters): Promise<vite.InlineConfig> {
    const { devNameID, skyRootPath, skyConfig, skyAppConfig, port, ssr } = parameters

    const plugins: vite.InlineConfig['plugins'] = [telefuncPlugin(), tailwindPlugin()]

    const resolve: vite.InlineConfig['resolve'] = {
        alias: [
            ...Object.keys(skyConfig.modules).map(k => ({
                find: 'pkgs',
                replacement: path.resolve(skyRootPath, skyConfig.modules[k].path, 'pkgs'),
            })),
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
                find: '@',
                replacement: path.resolve(skyRootPath, skyAppConfig.public),
            },
        ],
    }

    if (skyAppConfig.target === 'universal') {
        ;(<vite.Alias[]>resolve.alias).push({
            find: 'react-native',
            replacement: path.resolve(dirname, '../../node_modules/react-native-web'),
        })
    } else {
        const vike = (await import('vike/plugin')).default
        plugins.push(vike())

        if (skyAppConfig.jsx === 'react') {
            plugins.push(
                react({
                    babel: {
                        parserOpts: {
                            plugins: ['classProperties', 'decorators'],
                        },
                    },
                })
            )
        }
    }

    const root = path.resolve(skyRootPath, skyAppConfig.path)

    const build: vite.InlineConfig['build'] = {
        assetsDir: 'static',
        emptyOutDir: true,
        outDir: path.resolve(`.dev/build/${devNameID}/web`),
        target: 'esnext',
    }

    if (ssr) {
        build.ssr = true
    }

    const config: vite.InlineConfig = {
        appType: 'spa',
        root,
        base: '/',
        plugins,
        resolve,
        esbuild: {
            minifyIdentifiers: false,
            keepNames: true,
            jsx: skyAppConfig.jsx === 'qwik' ? 'preserve' : 'automatic',
        },
        build,
        css: {
            postcss: {
                plugins: [tailwindcss(), postcssMergeQueries()],
            },
            modules: {
                generateScopedName: (className, modulePath) => {
                    const match = modulePath.match(/([^\\/_]*).module.scss$/)
                    return match
                        ? match[1] !== className
                            ? `${match[1]}-${className}`
                            : className
                        : className
                },
            },
        },
        preview: {
            port,
        },
        publicDir: path.resolve(skyRootPath, skyAppConfig.public),
        server: {
            cors: true,
            middlewareMode: true,
            hmr: {
                overlay: true,
            },
        },
        optimizeDeps: {
            include: ['tailwindcss'],
        },
    }

    return config
}
