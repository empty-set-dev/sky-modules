import { Argv } from 'yargs'

export default function node(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name> [args..]',
            'Dev (Bun)',
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
            async argv => (await import('./node-dev')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start (Bun)',
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
            async argv => (await import('./node-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
