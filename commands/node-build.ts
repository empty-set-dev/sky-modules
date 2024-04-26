#!/usr/bin/env tsx
import path from 'path'

import webpack from 'webpack'

import __loadTsConfig from './__loadTsConfig'

export namespace node {
    build()

    export function build(): void {
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
                    const v = paths[k].map(v => v.replaceAll('*', ''))
                    k = k.replaceAll('*', '')
                    if (k === '') {
                        modules.push(...v)
                        return
                    }
                    alias[k] = v
                })
        }

        const compiler = webpack({
            mode: 'production',

            node: {
                global: true,
            },

            entry: path.resolve(name, 'index'),

            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: [
                            {
                                loader: path.resolve(__dirname, '../node_modules', 'ts-loader'),
                                options: {
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },

                    {
                        test: /\.json$/,
                        use: [path.resolve(__dirname, '../node_modules', 'json-loader')],
                        type: 'javascript/auto',
                    },

                    {
                        test: /\.html$/,
                        use: 'raw-loader',
                    },
                ],
            },

            resolve: {
                extensions: ['.tsx', '.ts', '.js', '.json'],

                alias,

                modules: [
                    'node_modules/',
                    './',
                    path.resolve(__dirname, '../node_modules/'),
                    ...modules,
                ],

                fallback: {
                    assert: false,
                    async_hooks: false,
                    fs: false,
                    tls: false,
                    net: false,
                    child_process: false,
                    buffer: false,
                    console: false,
                    constants: false,
                    crypto: false,
                    domain: false,
                    events: false,
                    http: false,
                    https: false,
                    os: false,
                    path: false,
                    punycode: false,
                    process: false,
                    querystring: false,
                    stream: false,
                    string_decoder: false,
                    sys: false,
                    timers: false,
                    tty: false,
                    url: false,
                    util: false,
                    vm: false,
                    zlib: false,
                    cluster: false,
                    nock: false,
                    'aws-sdk': false,
                    'mock-aws-s3': false,
                },
            },

            output: {
                filename: 'bundle.js',

                path: path.resolve(process.cwd(), `dist/${name}`),

                publicPath: '',

                globalObject: 'this',

                clean: {
                    keep: 'none',
                },
            },

            plugins: [
                new webpack.ProgressPlugin({
                    activeModules: false,
                    entries: true,
                    handler(percentage, message): void {
                        const b = '\x1b['
                        const e = '\x1b[0m'
                        // eslint-disable-next-line no-console
                        console.clear()
                        // eslint-disable-next-line no-console
                        console.log(`${b}${'35;1m'}${(percentage * 100).toFixed(1)}%${e}`, message)
                    },
                    modules: true,
                    modulesCount: 5000,
                    profile: false,
                    dependencies: true,
                    dependenciesCount: 10000,
                    percentBy: null,
                }),
            ],

            experiments: {
                asyncWebAssembly: true,
            },
        })

        compiler.run((err, stats) => {
            if (err) {
                // eslint-disable-next-line no-console
                console.error(err.stack || err)
                const errWithDetails = err as Error & { details: unknown }
                if (errWithDetails.details) {
                    // eslint-disable-next-line no-console
                    console.error(errWithDetails.details)
                }
                return
            }

            const info = stats.toJson()

            if (stats.hasErrors()) {
                // eslint-disable-next-line no-console
                console.error(info.errors)
            } else {
                if (stats.hasWarnings()) {
                    const b = '\x1b['
                    const e = '\x1b[0m'
                    // eslint-disable-next-line no-console
                    console.warn(`${b}${'35;1m'}`, info.warnings, `${e}`)
                }

                // eslint-disable-next-line no-console
                console.log('Build success')
            }
        })

        // eslint-disable-next-line no-console
        console.log(path.resolve(process.cwd(), `dist/${name}`))
    }
}
