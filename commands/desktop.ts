import { Argv } from 'yargs'

export default function node(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name>',
            'Dev desktop (Tauri)',
            () => null,
            async argv => (await import('./desktop-dev')).default(argv)
        )
        .command(
            'build <app-name>',
            'Build desktop (Tauri)',
            () => null,
            async argv => (await import('./desktop-build')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start desktop (Tauri)',
            () => null,
            async argv => (await import('./desktop-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
