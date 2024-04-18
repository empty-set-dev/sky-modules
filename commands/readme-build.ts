#!/usr/bin/env tsx
/* eslint-disable no-console */
import fs from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { mdxToMd } from 'mdx-to-md'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

convert('/').then(() => {
    console.log('Converted docs/index.mdx -> README.md')
})

async function convert(folder: string): Promise<void> {
    const stat = fs.readdirSync(path.resolve(__dirname, `../../docs${folder}`))
    for (const v of stat) {
        console.log(v)
    }
    // const markdown = await mdxToMd(path.resolve(__dirname, `../../docs/index.mdx`))
    // const banner = `This README was auto-generated using "npm build:readme"`
    // const readme = `<!--- ${banner} --> \n\n ${markdown}`
    // await writeFile('README.md', readme)
}
