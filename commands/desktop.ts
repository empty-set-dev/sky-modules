import { Argv } from 'yargs'

export default function node(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name>',
            'Dev (Tauri)',
            () => null,
            async argv => (await import('./desktop-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build (Tauri)',
            () => null,
            async argv => (await import('./desktop-build')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start (Tauri)',
            () => null,
            async argv => (await import('./desktop-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
