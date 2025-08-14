#!/usr/bin/env -S pnpm exec tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import Console from '../utilities/Console'

import __import from './__import'

function initArgs(): void {
    args.command('init', 'Init', () => {})
    args.command('dev', 'Dev', () => {})
    args.command('build', 'Build', () => {})
    args.command('start', 'Start', () => {})

    args.parse(process.argv, {
        name: 'sky web',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!(await __import(`./web-${command}.ts`))) {
    initArgs()
    Console.error(`web: command "${command}" not found`)
    args.showHelp()
}
