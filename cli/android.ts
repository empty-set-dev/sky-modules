import { Argv } from 'yargs'

import Console from './utilities/Console'

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
            async argv => Console.clear() ?? (await import('./android--dev')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
