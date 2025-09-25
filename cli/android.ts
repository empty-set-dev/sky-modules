import { Argv } from 'yargs'

import Console from './lib/Console'

export default function android(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name>',
            'Dev android (Expo)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => Console.clear() ?? (await import('./android-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build android (Expo)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                })
            // async argv => Console.clear() ?? (await import('./android-build')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start android (Expo)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                })
            // async argv => Console.clear() ?? (await import('./android-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
