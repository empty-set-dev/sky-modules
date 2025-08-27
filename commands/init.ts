import Console, { bright, green, reset } from 'sky/utilities/Console'
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
            'package.json',
            'Update package.json',
            () => null,
            async () => (await import('./init-package.json')).default()
        )
        .command(
            'ts-configs',
            'Update ts-config.json for all modules, examples and apps',
            async () => (await import('./init-ts-configs')).default()
        )
        .command(
            'packages',
            'Init packages and configs',
            () => null,
            async () => (await import('./init-packages')).default()
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
            () => null,
            async argv => (await import('./init-vscode-workspace-tasks')).default(argv)
        )
        .command(
            '*',
            'Init all',
            () => null,
            async () => {
                Console.log(`${green}${bright}Init sky-config${reset}`)
                ;(await import('./init-sky-config')).default()

                Console.log(`${green}${bright}Init package.json${reset}`)
                await (await import('./init-package.json')).default()

                Console.log(`${green}${bright}Init ts-configs${reset}`)
                await (await import('./init-ts-configs')).default()

                Console.log(`${green}${bright}Init packages${reset}`)
                await (await import('./init-packages')).default()

                Console.log(`${green}${bright}Init .gitignore${reset}`)
                ;(await import('./init-.gitignore')).default()
            }
        )
        .completion('completion', 'Generate completion for terminal')
}
