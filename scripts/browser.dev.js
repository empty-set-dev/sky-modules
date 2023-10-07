/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path')

const args = require('args')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Open in browser', true)

const flags = args.parse(process.argv, {
    mainColor: 'red',
    name: 'node %modules%/scripts/ts-browser.dev',
})

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
                        loader: path.resolve(__dirname, '../node_modules', 'babel-loader'),
                        options: {
                            plugins: [require('./`Fc')],
                        },
                    },
                    {
                        loader: path.resolve(__dirname, '../node_modules', 'ts-loader'),
                        options: {
                            transpileOnly: true,
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
                            },
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: path.resolve(__dirname, '../node_modules', 'postcss-loader'),
                        options: {
                            postcssOptions: {
                                plugins: [
                                    path.resolve(__dirname, '../node_modules/tailwindcss'),
                                    path.resolve(__dirname, '../node_modules/autoprefixer')
                                ]
                            }
                        }
                    },
                    path.resolve(__dirname, '../node_modules', 'sass-loader'),
                ],
            },

            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /\.module\.(sa|sc|c)ss$/,
                use: [
                    path.resolve(__dirname, '../node_modules', 'style-loader'),
                    path.resolve(__dirname, '../node_modules', 'css-loader'),
                    path.resolve(__dirname, '../node_modules', 'postcss-loader'),
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

        modules: ['node_modules/', './', path.resolve(__dirname, '../node_modules/'), ...modules],
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

const runServer = async () => {
    // eslint-disable-next-line no-console
    console.log('Starting server...')
    await webpackDevServer.start()
}

runServer()
