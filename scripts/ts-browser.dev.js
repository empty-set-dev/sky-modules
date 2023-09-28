/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

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
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
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
        filename: 'bundle.[fullhash].js',

        clean: {
            keep: /assets\//,
        },
    },

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

        port: 3000,
    },
    compiler
)

const runServer = async () => {
    // eslint-disable-next-line no-console
    console.log('Starting server...')
    await webpackDevServer.start()
}

runServer()
