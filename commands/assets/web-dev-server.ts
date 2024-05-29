import child_process from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import autoprefixer from 'autoprefixer'
import esbuild from 'esbuild'
import manifestPlugin from 'esbuild-plugin-manifest'
import sassPlugin from 'esbuild-sass-plugin'
import express from 'express'
import postcss from 'postcss'
import tailwindCss from 'tailwindcss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Config {
    port: number
    entries: string[]
    public?: string
    open?: boolean
}

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8')) as Config

class WebDevServer {
    result: esbuild.BuildResult
    app: Express.Application

    constructor() {
        esbuild
            .context({
                entryPoints: config.entries,
                bundle: true,
                splitting: true,
                minify: false,
                sourcemap: true,
                treeShaking: true,
                keepNames: true,
                format: 'esm',
                target: ['es2022'],
                write: false,
                outdir: '.',
                plugins: [
                    manifestPlugin(),
                    sassPlugin({
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
                                this.result = result
                                this.onBuild()
                            })
                        },
                    },
                ],
            })
            .then(context => context.watch())

        const app = (this.app = express())
        app.get('*', (req, res) => {
            this.onRequest(req, res)
        })
        app.listen(config.port)

        if (config.public) {
            app.use(express.static(config.public))
        }

        // eslint-disable-next-line no-console
        console.log('Watching...', `http://localhost:${config.port}`)

        if (config.open) {
            const start =
                process.platform == 'darwin'
                    ? 'open'
                    : process.platform == 'win32'
                    ? 'start'
                    : 'xdg-open'
            child_process.execSync(`${start} http://localhost:${config.port}`)
        }
    }

    async onBuild(): Promise<void> {
        console.log(this.result.outputFiles.map(file => file.path))

        console.log(Object.keys(this.result.metafile.outputs).map(k => {
            return this.result.metafile.outputs[k]
                })
                .filter(file => file.entryPoint === 'front-end/index.tsx')[0].imports
        )

        console.log(config.entries)
    }

    async onRequest(req: express.Request, res: express.Response): Promise<void> {
        if (!this.result) {
            res.sendStatus(404)
            return
        }

        const filePath = path.join(process.cwd(), req.originalUrl)
        const fileMetadata = this.result.outputFiles.find(file => file.path === filePath)

        if (!fileMetadata) {
            res.sendStatus(404)
            return
        }

        res.send(fileMetadata.text)
    }
}

new WebDevServer()
