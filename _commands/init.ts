#!/usr/bin/env -S pnpm exec tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __import from './__import'

function initArgs(): void {
    args.command('sky-config', 'sky.config.ts', () => {})
    args.command('packages', 'npm packages', () => {})
    args.command('package', 'package.json', () => {})
    args.command('ts-configs', 'tsconfig.json for all modules and apps', () => {})
    args.command('gitignore', '.gitignore', () => {})
    args.command('vscode-workspace-tasks', 'vscode workspace tasks', () => {})

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
        Console.error(`command "${command}" not found`)
        args.showHelp()
    }

    export async function all(): Promise<void> {
        Console.log(`init sky-config`)
        await import('./init-sky-config')
        Console.log(`init package`)
        await import('./init-package')
        Console.log(`init ts-configs`)
        await import('./init-ts-configs')
        Console.log(`init packages`)
        await import('./init-packages')
        Console.log(`init gitignore`)
        await import('./init-gitignore')
    }
}
