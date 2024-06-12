import compression from 'compression'
import express from 'express'
import { renderPage } from 'vike/server'

const isProduction = process.env.NODE_ENV === 'production'

export interface StartServerOptions {
    root: string
    port: number
}
export async function startServer(options: StartServerOptions): Promise<void> {
    const { root, port } = options

    const app = express()

    app.use(compression())

    if (isProduction) {
        const sirv = (await import('sirv')).default
        app.use(sirv(root))
    } else {
        const vite = await import('vite')
        const server = await vite.createServer({
            root,
            server: { middlewareMode: true },
        })
        server.printUrls()
        server.bindCLIShortcuts({ print: true })

        app.use(server.middlewares)
    }

    app.get('*', async (req, res, next) => {
        const pageContextInit = {
            urlOriginal: req.originalUrl,
        }
        const pageContext = await renderPage(pageContextInit)

        if (pageContext.errorWhileRendering) {
            // eslint-disable-next-line no-console
            console.error(pageContext.errorWhileRendering)
            res.send(500)
        }

        const { httpResponse } = pageContext
        if (!httpResponse) {
            return next()
        } else {
            const { body, statusCode, headers, earlyHints } = httpResponse

            if (res.writeEarlyHints) {
                res.writeEarlyHints({ link: earlyHints.map(e => e.earlyHintLink) })
            }

            headers.forEach(([name, value]) => res.setHeader(name, value))
            res.status(statusCode)
            res.send(body)
        }
    })

    app.listen(port)

    // eslint-disable-next-line no-console
    console.log(`Running at http://localhost:${port}`)
}
