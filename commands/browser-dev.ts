#!/usr/bin/env -S npx tsx
import path from 'path'
import { fileURLToPath } from 'url'

import args from 'args'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import __loadSkyConfig, { __getModuleConfig } from './__loadSkyConfig'
import __loadTsConfig from './__loadTsConfig'
import __sdkPath from './__sdkPath'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Open in browser', true)

const sdkNodeModulesPath = path.resolve(__dirname, '../node_modules')

const flags = args.parse(process.argv, {
    name: 'sky browser dev',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

export namespace browser {
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

        if (!skyModuleConfig['public']) {
            // eslint-disable-next-line no-console
            console.error('missing app public in "sky.config.json"')
            return
        }

        const tsConfig = __loadTsConfig(name)

        const alias = {}
        const modules = []

        const plugins = [
            new HtmlWebpackPlugin({
                template:
                    skyModuleConfig['htmlTemplate'] ?? path.join(__sdkPath, 'assets/template.html'),
                inject: 'body',
            }),
        ]

        {
            const paths = tsConfig?.compilerOptions?.paths
            paths &&
                Object.keys(paths).forEach(k => {
                    const v = paths[k].map(v => v.replaceAll('*', '')).filter(path_ => path_ !== '')
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
                                    plugins: [require('../features/fc/compiler/fc')],
                                    presets: [
                                        path.join(sdkNodeModulesPath, '@babel/preset-typescript'),
                                        path.join(sdkNodeModulesPath, '@babel/preset-react'),
                                        [
                                            path.join(sdkNodeModulesPath, '@babel/preset-env'),
                                            {
                                                useBuiltIns: 'usage',
                                                targets: '> 0.25%, not dead',
                                                corejs: '3.33.1',
                                            },
                                        ],
                                    ],
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
                filename: 'bundle.js',

                clean: {
                    keep: 'none',
                },
            },

            devtool: 'eval-source-map',

            plugins,

            experiments: {
                asyncWebAssembly: true,
            },

            cache: true,

            stats: 'minimal',
        })

        const webpackDevServer = new WebpackDevServer(
            {
                client: {
                    progress: true,
                    reconnect: true,
                    overlay: {
                        errors: true,
                        warnings: false,
                        runtimeErrors: true,
                    },
                },
                open: flags.open,
                port: flags.port,
                proxy: {
                    '/api': {
                        target: 'http://127.0.0.1:3001',
                        secure: false,
                        changeOrigin: true,
                        logLevel: 'debug',
                    },
                },
                historyApiFallback: true,
                static: skyModuleConfig['public'],
            },
            compiler
        )

        webpackDevServer.start()
    }
}
