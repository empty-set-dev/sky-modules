import { Argv } from 'yargs'

export default function docs(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'dev',
            'Start VitePress development server',
            () => null,
            async () => {
                return (await import('./docs--dev')).default()
            }
        )
        .command(
            'build',
            'Build documentation',
            () => null,
            async () => {
                return (await import('./docs--build')).default()
            }
        )
        .command(
            'preview',
            'Preview built documentation',
            () => null,
            async () => {
                return (await import('./docs--preview')).default()
            }
        )
        .completion('completion', 'Generate completion for terminal')
}
