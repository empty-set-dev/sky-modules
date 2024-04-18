#!/usr/bin/env tsx
import path from 'path'

import __getCodeEntry from './__getCodeEntry'
import __run from './__run'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace node {
    dev()

    export function dev(): void {
        const projectPath = process.argv[4]
        const entryPath = __getCodeEntry(projectPath)

        if (!entryPath) {
            // eslint-disable-next-line no-console
            console.error('no entry')
            return
        }

        const script = path.relative(process.cwd(), entryPath)

        __run(`tsx watch --expose-gc ${script}`)
    }
}
