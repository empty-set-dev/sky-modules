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

const command = process.argv[3]
if (!command) {
    init.all()
} else if (!__import(`./init-${command}.ts`)) {
    initArgs()
    // eslint-disable-next-line no-console
    console.error(`init: command "${command}" not found`)
    args.showHelp()
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
