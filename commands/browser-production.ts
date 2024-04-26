#!/usr/bin/env tsx
import path from 'path'

import express from 'express'
import proxy from 'express-http-proxy'

export namespace browser {
    production()

    export function production(): void {
        const apiProxy = proxy('127.0.0.1:3001', {
            proxyReqPathResolver: req => req.originalUrl,
        })

        const name = process.argv[4]

        if (name == null || name === '') {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const app = express()

        app.use('/api/*', apiProxy)
        app.use(express.static(path.join(process.cwd(), `dist/${name}`)))
        app.get('/*', function (req, res) {
            res.sendFile(path.join(process.cwd(), `dist/${name}`, 'index.html'))
        })

        app.listen(80)
    }
}
