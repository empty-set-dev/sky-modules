import { Argv } from 'yargs'

export default function android(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name>',
            'Dev android (Expo)',
            () => null,
            async argv => (await import('./android-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build android (Expo)',
            () => null
            // async argv => (await import('./ios-build')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start android (Expo)',
            () => null
            // async argv => (await import('./ios-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
