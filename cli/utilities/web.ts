import '../configuration/Sky.Config.namespace'
import '@sky-modules/core/runtime'

import child_process from 'child_process'
import fs from 'fs'
import { networkInterfaces } from 'os'
import path from 'path'

import runtime from '@sky-modules/core/runtime'
import tailwindPlugin from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import cssnano from 'cssnano'
import dotenv from 'dotenv'
import { visualizer } from 'rollup-plugin-visualizer'
import { telefunc, config as telefuncConfig } from 'telefunc'
import { telefunc as telefuncPlugin } from 'telefunc/vite'
import { renderPage, createDevMiddleware } from 'vike/server'
import * as vite from 'vite'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { CLI_CONSTANTS, ExitCode } from '../constants'

import Console, { green, cyan, gray, bright, reset } from './Console'
import getCommandMode from './getCommandMode'
import { findSkyConfig, loadAppCofig } from './loadSkyConfig'

import type { Server } from 'http'

// Server lifecycle management
let mainServer: Server | null = null
let viteDevServer: vite.ViteDevServer | null = null
let vitePreviewServer: vite.PreviewServer | null = null
let pandaProcess: child_process.ChildProcess | null = null
let isShuttingDown = false
let parentProcessMonitor: NodeJS.Timeout | null = null
let signalHandlersRegistered = false

async function shutdownServer(signal: string): Promise<void> {
    if (isShuttingDown) return
    isShuttingDown = true

    Console.log(`\n🛑 Received ${signal}, shutting down...`)

    // Stop parent process monitoring
    if (parentProcessMonitor) {
        clearInterval(parentProcessMonitor)
        parentProcessMonitor = null
    }

    // Force exit after 2 seconds no matter what
    const forceExitTimer = setTimeout(() => {
        Console.warn('⚠️  Force exit timeout reached')
        process.exit(ExitCode.SUCCESS)
    }, 2000)

    try {
        if (pandaProcess) {
            Console.log('Stopping Panda CSS...')
            pandaProcess.kill('SIGTERM')
            pandaProcess = null
        }

        if (viteDevServer) {
            Console.log('Closing Vite dev server...')
            await Promise.race([
                viteDevServer.close(),
                new Promise(resolve => setTimeout(resolve, 1000)),
            ])
        }

        if (vitePreviewServer) {
            Console.log('Closing Vite preview server...')
            vitePreviewServer.httpServer?.close()
        }

        if (mainServer) {
            Console.log('Closing main server...')
            await Promise.race([
                new Promise<void>(resolve => {
                    mainServer?.close(() => {
                        Console.log('✅ Server closed successfully')
                        resolve()
                    })
                }),
                new Promise<void>(resolve => setTimeout(resolve, 1000)),
            ])
        }
    } catch (error) {
        Console.error('Error during shutdown:', error)
    } finally {
        clearTimeout(forceExitTimer)
        Console.log('👋 Goodbye!')
        process.exit(ExitCode.SUCCESS)
    }
}

// Register signal handlers only once to prevent memory leaks on HMR
if (!signalHandlersRegistered) {
    signalHandlersRegistered = true

    process.on('SIGTERM', () => void shutdownServer('SIGTERM'))
    process.on('SIGINT', () => void shutdownServer('SIGINT'))
    process.on('SIGHUP', () => void shutdownServer('SIGHUP'))
    process.on('disconnect', () => void shutdownServer('DISCONNECT'))
    process.on('beforeExit', () => void shutdownServer('BEFORE_EXIT'))
    process.on('exit', () => {
        if (!isShuttingDown) {
            Console.log('Process exiting...')
        }
    })
}

// Detect when stdin closes (parent process terminated)
process.stdin.on('end', () => {
    Console.log('stdin closed, parent process terminated, shutting down...')
    void shutdownServer('STDIN_CLOSED')
})

// Monitor parent process - exit if parent dies (VSCode task terminated)
const initialParentPid = process.ppid

function checkParentProcessAlive(): void {
    const currentParentPid = process.ppid

    // If we got re-parented to init (PID 1), our parent died
    if (currentParentPid === 1) {
        Console.log('Process was re-parented to init (orphaned), shutting down...')
        void shutdownServer('ORPHANED')
        return
    }

    // If ppid changed from initial value, parent process died and we got re-parented
    if (currentParentPid !== initialParentPid) {
        Console.log(
            `Parent process changed (${initialParentPid} → ${currentParentPid}), shutting down...`
        )
        void shutdownServer('PPID_CHANGED')
        return
    }

    // Double-check if original parent still exists
    try {
        // On Unix, kill(pid, 0) tests if process exists
        process.kill(initialParentPid, 0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // ESRCH means process doesn't exist
        if (error.code === 'ESRCH') {
            Console.log('Parent process no longer exists, shutting down...')
            void shutdownServer('PPID_GONE')
        }
    }
}

// Clear previous monitor if exists (HMR scenario)
if (parentProcessMonitor) {
    clearInterval(parentProcessMonitor)
}

// Check parent every 100ms for faster response
parentProcessMonitor = setInterval(checkParentProcessAlive, 100)

// Only start server on initial load, not on HMR
if (!mainServer) {
    await web()
}

export default async function web(): Promise<void> {
    // Close existing servers from previous run
    if (viteDevServer) {
        await viteDevServer.close()
        viteDevServer = null
    }

    if (vitePreviewServer) {
        vitePreviewServer.httpServer?.close()
        vitePreviewServer = null
    }

    if (mainServer) {
        await new Promise<void>(resolve => {
            mainServer?.close(() => resolve())
            setTimeout(() => resolve(), CLI_CONSTANTS.FORCE_EXIT_TIMEOUT_MS)
        })
        mainServer = null
    }

    const argv = await yargs(hideBin(process.argv))
        .option('port', {
            type: 'number',
            default: CLI_CONSTANTS.DEFAULT_WEB_PORT,
        })
        .option('open', {
            type: 'boolean',
            default: false,
        })
        .option('host', {
            type: 'boolean',
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
        return getConfig({ devNameID, skyRootPath, skyConfig, skyAppConfig, port, ssr: true })
    }

    if (command === 'build') {
        // Build Panda CSS
        const pandaConfigPath = path.resolve(
            skyRootPath,
            skyAppConfig.path,
            'x/design-system/brand.panda.ts'
        )

        if (fs.existsSync(pandaConfigPath)) {
            Console.log('🐼 Building Panda CSS...')
            // child_process.execSync(`npx panda --config ${pandaConfigPath}`, {
            //     cwd: path.resolve(skyRootPath, skyAppConfig.path),
            //     stdio: 'inherit',
            // })
        }

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
            await runtime

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
            // Start Panda CSS watch
            const pandaConfigPath = path.resolve(
                skyRootPath,
                skyAppConfig.path,
                'x/design-system/brand.panda.ts'
            )

            if (fs.existsSync(pandaConfigPath)) {
                Console.log('🐼 Starting Panda CSS watch...')
                pandaProcess = child_process.spawn(
                    'npx',
                    ['panda', '--watch', '--config', pandaConfigPath],
                    {
                        cwd: path.resolve(skyRootPath, skyAppConfig.path),
                        stdio: 'inherit',
                        shell: true,
                    }
                )

                pandaProcess.on('error', error => {
                    Console.error('Panda CSS error:', error)
                })
            }

            if (skyAppConfig.target === 'universal') {
                viteDevServer = await vite.createServer(await getClientConfig())
                app.use(viteDevServer.middlewares)
                app.use(sirv(path.resolve(skyRootPath, skyAppConfig.path)))
            } else {
                const { devMiddleware } = await createDevMiddleware({
                    viteConfig: await getClientConfig(),
                })
                app.use(devMiddleware)
            }
        } else if (command === 'preview') {
            vitePreviewServer = await vite.preview(await getClientConfig())
            app.use(vitePreviewServer.middlewares)
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

        mainServer = app.listen(port, host ? '0.0.0.0' : '127.0.0.1', (err?: Error) => {
            if (err) {
                Console.error('❌ Failed to start server:', err)
                process.exit(ExitCode.GENERIC_ERROR)
            }
        })

        mainServer.on('error', (err: Error) => {
            Console.error('❌ Server error:', err)
            process.exit(ExitCode.GENERIC_ERROR)
        })

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

    // Collect all peerDependencies from modules for dedupe
    const peerDeps = new Set<string>()

    for (const moduleKey of Object.keys(skyConfig.modules)) {
        const modulePath = path.resolve(skyRootPath, skyConfig.modules[moduleKey].path)
        const packageJsonPath = path.join(modulePath, 'package.json')

        if (fs.existsSync(packageJsonPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

                if (pkg.peerDependencies) {
                    Object.keys(pkg.peerDependencies).forEach(dep => peerDeps.add(dep))
                }
            } catch {
                // Ignore errors reading package.json
            }
        }
    }

    const plugins: vite.InlineConfig['plugins'] = [telefuncPlugin(), tailwindPlugin()]

    // Add vite-plugin-pages first for universal target to register virtual module
    if (skyAppConfig.target === 'universal') {
        const Pages = (await import('vite-plugin-pages')).default
        plugins.push(
            Pages({
                dirs: [path.resolve(skyAppConfig.path, 'screens')],
                extensions: ['tsx', 'jsx'],
                importMode: 'sync',
                moduleId: '~screens/index',
            })
        )
    }

    const resolve: vite.InlineConfig['resolve'] = {
        dedupe: Array.from(peerDeps),
        conditions: ssr ? ['node', 'import'] : ['browser', 'module', 'import'],
        alias: [
            ...Object.keys(skyConfig.modules).map(k => ({
                find: 'pkgs',
                replacement: path.resolve(skyRootPath, skyConfig.modules[k].path, 'pkgs'),
            })),
            {
                find: '#defines',
                replacement: path.resolve(skyRootPath, '.dev/defines'),
            },
            ...Object.keys(skyConfig.modules).map(k => ({
                find: `~${k}`,
                replacement: path.resolve(skyRootPath, skyConfig.modules[k].path),
            })),
            ...Object.keys(skyConfig.apps).map(k => ({
                find: `~${k}`,
                replacement: path.resolve(skyRootPath, skyConfig.apps[k].path),
            })),
            {
                find: '~project',
                replacement: path.resolve(skyRootPath, skyAppConfig.path),
            },
            {
                find: '~x',
                replacement: path.resolve(skyRootPath, skyAppConfig.path + '/x'),
            },
            {
                find: '~public',
                replacement: path.resolve(skyRootPath, skyAppConfig.public),
            },
        ],
    }

    if (skyAppConfig.target === 'universal') {
        ;(<vite.Alias[]>resolve.alias).push({
            find: /^react-native$/,
            replacement: path.resolve(skyRootPath, 'node_modules/react-native-web'),
        })
    } else {
        const vike = (await import('vike/plugin')).default
        plugins.push(vike())
        // @ts-expect-error
        plugins.push(visualizer({ open: true, filename: 'bundle-analysis.html' }))
    }

    if (skyAppConfig.jsx === 'react') {
        plugins.push(
            react({
                exclude: /node_modules/,
                babel: {
                    parserOpts: {
                        plugins: ['classProperties', 'decorators'],
                    },
                    compact: true,
                },
            })
        )
    }

    const root = path.resolve(skyRootPath, skyAppConfig.path)

    const build: vite.InlineConfig['build'] = {
        assetsDir: 'static',
        emptyOutDir: true,
        outDir: path.resolve(`.dev/build/${devNameID}/web`),
        target: 'esnext',
        sourcemap: false,
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
        cacheDir: path.resolve(skyRootPath, `.dev/build/${devNameID}/vite`),
        esbuild: {
            minifyIdentifiers: false,
            keepNames: true,
            jsx: skyAppConfig.jsx === 'qwik' ? 'preserve' : 'automatic',
            supported: {
                'top-level-await': true,
            },
            sourcemap: false,
        },
        optimizeDeps: {
            exclude: ssr ? [] : ['~screens/index'],
            esbuildOptions: {
                target: 'es2020',
                supported: {
                    'top-level-await': true,
                },
            },
        },
        build,
        css: {
            postcss: {
                plugins: [
                    cssnano({
                        preset: 'default',
                    }),
                ],
            },
        },
        preview: {
            port,
        },
        publicDir: path.resolve(skyRootPath, skyAppConfig.public),
        server: {
            cors: true,
            middlewareMode: true,
        },
    }

    return config
}
