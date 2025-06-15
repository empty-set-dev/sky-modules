#!/usr/bin/env -S pnpm exec tsx
import args from 'args'
import dotenv from 'dotenv'
import { errorConsole } from 'sky/utilities/console'

import __getCommandMode from './__getCommandMode'
import __import from './__import'

sky()

function sky(): void {
    const [, , command, subCommand] = process.argv

    const mode = __getCommandMode(command, subCommand)

    dotenv.config({
        path: [`.env.${mode}.local`, '.env.local', `.env.${mode}`, '.env'],
    })

    if (!command) {
        initArgs()
        args.showHelp()
        return
    }

    if (!__import(`./${command}.ts`)) {
        initArgs()
        errorConsole(`command "${command}" not found`)
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
    args.command('ios', 'ios (Expo)')
    args.command('android', 'android (Expo)')
    args.command('format', 'Format')

    args.parse(process.argv, {
        name: 'sky',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })
}
