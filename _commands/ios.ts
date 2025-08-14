#!/usr/bin/env -S pnpm exec tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'
import Console from '../utilities/Console'

import __import from './__import'

function initArgs(): void {
    args.command('dev', 'Dev', () => {})
    args.command('build', 'Build', () => {})
    args.command('start', 'Start', () => {})

    args.parse(process.argv, {
        name: 'sky ios',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./ios-${command}.ts`)) {
    initArgs()
    Console.error(`ios: command "${command}" not found`)
    args.showHelp()
}
