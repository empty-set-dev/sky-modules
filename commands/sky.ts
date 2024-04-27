#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import args from 'args'

import __import from './__import'

function initArgs(): void {
    args.command('init', 'Init', () => {})
    args.command('readme', 'Readme', () => {})
    args.command('browser', 'Browser', () => {})
    args.command('node', 'Node', () => {})
    args.command('tauri', 'Tauri', () => {})
    args.command('format', 'Format', () => {})

    args.parse(process.argv, {
        name: 'sky',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}

const command = process.argv[2]
if (!command) {
    initArgs()
    args.showHelp()
} else if (!__import(`./${command}.ts`)) {
    initArgs()
    // eslint-disable-next-line no-console
    console.error(`command "${command}" not found`)
    args.showHelp()
}
