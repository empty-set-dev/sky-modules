import { Argv } from 'yargs'

export default function node(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'init <app-name>',
            'Init universal (ReactNative & Tauri & Expo)',
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
        .completion('completion', 'Generate completion for terminal')
}
