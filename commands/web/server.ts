import child_process from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

import { SkyApp } from '../__loadSkyConfig'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'

const skyAppConfig = JSON.parse(process.env.SKY_APP_CONFIG) as SkyApp
const port = JSON.parse(process.env.PORT)
const open = JSON.parse(process.env.OPEN)

await startServer()

if (open) {
    const start =
        process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open'
    child_process.execSync(`${start} http://localhost:${port}`)
}

export async function startServer(): Promise<void> {
    if (isProduction) {
        const express = (await import('express')).default
        const compression = (await import('compression')).default
        const app = express()
        app.use(compression())
        const sirv = (await import('sirv')).default

        if (skyAppConfig.public) {
            app.use(sirv(skyAppConfig.public))
        }

        return
    }

    const vite = await import('vite')
    const server = await vite.createServer({
        root: skyAppConfig.path,
        plugins: [react(), vike()],
        resolve: {
            alias: [
                {
                    find: 'sky',
                    replacement: path.resolve(__dirname, '../..'),
                },
                {
                    find: '@',
                    replacement: path.resolve(skyAppConfig.path),
                },
                {
                    find: skyAppConfig.name,
                    replacement: path.resolve(skyAppConfig.path),
                },
                {
                    find: '(.*)',
                    replacement: path.resolve(__dirname, '../../node_modules'),
                },
            ],
        },
    })
    await server.listen(port)
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
}
