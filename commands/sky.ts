#!/usr/bin/env -S npx tsx
/* eslint-disable @typescript-eslint/no-empty-function */
import { fileURLToPath } from 'url'

import args from 'args'

import __import from './__import'

process.mainModule = {
    filename: fileURLToPath(import.meta.url),
} as never

function initArgs(): void {
    args.command('init', 'Init', () => {})
    args.command('readme', 'Readme', () => {})
    args.command('test', 'Test (Jest)', () => {})
    args.command('web', 'Web', () => {})
    args.command('node', 'Node', () => {})
    args.command('desktop', 'Desktop (Tauri)', () => {})
    args.command('ios', 'ios (Expo)', () => {})
    args.command('android', 'ios (Expo)', () => {})
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
