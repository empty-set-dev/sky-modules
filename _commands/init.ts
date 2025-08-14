#!/usr/bin/env -S pnpm exec tsx
import args from 'args'

import Console from '../utilities/Console'

import __import from './__import'

init()

async function init(): Promise<void> {
    const command = process.argv[3]
    if (!command) {
        initAll()
    } else if (!(await __import(`./init-${command}.ts`))) {
        initArgs()
        Console.error(`command "${command}" not found`)
        args.showHelp()
    }
}

async function initAll(): Promise<void> {
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

function initArgs(): void {
    args.command('sky-config', 'sky.config.ts')
    args.command('packages', 'npm packages')
    args.command('package', 'package.json')
    args.command('ts-configs', 'tsconfig.json for all modules and apps')
    args.command('gitignore', '.gitignore')
    args.command('vscode-workspace-tasks', 'vscode workspace tasks')

    args.parse(process.argv, {
        name: 'sky init',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}
