#!/usr/bin/env tsx
import path from 'path'

import express from 'express'
import proxy from 'express-http-proxy'

import { b, e, purple } from './__coloredConsole'
import __loadSkyConfig, { __getModuleConfig } from './__loadSkyConfig'

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

        const apiProxy = proxy('127.0.0.1:3001', {
            proxyReqPathResolver: req => req.originalUrl,
        })

        app.use('/api/*', apiProxy)
        app.use(express.static(path.resolve(`.sky/${name}`)))
        app.use(express.static(path.resolve(skyModuleConfig['public'])))
        app.get('/*', function (req, res) {
            res.sendFile(path.resolve(`.sky/${name}`, 'index.html'))
        })

        app.listen(3000)

        process.stdout.write(`${b}${purple}Server started${e} 👌\n`)
        process.stdout.write(`${b}${purple}http://localhost:3000${e}\n`)
    }
}
