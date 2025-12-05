#!/usr/bin/env -S pnpm exec tsx
import { chdir } from 'process'

import dotenv from 'dotenv'
import Yargs, { ArgumentsCamelCase } from 'yargs'
import { hideBin } from 'yargs/helpers'

import Console from './utilities/Console'
import getCommandMode from './utilities/getCommandMode'
import watch, { unwatch } from './utilities/watch'
import workspaceRoot from './utilities/workspaceRoot'

await sky()

async function sky(): Promise<void> {
    if (!workspaceRoot) {
        Console.error('not a sky workspace')
        return
    }

    if (workspaceRoot) {
        chdir(workspaceRoot)
    }

    const yargs = Yargs(hideBin(process.argv))
        .scriptName('sky')
        .strict()
        .option('node-env', {
            type: 'string',
            demandOption: false,
        })
        .option('mode', {
            type: 'string',
            demandOption: false,
        })
        .middleware(argv => {
            if (argv._.length > 0) {
                const mode =
                    argv.mode ??
                    getCommandMode(argv._[0].toString(), argv._[1] ? argv._[1].toString() : null)
                process.env.NODE_ENV = argv['node-env'] ?? mode
                const paths = ['.env', `.env.${mode}`, '.env.local', `.env.${mode}.local`]
                dotenv.config({
                    path: paths,
                    quiet: true,
                })
                watch([...paths, 'cli'])
            }
        })
        .alias('h', 'help')
        .alias('v', 'version')
        .demandCommand()
        .command('create', 'Create', async yargs => {
            return (await import('./create')).default(yargs)
        })
        .command('init [command]', 'Init', async yargs => {
            return (await import('./init')).default(yargs)
        })
        .command('generate <command>', 'Generate', async yargs => {
            return (await import('./generate')).default(yargs)
        })
        .command('node <command>', 'Node (Bun)', async yargs => {
            return (await import('./node')).default(yargs)
        })
        .command('web <command>', 'Web (Vike)', async yargs => {
            return (await import('./web')).default(yargs)
        })
        .command('desktop <command>', 'Desktop (Tauri)', async yargs => {
            return (await import('./desktop')).default(yargs)
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
            'Test (Vitest)',
            yargs =>
                yargs
                    .positional('folder', {
                        describe: 'Folder path',
                        type: 'string',
                    })
                    .option('mutation', {
                        describe: 'Mutation tests',
                        type: 'boolean',
                    })
                    .option('watch', {
                        describe: 'Watch mode',
                        type: 'boolean',
                    }),
            async (argv: ArgumentsCamelCase<{ folder: string }>) => {
                Console.clear()
                return (await import('./test')).default(argv)
            }
        )
        .command(
            'format [folder]',
            'Format (eslint, stylelint --fix)',
            yargs =>
                yargs.positional('folder', {
                    describe: 'Folder path',
                    type: 'string',
                }),
            async (argv: ArgumentsCamelCase<{ folder: string }>) => {
                Console.clear()
                return (await import('./format')).default(argv)
            }
        )
        .command(
            'check [module-name]',
            'Check (tsc)',
            yargs =>
                yargs.positional('module-name', {
                    describe: 'module-name',
                    type: 'string',
                }),
            async (argv: ArgumentsCamelCase<{ moduleName?: string }>) => {
                Console.clear()
                return (await import('./check')).default(argv)
            }
        )
        .command('docs <command>', 'Documentation (VitePress)', async yargs => {
            return (await import('./docs')).default(yargs)
        })
        .command('design-system <command>', 'Design system', async yargs => {
            return (await import('./design-system')).default(yargs)
        })
        .command('mitosis <command>', 'Mitosis', async yargs => {
            return (await import('./mitosis')).default(yargs)
        })
        .command('publish <command>', 'Publish', async yargs => {
            return (await import('./publish')).default(yargs)
        })
        .completion('completion', 'Generate completion for terminal')
        .showHelpOnFail(false)

    await yargs.parse()

    unwatch()
}
