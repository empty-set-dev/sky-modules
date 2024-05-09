#!/usr/bin/env -S npx tsx
import path from 'path'

import args from 'args'
import express from 'express'
import proxy from 'express-http-proxy'

import { b, e, purple } from './__coloredConsole'
import __loadSkyConfig, { __getModuleConfig } from './__loadSkyConfig'

args.option('port', 'The port on which the app will be running', 3000)
args.option('api-port', 'The api port on which the api will be running', 3001)
args.option('open', 'Open in browser', false)

const flags = args.parse(process.argv, {
    name: 'sky browser dev',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

const port = flags.port ?? 3000
const apiPort = flags.apiPort ?? 3001

export namespace browser {
    production()

    export function production(): void {
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

        const app = express()

        const apiProxy = proxy(`127.0.0.1:${apiPort}`, {
            proxyReqPathResolver: req => req.originalUrl,
        })

        app.use('/api/*', apiProxy)
        app.use(express.static(path.resolve(`.sky/${name}/browser`)))
        app.use(express.static(path.resolve(skyModuleConfig['public'])))
        app.get('/*', function (req, res) {
            res.sendFile(path.resolve(`.sky/${name}/browser`, 'index.html'))
        })

        app.listen(port)

        process.stdout.write(`${b}${purple}Server started${e} 👌\n`)
        process.stdout.write(`${b}${purple}http://localhost:${port}${e}\n`)
    }
}
