import { Argv } from 'yargs'

export default function init(yargs: Argv): Argv {
    return yargs
        .command(
            'sky-config',
            'Init .sky/sky.config.ts',
            () => null,
            async () => (await import('./init-sky-config')).default()
        )
        .command(
            'configs',
            'Init configs',
            () => null,
            async () => (await import('./init-configs')).default()
        )
        .command(
            'package.json',
            'Update package.json',
            () => null,
            async () => (await import('./init-package.json')).default()
        )
        .command(
            'ts-configs',
            'Update ts-config.json for all modules, playground and apps',
            () => null,
            async () => (await import('./init-ts-configs')).default()
        )
        .command(
            '.gitignore',
            './Init (if not exists) .gitignore',
            () => null,
            async () => (await import('./init-.gitignore')).default()
        )
        .command(
            'vscode-workspace',
            'Update vscode workspace in root',
            () => null,
            async () => (await import('./init-vscode-workspace')).default()
        )
        .command(
            'vscode-workspace-tasks [app-name]',
            'Update vscode workspace tasks',
            yargs =>
                yargs.positional('app-name', {
                    describe: 'Sky app name',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => (await import('./init-vscode-workspace-tasks')).default(argv)
        )
        .command(
            '*',
            'Init all',
            () => null,
            async () => (await import('./init-all')).default()
        )
        .completion('completion', 'Generate completion for terminal')
}
