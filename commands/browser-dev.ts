#!/usr/bin/env tsx
import path from 'path'
import { fileURLToPath } from 'url'

import args from 'args'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import { b, e, purple } from './__coloredConsole'
import __getEntry from './__getEntry'
import __loadTsConfig from './__loadTsConfig'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Open in browser', true)

const flags = args.parse(process.argv, {
    name: 'sky browser dev',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace browser {
    dev()

    export function dev(): void {
        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const tsConfig = __loadTsConfig(name)

        const alias = {}
        const modules = []

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

        const entryPath = __getEntry(name, ['tsx', 'ts'])

        if (!entryPath) {
            // eslint-disable-next-line no-console
            console.error('no entry')
            return
        }

        const compiler = webpack({
            mode: 'development',

            entry: path.relative(process.cwd(), entryPath),

            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /(node_modules)/,
                        use: [
                            {
                                loader: path.resolve(__dirname, '../node_modules', 'babel-loader'),
                                options: {
                                    plugins: [require('./-Fc')],
                                    presets: [
                                        path.resolve(
                                            __dirname,
                                            '../node_modules',
                                            '@babel/preset-typescript'
                                        ),
                                        path.resolve(
                                            __dirname,
                                            '../node_modules',
                                            '@babel/preset-react'
                                        ),
                                        [
                                            path.resolve(
                                                __dirname,
                                                '../node_modules',
                                                '@babel/preset-env'
                                            ),
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
                            path.resolve(__dirname, '../node_modules', 'style-loader'),
                            {
                                loader: path.resolve(__dirname, '../node_modules', 'css-loader'),
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
                                loader: path.resolve(
                                    __dirname,
                                    '../node_modules',
                                    'postcss-loader'
                                ),
                                options: {
                                    postcssOptions: {
                                        plugins: [
                                            path.resolve(__dirname, '../node_modules/tailwindcss'),
                                            path.resolve(__dirname, '../node_modules/autoprefixer'),
                                        ],
                                    },
                                },
                            },
                            path.resolve(__dirname, '../node_modules', 'sass-loader'),
                        ],
                    },

                    {
                        test: /\.(sa|sc|c)ss$/,
                        exclude: /\.module\.(sa|sc|c)ss$/,
                        use: [
                            path.resolve(__dirname, '../node_modules', 'style-loader'),
                            {
                                loader: path.resolve(__dirname, '../node_modules', 'css-loader'),
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
                                loader: path.resolve(
                                    __dirname,
                                    '../node_modules',
                                    'postcss-loader'
                                ),
                                options: {
                                    postcssOptions: {
                                        plugins: [
                                            path.resolve(__dirname, '../node_modules/tailwindcss'),
                                            path.resolve(__dirname, '../node_modules/autoprefixer'),
                                        ],
                                    },
                                },
                            },
                            path.resolve(__dirname, '../node_modules', 'sass-loader'),
                        ],
                    },

                    {
                        test: /\.json$/,
                        use: [path.resolve(__dirname, '../node_modules', 'json-loader')],
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

                modules: [
                    'node_modules/',
                    './',
                    path.resolve(__dirname, '../node_modules/'),
                    ...modules,
                ],
            },

            output: {
                filename: 'bundle.js',

                clean: {
                    keep: /assets\//,
                },
            },

            devtool: 'eval-source-map',

            plugins: [
                new HtmlWebpackPlugin({
                    template: entryPath.replace(/\.tsx?$/, '.html'),
                    inject: true,
                    publicPath: '/',
                }),
            ],

            experiments: {
                asyncWebAssembly: true,
            },

            cache: false,
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
            },
            compiler
        )

        const runServer = async (): Promise<void> => {
            // eslint-disable-next-line no-console
            console.log('Starting server...')
            process.stdout.write(`${b}${purple}Starting server${e}`)
            await webpackDevServer.start()
            process.stdout.write(` 👌\n`)
        }

        runServer()
    }
}
