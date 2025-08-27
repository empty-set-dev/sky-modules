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
        .command('node <command>', 'Node (Bun)', async yargs => {
            return (await import('./node')).default(yargs)
        })
        .command('web <command>', 'Web (Vike)', async yargs => {
            return (await import('./web')).default(yargs)
        })
        .command('desktop <command>', 'Desktop (Tauri)', async yargs => {
            return (await import('./web')).default(yargs)
        })
        .command('ios <command>', 'iOS (Expo)', async yargs => {
            return (await import('./ios')).default(yargs)
        })
        .command('android <command>', 'Android (Expo)', async () => {
            // return (await import('./android')).default(yargs)
        })
        .command(
            'add <module-path>',
            'Add external module',
            () => null,
            async argv => {
                return (await import('./add')).default(argv)
            }
        )
        .command(
            'run [script-path]',
            'Run node script (Bun)',
            yargs =>
                yargs.positional('script-path', {
                    describe: 'Script path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                return (await import('./run')).default(argv)
            }
        )
        .command(
            'test [folder]',
            'Test (Jest)',
            yargs =>
                yargs.positional('folder', {
                    describe: 'Script path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                return (await import('./run')).default(argv)
            }
        )
        .command('format', 'Format (eslint --fix)', async () => {
            return (await import('./format')).default()
        })
        .command('readme', 'Readme (*.mdx -> *.md)', async () => {
            return (await import('./readme')).default()
        })
        .completion('completion', 'Generate completion for terminal')
        .showHelpOnFail(false)

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
