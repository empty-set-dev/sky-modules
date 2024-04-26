#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __import from './__import'

function initArgs(): void {
    args.command('dev', 'Dev', () => {})
    args.command('build', 'Build', () => {})
    args.command('start', 'Start', () => {})

    args.parse(process.argv, {
        name: 'sky browser',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./browser-${command}.ts`)) {
    initArgs()
    // eslint-disable-next-line no-console
    console.error(`browser: command "${command}" not found`)
    args.showHelp()
}
