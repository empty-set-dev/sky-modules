#!/usr/bin/env -S pnpm exec bun
import dotenv from 'dotenv'
import Console from 'sky/utilities/Console'
import Yargs, { ArgumentsCamelCase } from 'yargs'
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
        .command(
            'create',
            'Create Sky project',
            () => null,
            async () => {
                return (await import('./create')).default()
            }
        )
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
        .command('android <command>', 'Android (Expo)', async yargs => {
            return (await import('./android')).default(yargs)
        })
        .command(
            'add <external-module-path>',
            'Add external module',
            yargs =>
                yargs.positional('external-module-path', {
                    describe: 'Path to the module',
                    type: 'string',
                    demandOption: true,
                }),
            async (argv: ArgumentsCamelCase<{ externalModulePath: string }>) => {
                return (await import('./add')).default(argv)
            }
        )
        .command(
            'run <script-path>',
            'Run node script (Bun)',
            yargs =>
                yargs.positional('script-path', {
                    describe: 'Script path',
                    type: 'string',
                    demandOption: true,
                }),
            async (argv: ArgumentsCamelCase<{ scriptPath: string }>) => {
                Console.clear()
                return (await import('./run')).default(argv)
            }
        )
        .command(
            'test [folder]',
            'Test (Jest)',
            yargs =>
                yargs.positional('folder', {
                    describe: 'Folder path',
                    type: 'string',
                }),
            async (argv: ArgumentsCamelCase<{ folder: string }>) => {
                Console.clear()
                return (await import('./test')).default(argv)
            }
        )
        .command(
            'format',
            'Format (eslint --fix)',
            () => null,
            async () => {
                Console.clear()
                return (await import('./format')).default()
            }
        )
        .command(
            'readme',
            'Readme (*.mdx -> *.md)',
            () => null,
            async () => {
                Console.clear()
                return (await import('./readme')).default()
            }
        )
        .completion('completion', 'Generate completion for terminal')
        .showHelpOnFail(false)

    await yargs.parse()
}
