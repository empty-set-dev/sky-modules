#!/usr/bin/env tsx
import child_process from 'child_process'
import path from 'path'

import __getEntry from './__getEntry'

export namespace node {
    start()

    export function start(): void {
        const name = process.argv[4]

        const entryPath = __getEntry(name, ['tsx', 'ts'])

        if (!entryPath) {
            // eslint-disable-next-line no-console
            console.error('no entry')
            return
        }

        const script = path.relative(process.cwd(), entryPath)

        child_process.execSync(`tsx watch --expose-gc "${script}`, {
            stdio: 'inherit',
        })
    }
}
