#!/usr/bin/env -S npx tsx
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import args from 'args'
import autoprefixer from 'autoprefixer'
import esbuild, { ServeOptions } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import express from 'express'
import postcss from 'postcss'
import tailwindCss from 'tailwindcss'

import __getAppEntries from './__getAppEntries'
import __loadSkyConfig, { __getAppConfig } from './__loadSkyConfig'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

        const entries = __getAppEntries(skyAppConfig)

        //fs.rmSync(`.sky/${skyAppConfig.name}/browser`, { recursive: true, force: true })
        const context = await esbuild.context({
            entryPoints: entries,
            bundle: true,
            splitting: true,
            minify: false,
            sourcemap: true,
            outdir: `.sky/${skyAppConfig.name}/browser`,
            treeShaking: true,
            keepNames: true,
            format: 'esm',
            target: ['es2022'],
            write: false,
            plugins: [
                sassPlugin({
                    async transform(source, resolveDir) {
                        const { css } = await postcss([tailwindCss, autoprefixer]).process(source, {
                            from: resolveDir,
                        })
                        return css
                    },
                }),
            ],
        })

        await context.watch()
        const serveOptions: ServeOptions = {}

        if (skyAppConfig.public) {
            serveOptions.servedir = skyAppConfig.public
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

        // html
        const htmlPath = skyAppConfig.html ?? path.join(__dirname, 'assets/template.html')
        const htmlTemplate = fs.readFileSync(htmlPath, 'utf-8')

        const app = express()

        if (skyAppConfig.public) {
            app.use(express.static(skyAppConfig.public))
        }

        app.get('/*', (req, res) => {
            res.send(htmlTemplate)
        })

        app.listen(flags.port, '127.0.0.1')
    }
}
