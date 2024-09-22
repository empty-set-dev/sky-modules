#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __import from './_import'

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
    // eslint-disable-next-line no-console
    console.error(`node: command "${command}" not found`)
    args.showHelp()
}
