import { ArgumentsCamelCase, Argv } from 'yargs'

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
                    .option('server', {
                        describe: 'Init only server app',
                        type: 'boolean',
                    }),
            async (argv: ArgumentsCamelCase<{ appName: string }>) =>
                (await import('./node-dev')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
