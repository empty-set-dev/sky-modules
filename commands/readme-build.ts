#!/usr/bin/env tsx
import fs from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'

import { mdxToMd } from 'mdx-to-md'

process.env.NODE_ENV = 'production'

convert('').then(() => {
    // eslint-disable-next-line no-console
    console.log('Converted README.mdx -> README.md')
})

async function convert(folder: string): Promise<void> {
    const stat = fs.readdirSync(path.resolve(folder))
    for (const v of stat) {
        /* eslint-disable no-console */
        console.log(v)
    }
    const markdown = await mdxToMd(path.resolve(folder, 'README.mdx'))
    const banner = `This README was auto-generated using "npm sky readme build"`
    const readme = `<!--- ${banner} --> \n\n ${markdown}`
    await writeFile('README.md', readme)
}
