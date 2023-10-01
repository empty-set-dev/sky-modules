/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path')

const args = require('args')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

args.option('port', 'The port on which the app will be running', 3000)

const flags = args.parse(process.argv)

const name = process.argv[2]

if (name == null || name === '') {
    // eslint-disable-next-line no-console
    console.error('missing app name')
    return
}

const loadTsConfig = require('./`loadTsConfig')

const tsConfig = loadTsConfig(name)

/**
 * @type {Object<string, string>}
 */
const alias = {}
/**
 * @type {string[]}
 */
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
    mode: 'development',

    entry: path.resolve(name, 'index'),

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },

            {
                test: /\.module\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: {
                                mode: 'local',
                                localIdentName: '[local]',
                            },
                            importLoaders: 1,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },

            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /\.module\.(sa|sc|c)ss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },

            {
                test: [/\.png/, /\.svg/],
                type: 'asset/resource',
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],

        alias,

        modules: ['node_modules', './', ...modules],
    },

    output: {
        filename: 'bundle.js',

        clean: {
            keep: /assets\//,
        },
    },

    devtool: 'inline-source-map',

    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true,
        }),
    ],

    experiments: {
        asyncWebAssembly: true,
    },
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
        open: true,
        port: flags.port ?? 3000,
        proxy: {
            '/api': 'http://127.0.0.1:3001',
        },
        historyApiFallback: true,
    },
    compiler
)

const runServer = async () => {
    // eslint-disable-next-line no-console
    console.log('Starting server...')
    await webpackDevServer.start()
}

runServer()
