import { ArgumentsCamelCase, Argv } from 'yargs'

import Console from './utilities/Console'

export default function node(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'init <app-name>',
            'Init node (Bun)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async (argv: ArgumentsCamelCase<{ appName: string }>) =>
                (await import('./node--init')).default(argv)
        )
        .command(
            'dev <app-name> [args..]',
            'Dev node (Bun)',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .positional('args', {
                        describe: 'App arguments',
                        type: 'string',
                    }),
            async (argv: ArgumentsCamelCase<{ appName: string; args: unknown[] }>) =>
                Console.clear() ?? (await import('./node--dev')).default(argv)
        )
        .command(
            'start <app-name> [args..]',
            'Start node (Bun)',
            yargs =>
                yargs
                    .positional('app-name', {
                        describe: 'Sky app name',
                        type: 'string',
                        demandOption: true,
                    })
                    .positional('args', {
                        describe: 'App arguments',
                        type: 'string',
                    }),
            async (argv: ArgumentsCamelCase<{ appName: string; args: unknown[] }>) =>
                Console.clear() ?? (await import('./node--start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
