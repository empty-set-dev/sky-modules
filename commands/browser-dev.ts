#!/usr/bin/env -S npx tsx
import child_process from 'child_process'

import args from 'args'
import autoprefixer from 'autoprefixer'
import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import postcss from 'postcss'
import tailwindCss from 'tailwindcss'

import __getAppEntries from './__getAppEntries'
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

        if (!skyAppConfig['public']) {
            // eslint-disable-next-line no-console
            console.error('missing app public in "sky.config.json"')
            return
        }

        const entries = __getAppEntries(skyAppConfig)

        const context = await esbuild.context({
            entryPoints: entries,
            bundle: true,
            splitting: true,
            minify: false,
            sourcemap: true,
            outdir: 'dist',
            treeShaking: true,
            keepNames: true,
            format: 'esm',
            target: ['es2022'],
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
        await context.serve()
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
}
