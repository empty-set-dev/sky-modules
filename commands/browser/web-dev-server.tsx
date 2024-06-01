import child_process from 'child_process'
import fs from 'fs'
import path from 'path'

import args from 'args'
import autoprefixer from 'autoprefixer'
import __loadSkyConfig, { __getAppConfig } from 'commands/__loadSkyConfig'
import __sdkPath from 'commands/__sdkPath'
import compression from 'compression'
import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import express from 'express'
import postcss from 'postcss'
import { renderToPipeableStream } from 'react-dom/server'
import tailwindCss from 'tailwindcss'

import { __getBrowserEntries } from '../__getAppEntry'

args.option('project', '')
args.option('port', '')
args.option('open', '')

const flags = args.parse(process.argv)

const skyConfig = __loadSkyConfig()
const skyAppConfig = __getAppConfig(flags.project, skyConfig)

const pagesPath = path.join(skyAppConfig.path, 'pages')

if (!fs.existsSync(pagesPath)) {
    // eslint-disable-next-line no-console
    throw new Error('pages not found')
}

const stat = fs.statSync(pagesPath)

if (!stat.isDirectory()) {
    // eslint-disable-next-line no-console
    throw new Error('pages not found')
}

const clientOutputPath = `.sky/${skyAppConfig.name}/browser-dev/client`
const serverOutputPath = `.sky/${skyAppConfig.name}/browser-dev/server`

interface WebDevServerOptions {
    name: string
    pagesPath: string
    port: number
    public?: string
    open?: boolean
}
class WebDevServer {
    port: number
    entries: ReturnType<typeof __getBrowserEntries>
    clientBuildResult: esbuild.BuildResult
    serverBuildResult: esbuild.BuildResult
    jsBundles: Record<string, string>
    cssBundles: Record<string, string[]>
    serverJsBundles: Record<string, string>
    app: Express.Application

    constructor(options: WebDevServerOptions) {
        const entries = (this.entries = __getBrowserEntries(options.pagesPath))

        this.port = options.port

        esbuild
            .context({
                entryPoints: entries.map(entry => entry.entry),
                inject: [path.join(__sdkPath, 'commands/browser/inject')],
                bundle: true,
                splitting: true,
                minify: true,
                sourcemap: true,
                treeShaking: true,
                keepNames: true,
                metafile: true,
                format: 'esm',
                target: ['es2022'],
                write: true,
                outdir: clientOutputPath,
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                plugins: [
                    sassPlugin({
                        filter: /\.module\.scss$/,
                        type: 'css',
                        async transform(source, resolveDir) {
                            const { css } = await postcss([tailwindCss, autoprefixer]).process(
                                source,
                                {
                                    from: resolveDir,
                                }
                            )

                            return css
                        },
                    }),
                    sassPlugin({
                        filter: /\.scss$/,
                        type: 'css',
                        async transform(source, resolveDir) {
                            const { css } = await postcss([tailwindCss, autoprefixer]).process(
                                source,
                                {
                                    from: resolveDir,
                                }
                            )

                            return css
                        },
                    }),
                    {
                        name: 'rebuild-notify',
                        setup: (build): void => {
                            build.onEnd(buildResult => {
                                this.clientBuildResult = buildResult

                                if (buildResult.errors.length > 0) {
                                    return
                                }

                                if (
                                    !this.serverBuildResult ||
                                    this.serverBuildResult.errors.length === 0
                                ) {
                                    this.message()
                                }

                                this.onClientBuild()

                                clients.forEach(client => client.write(`data: reload\n\n`))
                            })
                        },
                    },
                ],
            })
            .then(context => context.watch())

        esbuild
            .context({
                entryPoints: entries.map(entry => entry.entry),
                platform: 'node',
                bundle: true,
                splitting: false,
                minify: true,
                sourcemap: true,
                treeShaking: true,
                keepNames: true,
                metafile: true,
                format: 'esm',
                target: ['es2022'],
                write: true,
                outdir: serverOutputPath,
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                plugins: [
                    sassPlugin({
                        filter: /\.module\.scss$/,
                        type: 'css',
                        async transform(source, resolveDir) {
                            const { css } = await postcss([tailwindCss, autoprefixer]).process(
                                source,
                                {
                                    from: resolveDir,
                                }
                            )

                            return css
                        },
                    }),
                    sassPlugin({
                        filter: /\.scss$/,
                        type: 'css',
                        async transform(source, resolveDir) {
                            const { css } = await postcss([tailwindCss, autoprefixer]).process(
                                source,
                                {
                                    from: resolveDir,
                                }
                            )

                            return css
                        },
                    }),
                    {
                        name: 'rebuild-notify',
                        setup: (build): void => {
                            build.onEnd(buildResult => {
                                this.serverBuildResult = buildResult

                                if (buildResult.errors.length > 0) {
                                    return
                                }

                                if (
                                    !this.clientBuildResult ||
                                    this.clientBuildResult.errors.length === 0
                                ) {
                                    this.message()
                                }

                                this.onServerBuild()
                            })
                        },
                    },
                ],
            })
            .then(context => context.watch())

        const app = (this.app = express())
        app.use(compression())

        entries.forEach(entry => {
            app.get(entry.path, (req, res) => {
                this.onRequestPage(entry, req, res)
            })
        })
        app.use(express.static(clientOutputPath))

        if (skyAppConfig.public) {
            app.use(express.static(skyAppConfig.public))
        }

        const clients = []
        app.get('/esbuild', (request, response) => {
            response.setHeader('Connection', 'keep-alive')
            response.setHeader('Content-Type', 'text/event-stream')
            response.setHeader('Cache-Control', 'no-cache')
            clients.push(response)
        })

        app.listen(options.port)

        this.message()

        if (options.open) {
            const start =
                process.platform == 'darwin'
                    ? 'open'
                    : process.platform == 'win32'
                    ? 'start'
                    : 'xdg-open'
            child_process.execSync(`${start} http://localhost:${options.port}`)
        }
    }

    message(): void {
        // eslint-disable-next-line no-console
        console.clear()
        // eslint-disable-next-line no-console
        console.log('Watching...', `http://localhost:${this.port}`)
    }

    getOutputByEntryPoint(
        entry: string,
        buildResult: esbuild.BuildResult
    ): [string, (typeof buildResult.metafile.outputs)[0]] {
        const k = Object.keys(buildResult.metafile.outputs).find(k => {
            const output = buildResult.metafile.outputs[k]
            return output.entryPoint === entry
        })

        return [k, buildResult.metafile.outputs[k]]
    }

    async onClientBuild(): Promise<void> {
        this.jsBundles = {}
        this.cssBundles = {}

        this.entries.forEach(entry => {
            const [jsBundle, output] = this.getOutputByEntryPoint(
                entry.entry,
                this.clientBuildResult
            )

            this.jsBundles[entry.entry] = path.relative(clientOutputPath, jsBundle)

            if (output.cssBundle) {
                const { inputs } = this.clientBuildResult.metafile.outputs[output.cssBundle]
                const cssBundles = Object.keys(inputs).map(input =>
                    path.relative(
                        clientOutputPath,
                        this.getOutputByEntryPoint(input, this.clientBuildResult)[1].cssBundle
                    )
                )

                this.cssBundles[entry.entry] = cssBundles
            }

            return output
        })
    }

    async onServerBuild(): Promise<void> {
        this.serverJsBundles = {}

        this.entries.forEach(entry => {
            const [jsBundle, output] = this.getOutputByEntryPoint(
                entry.entry,
                this.serverBuildResult
            )

            this.serverJsBundles[entry.entry] = jsBundle

            return output
        })
    }

    async onRequestPage(
        entry: (typeof this.entries)[0],
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        if (!this.clientBuildResult || !this.serverBuildResult) {
            setTimeout(() => {
                this.onRequestPage(entry, req, res)
            }, 100)

            return
        }

        const styles = this.cssBundles[entry.entry] ? (
            <>
                {this.cssBundles[entry.entry].map((cssBundle, i) => (
                    <link key={i} rel="stylesheet" href={`/${cssBundle}`} />
                ))}
            </>
        ) : (
            []
        )

        const script = <script type="module" src={`/${this.jsBundles[entry.entry]}`} />

        const Page = (await import(this.serverJsBundles[entry.entry])).default
        const { pipe } = renderToPipeableStream(
            <>
                <Page styles={styles} scripts={script} />
            </>,
            {
                onShellReady() {
                    res.setHeader('content-type', 'text/html')
                    pipe(res)
                },
            }
        )
    }
}

new WebDevServer({
    name: flags.project,
    pagesPath,
    port: flags.port,
    public: skyAppConfig.public,
    open: flags.open,
})
