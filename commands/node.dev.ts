#!/usr/bin/env tsx
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace node {
    dev()

    export function dev(): void {
        const name = process.argv[2]

        const paths: string[] = []
        if (name.endsWith('.ts') || name.endsWith('.tsx')) {
            paths.push(name)
        } else {
            paths.push(
                ...[
                    name + '.tsx',
                    name + '.tx',
                    path.resolve(name, 'index.tsx'),
                    path.resolve(name, 'index.ts'),
                ]
            )
        }

        const scriptPath = paths.find(path_ => fs.existsSync(path_))

        if (!scriptPath) {
            // eslint-disable-next-line no-console
            console.error('missing app name')
            // eslint-disable-next-line
            return
        }

        const script = path.relative(process.cwd(), scriptPath)

        child_process.execSync(`tsx watch --expose-gc ${script}`, {
            stdio: 'inherit',
        })
    }
}
