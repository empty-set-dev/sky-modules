import { ArgumentsCamelCase, Argv } from 'yargs'

import Console from './lib/Console'

export default function web(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'init <app-name>',
            'Init (Vike)',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('server', {
                        describe: 'Init only server app',
                        type: 'boolean',
                    }),
            async argv => (await import('./web-init')).default(argv)
        )
        .command(
            'dev <app-name>',
            'Dev (Vike)',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('port', {
                        number: true,
                        default: 3000,
                        description: 'The port on which the app will be running',
                    })
                    .option('open', {
                        number: true,
                        default: false,
                        description: 'Open in browser',
                    })
                    .option('host', {
                        number: true,
                        default: false,
                        description: 'Expose',
                    }),
            async (
                argv: ArgumentsCamelCase<{
                    appName: string
                    port: number
                    open: boolean
                    host: boolean
                }>
            ) => Console.clear() ?? (await import('./web-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build (Vike)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => (await import('./web-build')).default(argv)
        )
        .command(
            'preview <app-name>',
            'Preview (Vike)',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('port', {
                        number: true,
                        default: 3000,
                        description: 'The port on which the app will be running',
                    })
                    .option('open', {
                        number: true,
                        default: false,
                        description: 'Open in browser',
                    })
                    .option('host', {
                        number: true,
                        default: false,
                        description: 'Expose',
                    }),
            async (
                argv: ArgumentsCamelCase<{
                    appName: string
                    port: number
                    open: boolean
                    host: boolean
                }>
            ) => Console.clear() ?? (await import('./web-preview')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start (Vike)',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .option('port', {
                        number: true,
                        default: 80,
                        description: 'The port on which the app will be running',
                    })
                    .option('open', {
                        boolean: true,
                        default: true,
                        description: 'Open in browser',
                    })
                    .option('host', {
                        boolean: true,
                        default: false,
                        description: 'Expose',
                    }),
            async (
                argv: ArgumentsCamelCase<{
                    appName: string
                    port: number
                    open: boolean
                    host: boolean
                }>
            ) => Console.clear() ?? (await import('./web-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
