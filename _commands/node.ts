#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'
import { errorConsole } from '../helpers/console'

import __import from './__import'

function initArgs(): void {
    args.command('dev', 'Dev', () => {})
    args.command('start', 'Start', () => {})

    args.parse(process.argv, {
        name: 'sky node',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./node-${command}.ts`)) {
    initArgs()
    errorConsole(`node: command "${command}" not found`)
    args.showHelp()
}
