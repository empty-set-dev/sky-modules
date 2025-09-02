import { Argv } from 'yargs'

import Console from './lib/Console'

export default function node(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name>',
            'Dev desktop (Tauri)',
            () => null,
            async argv => Console.clear() ?? (await import('./desktop-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build desktop (Tauri)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => Console.clear() ?? (await import('./desktop-build')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start desktop (Tauri)',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => Console.clear() ?? (await import('./desktop-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
