#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path')

const args = require('args')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

args.option('port', 'The port on which the app will be running', 3000)
args.option('open', 'Open in browser', true)

const name = process.argv[2]

if (name == null || name === '') {
    // eslint-disable-next-line no-console
    console.error('missing app name')
    // eslint-disable-next-line
    return
}

const loadTsConfig = require('./-loadTsConfig')

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
    mode: 'production',

    entry: path.resolve(name, 'index'),

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
                                [
                                    path.resolve(__dirname, '../node_modules', '@babel/preset-env'),
                                    {
                                        useBuiltIns: 'entry',
                                        corejs: '3.22',
                                    },
                                ],
                            ],
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
                                exportGlobals: true,
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

        path: path.resolve(process.cwd(), `dist/${name}`),

        clean: {
            keep: 'none',
        },
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true,
        }),
        new CopyPlugin({
            patterns: [{ from: 'public/static', to: 'static' }],
        }),
    ],

    experiments: {
        asyncWebAssembly: true,
    },
})

compiler.run((err, stats) => {
    if (err) {
        console.error(err.stack || err)
        if (err.details) {
            console.error(err.details)
        }
        return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
        console.error(info.errors)
    }

    if (stats.hasWarnings()) {
        console.warn(info.warnings)
    }

    console.log('Build success')
})
