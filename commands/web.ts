import { Argv } from 'yargs'

export default function web(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'init <app-name>',
            'Init (Vike)',
            () => null,
            async argv => (await import('./web-init')).default(argv)
        )
        .command(
            'dev <app-name>',
            'Dev (Vike)',
            yargs =>
                yargs
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
            async argv => (await import('./web-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build (Vike)',
            () => null,
            async argv => (await import('./web-build')).default(argv)
        )
        .command(
            'preview <app-name>',
            'Preview (Vike)',
            yargs =>
                yargs
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
            async argv => (await import('./web-preview')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start (Vike)',
            yargs =>
                yargs
                    .option('port', {
                        number: true,
                        default: 80,
                        description: 'The port on which the app will be running',
                    })
                    .option('open', {
                        number: true,
                        default: true,
                        description: 'Open in browser',
                    })
                    .option('host', {
                        number: true,
                        default: false,
                        description: 'Expose',
                    }),
            async argv => (await import('./web-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
