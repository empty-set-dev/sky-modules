#!/usr/bin/env -S pnpm exec tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'
import { errorConsole } from 'sky/utilities/console'

import __import from './__import'

const command = process.argv[3]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./desktop-${command}.ts`)) {
    initArgs()
    errorConsole(`desktop: command "${command}" not found`)
    args.showHelp()
}

function initArgs(): void {
    args.command('init', 'Init', () => {})
    args.command('dev', 'Dev', () => {})
    args.command('build', 'Build', () => {})

    args.parse(process.argv, {
        name: 'sky desktop',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}
