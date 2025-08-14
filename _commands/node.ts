#!/usr/bin/env -S pnpm exec tsx
import args from 'args'

import { errorConsole } from '../utilities/Console

import __import from './__import'

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./node-${command}.ts`)) {
    initArgs()
    errorConsole(`node: command "${command}" not found`)
    args.showHelp()
}

function initArgs(): void {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    args.command('dev', 'Dev', () => {})
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    args.command('start', 'Start', () => {})

    args.parse(process.argv, {
        name: 'sky node',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}
