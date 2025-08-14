#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'

import args from 'args'
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

import { Console.log } from '../utilities/Console2e

import __loadSkyConfig from './__loadSkyConfig'
import __skyPath from './__skyPath'

// eslint-disable-next-line @typescript-eslint/no-empty-function
args.command('readme', 'Generate md from mdx with navigation', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

readme()

async function readme(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(process.env as any).NODE_ENV = 'production'

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
        Console.log('Converted **/*.mdx -> **/README.md')
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
                Console.log('Building: ' + path.join(folder, 'README.md'))
                const selected = path.relative(process.cwd(), folder)
                const mdxContent = fs.readFileSync(currentPath, 'utf-8')
                const result = new NodeHtmlMarkdown().translate(
                    renderToString(
                        createElement(
                            getMDXComponent(
                                (
                                    await bundleMDX({
                                        source:
                                            `import { BeforeContent, AfterContent } from '${__skyPath === '.' ? 'sky' : __skyPath}/docs'\n\n` +
                                            `<BeforeContent name="${skyConfig?.name}" menu={${stringifiedMenu}} selected='${selected}' />\n\n` +
                                            mdxContent +
                                            '\n\n' +
                                            `<AfterContent name="${skyConfig?.name}" menu={${stringifiedMenu}} selected='${selected}' />\n\n`,
                                        cwd: path.resolve(selected),
                                    })
                                ).code
                            )
                        )
                    )
                )
                const banner = `This ${dir.slice(0, -4)} was auto-generated using "pnpm exec sky readme"`
                const doc = `<!--- ${banner} --> \n\n${result}`
                const targetPath = path.resolve(folder, 'README.md')
                await writeFile(targetPath === '/' ? './' : targetPath, doc)
            }
        }
    }
}
