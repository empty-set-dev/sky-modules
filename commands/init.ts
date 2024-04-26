#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __import from './__import'

function initArgs(): void {
    args.command('format', 'eslint, prettier, editorconfig', () => {})
    args.command('package', 'package.json', () => {})
    args.command('tsconfig', 'tsconfig.json', () => {})
    args.command('gitignore', '.gitignore', () => {})

    args.parse(process.argv, {
        name: 'sky init',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

export namespace init {
    const command = process.argv[3]
    if (!command) {
        all()
    } else if (!__import(`./init-${command}.ts`)) {
        initArgs()
        // eslint-disable-next-line no-console
        console.error(`init: command "${command}" not found`)
        args.showHelp()
    }

    export async function all(): Promise<void> {
        // eslint-disable-next-line no-console
        console.log(`init package`)
        await import('./init-package')
        // eslint-disable-next-line no-console
        console.log(`init tsconfig`)
        await import('./init-tsconfig')
        // eslint-disable-next-line no-console
        console.log(`init format`)
        await import('./init-format')
        // eslint-disable-next-line no-console
        console.log(`init gitignore`)
        await import('./init-gitignore')
    }
}
