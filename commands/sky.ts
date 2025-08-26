#!/usr/bin/env -S pnpm exec bun
import dotenv from 'dotenv'
import Yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import getCommandMode from './lib/getCommandMode'
await sky()

async function sky(): Promise<void> {
    const yargs = Yargs(hideBin(process.argv))
        .scriptName('sky')
        .strict()
        .middleware(argv => {
            if (argv._.length > 0) {
                const mode = getCommandMode(
                    argv._[0].toString(),
                    argv._[1] ? argv._[1].toString() : null
                )
                process.env.NODE_ENV = mode
                dotenv.config({
                    path: ['.env', `.env.${mode}`, '.env.local', `.env.${mode}.local`],
                    quiet: true,
                })
            }
        })
        .alias('h', 'help')
        .alias('v', 'version')
        .demandCommand()
        .command('init [command]', 'Init', async yargs => {
            return (await import('./init')).default(yargs)
        })
        .command('node [command]', 'Node', async yargs => {
            return (await import('./node')).default(yargs)
        })
        .command('format', 'Format (eslint --fix)', async () => {
            return (await import('./format')).default()
        })
        .command('readme', 'Readme (*.mdx -> *.md)', async () => {
            return (await import('./readme')).default()
        })
        .completion('completion', 'Generate completion for terminal')

    await yargs.parse()
}

// function initArgs(): void {
//     args.command('init', 'Init')
//     args.command('readme', 'Readme')
//     args.command('add', 'Add module')
//     args.command('test', 'Test (Jest)')
//     args.command('run', 'Run (Tsx)')
//     args.command('web', 'Web')
//     args.command('node', 'Node')
//     args.command('desktop', 'Desktop (Tauri)')
//     args.command('ios', 'iOS (Expo)')
//     args.command('android', 'Android (Expo)')
//     args.command('format', 'Format')

//     args.parse(process.argv, {
//         name: 'sky',
//         mainColor: 'greenBright',
//         subColor: 'white',
//         mri: {},
//     })
// }
