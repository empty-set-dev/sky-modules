#!/usr/bin/env -S npx tsx
import path from 'path'
import { fileURLToPath } from 'url'

import webpack from 'webpack'

import { b, e, red, purple } from './__coloredConsole'
import __loadSkyConfig, { __getModuleConfig } from './__loadSkyConfig'
import __loadTsConfig from './__loadTsConfig'
import __run from './__run'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sdkNodeModulesPath = path.resolve(__dirname, '../node_modules')

export namespace node {
    dev()

    export function dev(): void {
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

        const skyModuleConfig = __getModuleConfig(name, skyConfig)

        if (!skyModuleConfig) {
            return
        }

        const tsConfig = __loadTsConfig(name)

        const alias = {}
        const modules: string[] = []

        {
            const paths = tsConfig?.compilerOptions?.paths
            paths &&
                Object.keys(paths).forEach(k => {
                    const v = paths[k].map(v => path.resolve(v.replaceAll('*', '')))
                    k = k.replaceAll('*', '')
                    if (k === '') {
                        modules.push(...v)
                        return
                    }
                    alias[k] = v
                })
        }

        const compiler = webpack({
            mode: 'development',

            target: 'node',

            entry: path.resolve(skyModuleConfig.entry),

            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /(node_modules)/,
                        use: [
                            {
                                loader: path.join(sdkNodeModulesPath, 'ts-loader'),
                                options: {
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },

                    {
                        test: /\.json$/,
                        use: [path.join(sdkNodeModulesPath, 'json-loader')],
                        type: 'javascript/auto',
                    },

                    {
                        test: /\.(woff2)$/,
                        type: 'asset',
                    },

                    {
                        test: /\.(svg|mp4|gif|png|jpg|jpeg|woff2)$/,
                        type: 'asset/resource',
                    },
                ],
            },

            resolve: {
                extensions: ['.tsx', '.ts', '.js', '.json'],

                alias,

                modules: ['node_modules/', './', sdkNodeModulesPath, ...modules],
            },

            output: {
                filename: 'bundle.js',

                path: path.resolve(`.sky/${name}/node`),

                clean: {
                    keep: 'none',
                },
            },

            experiments: {
                asyncWebAssembly: true,
            },

            cache: true,
        })

        let runner

        compiler.run((err_, stats_) => {
            const err = err_ as Error & { details: string }
            const stats = stats_!

            if (err) {
                // eslint-disable-next-line no-console
                console.error(err.stack || err)
                if (err.details) {
                    // eslint-disable-next-line no-console
                    console.error(err.details)
                }
                return
            }

            const info = stats.toJson()

            if (stats.hasWarnings()) {
                for (const warn of info.warnings!) {
                    // eslint-disable-next-line no-console
                    console.warn(warn)
                }
            }

            if (stats.hasErrors()) {
                for (const error of info.errors!) {
                    // eslint-disable-next-line no-console
                    console.error(error)
                }
                process.stdout.write(`${b}${red}Build failed${e}\n`)
            } else {
                process.stdout.write(`${b}${purple}Build success${e} 👌\n`)

                if (!runner) {
                    runner = __run(`node --watch  --expose-gc .sky/${name}/node/bundle.js`)
                }
            }
        })
    }
}
