#!/usr/bin/env tsx
/* eslint-disable no-console */
import fs from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { mdxToMd } from 'mdx-to-md'
console.log('...')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env.NODE_ENV = 'production'

convert('').then(() => {
    console.log('Converted README.mdx -> README.md')
})

async function convert(folder: string): Promise<void> {
    const stat = fs.readdirSync(path.resolve(__dirname, `../${folder}`))
    for (const v of stat) {
        console.log(v)
    }
    const markdown = await mdxToMd(path.resolve(__dirname, `../README.mdx`))
    const banner = `This README was auto-generated using "npm sky readme build"`
    const readme = `<!--- ${banner} --> \n\n ${markdown}`
    await writeFile('README.md', readme)
}
