#!/usr/bin/env npx
import __import from './__import'

const command = process.argv[3]

if (command && !__import(`./node-${command}.ts`)) {
    // eslint-disable-next-line no-console
    console.error(`node: command "${command}" not found`)
}

export namespace init {
    if (!command) {
        all()
    }

    export async function all(): Promise<void> {
        await import('./init-package')
        await import('./init-tsconfig')
        await import('./init-format')
    }
}
