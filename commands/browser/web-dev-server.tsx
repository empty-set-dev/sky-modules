import child_process from 'child_process'
import fs from 'fs'
import path from 'path'

import args from 'args'
import autoprefixer from 'autoprefixer'
import __loadSkyConfig, { __getAppConfig } from 'commands/__loadSkyConfig'
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

interface WebDevServerOptions {
    pagesPath: string
    port: number
    public?: string
    open?: boolean
}
class WebDevServer {
    entries: ReturnType<typeof __getBrowserEntries>
    result: esbuild.BuildResult
    jsBundles: Record<string, string>
    cssBundles: Record<string, string[]>
    app: Express.Application

    constructor(options: WebDevServerOptions) {
        const entries = (this.entries = __getBrowserEntries(options.pagesPath))

        esbuild
            .context({
                entryPoints: entries.map(entry => entry.entry),
                bundle: true,
                splitting: true,
                minify: true,
                sourcemap: true,
                treeShaking: true,
                keepNames: true,
                metafile: true,
                format: 'esm',
                target: ['es2022'],
                write: false,
                outdir: '.',
                plugins: [
                    sassPlugin({
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
                            build.onEnd(result => {
                                if (result.errors.length > 0) {
                                    return
                                }

                                // eslint-disable-next-line no-console
                                console.clear()
                                // eslint-disable-next-line no-console
                                console.log('Watching...', `http://localhost:${options.port}`)

                                this.result = result
                                this.onBuild()
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

        // if (skyAppConfig.public) {
        //     app.use(express.static(skyAppConfig.public))
        // }

        // app.get('*', (req, res) => {
        //     this.onRequest(req, res)
        // })
        app.listen(options.port)

        // eslint-disable-next-line no-console
        console.clear()
        // eslint-disable-next-line no-console
        console.log('Watching...', `http://localhost:${options.port}`)

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

    getOutputByEntryPoint(entry: string): [string, (typeof this.result.metafile.outputs)[0]] {
        const k = Object.keys(this.result.metafile.outputs).find(k => {
            const output = this.result.metafile.outputs[k]
            return output.entryPoint === entry
        })

        return [k, this.result.metafile.outputs[k]]
    }

    async onBuild(): Promise<void> {
        this.jsBundles = {}
        this.cssBundles = {}

        this.entries.forEach(entry => {
            const [jsBundle, output] = this.getOutputByEntryPoint(entry.entry)

            this.jsBundles[entry.entry] = jsBundle

            if (output.cssBundle) {
                const { inputs } = this.result.metafile.outputs[output.cssBundle]
                const cssBundles = Object.keys(inputs).map(
                    input => this.getOutputByEntryPoint(input)[1].cssBundle
                )

                this.cssBundles[entry.entry] = cssBundles
            }

            return output
        })
    }

    async onRequest(req: express.Request, res: express.Response): Promise<void> {
        if (!this.result) {
            setTimeout(() => {
                this.onRequest(req, res)
            }, 100)

            return
        }

        const filePath = path.join(process.cwd(), req.originalUrl)
        const fileMetadata = this.result.outputFiles.find(file => file.path === filePath)

        if (!fileMetadata) {
            res.sendStatus(404)
            return
        }

        if (filePath.endsWith('.js')) {
            res.setHeader('content-type', 'text/javascript')
        }

        res.send(fileMetadata.text)
    }

    async onRequestPage(
        entry: (typeof this.entries)[0],
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        if (!this.result) {
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

        const Page = await entry.getComponent()
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
    pagesPath,
    port: flags.port,
    public: skyAppConfig.public,
    open: flags.open,
})
