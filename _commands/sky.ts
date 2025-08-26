#!/usr/bin/env -S pnpm exec tsx
import args from 'args'
import dotenv from 'dotenv'

import Console from '../utilities/Console'

import getCommandMode from './lib/getCommandMode'
import importFile from './lib/importFile'

await sky()

async function sky(): Promise<void> {
    const [, , command, subCommand] = process.argv

    if (!command) {
        initArgs()
        args.showHelp()
        return
    }

    const mode = getCommandMode(command, subCommand)

    dotenv.config({
        path: [`.env.${mode}.local`, '.env.local', `.env.${mode}`, '.env'],
        quiet: true,
    })

    if (!(await importFile(`./${command}.ts`))) {
        initArgs()
        Console.error(`command "${command}" not found`)
        args.showHelp()
    }
}

function initArgs(): void {
    args.command('init', 'Init')
    args.command('readme', 'Readme')
    args.command('add', 'Add module')
    args.command('test', 'Test (Jest)')
    args.command('run', 'Run (Tsx)')
    args.command('web', 'Web')
    args.command('node', 'Node')
    args.command('desktop', 'Desktop (Tauri)')
    args.command('ios', 'iOS (Expo)')
    args.command('android', 'Android (Expo)')
    args.command('format', 'Format')

    args.parse(process.argv, {
        name: 'sky',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}
