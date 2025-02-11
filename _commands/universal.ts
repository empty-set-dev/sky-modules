#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import { errorConsole } from '../helpers/console'

import __import from './__import'

function initArgs(): void {
    args.command('init', 'Init', () => {})

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
} else if (!__import(`./universal-${command}.ts`)) {
    initArgs()
    errorConsole(`universal: command "${command}" not found`)
    args.showHelp()
}
