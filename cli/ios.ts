import { Argv } from 'yargs'

import Console from './lib/Console'

export default function ios(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name>',
            'Dev iOS (Expo)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => Console.clear() ?? (await import('./ios-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build iOS (Expo)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                })
            // async argv => Console.clear() ?? (await import('./ios-build')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start iOS (Expo)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                })
            // async argv => Console.clear() ?? (await import('./ios-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
