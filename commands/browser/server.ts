import child_process from 'child_process'

import react from '@vitejs/plugin-react'
import { SkyApp } from 'commands/__loadSkyConfig'
import compression from 'compression'
import express from 'express'
import vike from 'vike/plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

const isProduction = process.env.NODE_ENV === 'production'

const skyAppConfig = JSON.parse(process.env.SKY_APP_CONFIG) as SkyApp
const port = JSON.parse(process.env.PORT)
const open = JSON.parse(process.env.OPEN)

startServer()

export async function startServer(): Promise<void> {
    if (isProduction) {
        const app = express()
        app.use(compression())
        const sirv = (await import('sirv')).default
        app.use(sirv(skyAppConfig.public))
        return
    }

    const vite = await import('vite')
    const server = await vite.createServer({
        root: skyAppConfig.path,
        plugins: [react(), vike(), tsconfigPaths()],
    })
    await server.listen(port)
    server.printUrls()
    server.bindCLIShortcuts({ print: true })

    if (open) {
        const start =
            process.platform == 'darwin'
                ? 'open'
                : process.platform == 'win32'
                ? 'start'
                : 'xdg-open'
        child_process.execSync(`${start} http://localhost:${port}`)
    }
}
