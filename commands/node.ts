import { Argv } from 'yargs'

export default function node(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev <app-name>',
            'Dev (Bun)',
            () => null,
            async argv => (await import('./node-dev')).default(argv)
        )
        .command(
            'start <app-name>',
            'Start (Bun)',
            () => null,
            async argv => (await import('./node-start')).default(argv)
        )
        .completion('completion', 'Generate completion for terminal')
}
