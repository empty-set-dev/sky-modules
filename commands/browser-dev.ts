#!/usr/bin/env -S npx tsx
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'

import args from 'args'
import autoprefixer from 'autoprefixer'
import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import express from 'express'
import postcss from 'postcss'
import tailwindCss from 'tailwindcss'

import { __getBrowserEntries } from './__getAppEntry'
import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Open in browser', false)

const flags = args.parse(process.argv, {
    name: 'sky browser dev',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace browser {
    dev()

    export async function dev(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const skyConfig = __loadSkyConfig()

        if (!skyConfig) {
            return
        }

        const skyAppConfig = __getAppConfig(name, skyConfig)

        if (!skyAppConfig) {
            return
        }

        const pagesPath = path.join(skyAppConfig.path, 'pages')

        if (!fs.existsSync(pagesPath)) {
            // eslint-disable-next-line no-console
            console.error('pages not found')
        }

        const stat = fs.statSync(pagesPath)

        if (!stat.isDirectory()) {
            // eslint-disable-next-line no-console
            console.error('pages not found')
        }

        const entries = __getBrowserEntries(pagesPath)
        console.log(entries)

        class WebDevServer {
            result: esbuild.BuildResult
            app: Express.Application

            constructor() {
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
                                    const { css } = await postcss([
                                        tailwindCss,
                                        autoprefixer,
                                    ]).process(source, {
                                        from: resolveDir,
                                    })

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
                app.listen(flags.port)

                if (skyAppConfig.public) {
                    app.use(express.static(skyAppConfig.public))
                }

                // eslint-disable-next-line no-console
                console.log('Watching...', `http://localhost:${flags.port}`)

                if (flags.open) {
                    const start =
                        process.platform == 'darwin'
                            ? 'open'
                            : process.platform == 'win32'
                            ? 'start'
                            : 'xdg-open'
                    child_process.execSync(`${start} http://localhost:${flags.port}`)
                }
            }

            async onBuild(): Promise<void> {
                console.log(this.result.metafile.outputs)
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
    }
}
