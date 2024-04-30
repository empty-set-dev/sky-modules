#!/usr/bin/env -S npx tsx
import path from 'path'
import { fileURLToPath } from 'url'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

import { b, e, purple, red } from './__coloredConsole'
import __getProgressPlugin from './__getProgressPlugin'
import __loadSkyConfig, { __getModuleConfig } from './__loadSkyConfig'
import __loadTsConfig from './__loadTsConfig'
import __sdkPath from './__sdkPath'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sdkNodeModulesPath = path.resolve(__dirname, '../node_modules')

export namespace browser {
    build()

    export async function build(): Promise<void> {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
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

        if (!skyModuleConfig['public']) {
            // eslint-disable-next-line no-console
            console.error('missing app public in "sky.config.json"')
            return
        }

        const tsConfig = __loadTsConfig(name)

        /**
         * @type {Object<string, string>}
         */
        const alias = {}
        /**
         * @type {string[]}
         */
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

        const plugins = [
            __getProgressPlugin(),
            new HtmlWebpackPlugin({
                template:
                    skyModuleConfig['htmlTemplate'] ?? path.join(__sdkPath, 'assets/template.html'),
                inject: 'body',
            }),
        ]

        const compiler = webpack({
            mode: 'production',

            entry: path.resolve(skyModuleConfig.entry),

            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /(node_modules)/,
                        use: [
                            {
                                loader: path.join(sdkNodeModulesPath, 'babel-loader'),
                                options: {
                                    plugins: [(await import('../features/fc/compiler/fc')).default],
                                    presets: [
                                        [
                                            path.join(sdkNodeModulesPath, '@babel/preset-env'),
                                            {
                                                useBuiltIns: 'entry',
                                                corejs: '3.22',
                                            },
                                        ],
                                    ],
                                },
                            },
                            {
                                loader: path.join(sdkNodeModulesPath, 'ts-loader'),
                                options: {
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },

                    {
                        test: /\.module\.(sa|sc|c)ss$/,
                        use: [
                            path.join(sdkNodeModulesPath, 'style-loader'),
                            {
                                loader: path.join(sdkNodeModulesPath, 'css-loader'),
                                options: {
                                    sourceMap: true,
                                    modules: {
                                        mode: 'local',
                                        localIdentName: '[local]',
                                        exportGlobals: true,
                                    },
                                    importLoaders: 2,
                                },
                            },
                            {
                                loader: path.join(sdkNodeModulesPath, 'postcss-loader'),
                                options: {
                                    postcssOptions: {
                                        plugins: [
                                            path.join(sdkNodeModulesPath, 'tailwindcss'),
                                            path.join(sdkNodeModulesPath, 'autoprefixer'),
                                        ],
                                    },
                                },
                            },
                            path.join(sdkNodeModulesPath, 'sass-loader'),
                        ],
                    },

                    {
                        test: /\.(sa|sc|c)ss$/,
                        exclude: /\.module\.(sa|sc|c)ss$/,
                        use: [
                            path.join(sdkNodeModulesPath, 'style-loader'),
                            path.join(sdkNodeModulesPath, 'css-loader'),
                            path.join(sdkNodeModulesPath, 'postcss-loader'),
                            path.join(sdkNodeModulesPath, 'sass-loader'),
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
                extensions: ['.tsx', '.ts', '.js', '.json', '.css', '.scss'],

                alias,

                modules: ['node_modules/', './', sdkNodeModulesPath, ...modules],
            },

            output: {
                filename: 'bundle.[fullhash:8].js',

                path: path.resolve(`.sky/${name}/browser`),

                clean: {
                    keep: 'none',
                },
            },

            plugins,

            experiments: {
                asyncWebAssembly: true,
            },

            cache: true,
        })

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
            }
        })
    }
}
