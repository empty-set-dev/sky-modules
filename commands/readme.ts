#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import fs from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'

import args from 'args'
import { mdxToMd } from 'mdx-to-md'

args.command('readme', 'Generate md from mdx', () => {})

args.parse(process.argv, {
    name: 'sky',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

process.env.NODE_ENV = 'production'

const menu = []
getMenu('')
fs.writeFileSync('docs/menu.json', JSON.stringify(menu, null, '    '))

function getMenu(folder: string, menu_ = menu): void {
    const dirs = fs.readdirSync(path.resolve(folder))

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
                menuItem = {
                    name: dir.slice(0, -4),
                    path: folder + '/' + dir.slice(0, -1),
                    folder,
                    items: [],
                }
                menu_.push(menuItem)
            }
        }
    }

    if (menuItem || folder === '') {
        for (const dir of dirs) {
            if (dir.indexOf('node_modules') !== -1) {
                continue
            }
            if (dir.startsWith('.')) {
                continue
            }

            const stat = fs.statSync(path.resolve(folder, dir))
            if (stat.mode === 16877) {
                getMenu(folder === '' ? dir : folder + '/' + dir, menuItem ? menuItem.items : menu_)
            }
        }
    }
}

convert('').then(() => {
    // eslint-disable-next-line no-console
    console.log('Converted **/*.mdx -> **/*.mdx')
})

async function convert(folder: string): Promise<void> {
    const dirs = fs.readdirSync(path.resolve(folder))

    for (const dir of dirs) {
        if (dir.indexOf('node_modules') !== -1) {
            continue
        }
        if (dir.startsWith('.')) {
            continue
        }

        const stat = fs.statSync(path.resolve(folder, dir))
        if (stat.mode === 16877) {
            await convert(path.resolve(folder, dir))
        }

        if (dir.endsWith('.mdx')) {
            // eslint-disable-next-line no-console
            console.log('Building: ' + path.resolve(folder, dir))
            const markdown = await mdxToMd(path.resolve(folder, dir))
            const banner = `This ${dir.slice(
                0,
                -4
            )} was auto-generated using "npx sky readme build"`
            const doc = `<!--- ${banner} --> \n\n${markdown}`
            const targetPath = path.resolve(folder, `${dir.slice(0, -1)}`)
            await writeFile(targetPath, doc)
        }
    }
}
