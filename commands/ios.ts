import { Argv } from 'yargs'

export default function ios(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name>',
            'Dev (Expo)',
            () => null,
            async argv => (await import('./ios-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build (Expo)',
            () => null
            // async argv => (await import('./ios-build')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start (Expo)',
            () => null
            // async argv => (await import('./ios-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
