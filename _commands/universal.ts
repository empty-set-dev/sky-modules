#!/usr/bin/env -S pnpm exec tsx
import args from 'args'

import Console from '../utilities/Console'

import __import from './__import'

function initArgs(): void {
    args.command('init', 'Init')

    args.parse(process.argv, {
        name: 'sky universal',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!(await __import(`./universal-${command}.ts`))) {
    initArgs()
    Console.error(`universal: command "${command}" not found`)
    args.showHelp()
}
