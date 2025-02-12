#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import fs from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'

import args from 'args'
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

import { logConsole } from '../helpers/console'

import __loadSkyConfig from './__loadSkyConfig'

args.command('readme', 'Generate md from mdx with navigation', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

process.env.NODE_ENV = 'production'

readme()

async function readme(): Promise<void> {
    const skyConfig = await __loadSkyConfig()

    if (!skyConfig) {
        return
    }

    const menu: {
        name: string
        path: string
        folder: string
        items: unknown[]
    }[] = []

    getMenu('')

    const stringifiedMenu = JSON.stringify(menu)

    convert('').then(() => {
        logConsole('Converted **/*.mdx -> **/README.md')
    })

    function getMenu(folder: string, menu_ = menu): void {
        const dirs = fs.readdirSync(path.resolve(folder))
        dirs.sort((a, b) => {
            const filePathA = path.resolve(folder, a)
            let numA

            if (fs.statSync(filePathA).isDirectory()) {
                const numberStr = fs
                    .readdirSync(filePathA)
                    .find(file => file.endsWith('.mdx'))
                    ?.match(/\.(\d+)\./)
                    ?.at(1)

                if (numberStr) {
                    numA = Number(numberStr)
                }
            }

            const filePathB = path.resolve(folder, b)
            let numB

            if (fs.statSync(filePathB).isDirectory()) {
                const numberStr = fs
                    .readdirSync(filePathB)
                    .find(file => file.endsWith('.mdx'))
                    ?.match(/\.(\d+)\./)
                    ?.at(1)

                if (numberStr) {
                    numB = Number(numberStr)
                }
            }

            if (numA != null) {
                if (numB != null) {
                    return numA - numB
                }

                return -1
            }

            if (numB != null) {
                return 1
            }

            return a.localeCompare(b)
        })

        let menuItem
        if (folder !== '') {
            for (const dir of dirs) {
                if (dir.indexOf('node_modules') !== -1) {
                    continue
                }

                if (dir.startsWith('.')) {
                    continue
                }

                if (dir.endsWith('.mdx')) {
                    let name = (folder.indexOf('#') === -1 ? '' : '#') + dir.slice(0, -4)
                    name = name.replace(/\.\d+$/g, '')

                    menuItem = {
                        name,
                        path: folder + '/README.md',
                        folder,
                        items: [],
                    }

                    menu_.push(menuItem)
                }
            }
        }

        for (const dir of dirs) {
            if (dir.indexOf('node_modules') !== -1) {
                continue
            }

            if (dir.startsWith('.')) {
                continue
            }

            if (fs.statSync(path.resolve(folder, dir)).isDirectory()) {
                getMenu(folder === '' ? dir : folder + '/' + dir, menuItem ? menuItem.items : menu_)
            }
        }
    }

    async function convert(folder: string): Promise<void> {
        const dirs = fs.readdirSync(path.resolve(folder))

        for (const dir of dirs) {
            if (dir.indexOf('node_modules') !== -1) {
                continue
            }
            if (dir.startsWith('.')) {
                continue
            }

            const currentPath = path.resolve(folder, dir)

            if (fs.statSync(currentPath).isDirectory()) {
                await convert(path.join(folder, dir))
            }

            if (dir.endsWith('.mdx')) {
                logConsole('Building: ' + path.join(folder, 'README.md'))
                const selected = path.relative(process.cwd(), folder)
                const mdxContent = fs.readFileSync(currentPath, 'utf-8')
                const result = new NodeHtmlMarkdown().translate(
                    renderToString(
                        createElement(
                            getMDXComponent(
                                (
                                    await bundleMDX({
                                        source:
                                            "import { Nav } from 'sky/docs'\n\n" +
                                            `<Nav menu={${stringifiedMenu}} selected='${selected}' />\n\n` +
                                            mdxContent,
                                        cwd: path.resolve(selected),
                                    })
                                ).code
                            )
                        )
                    )
                )
                const banner = `This ${dir.slice(0, -4)} was auto-generated using "npx sky readme"`
                const doc = `<!--- ${banner} --> \n\n${result}`
                const targetPath = path.resolve(folder, 'README.md')
                await writeFile(targetPath === '/' ? './' : targetPath, doc)
            }
        }
    }
}
