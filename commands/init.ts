#!/usr/bin/env -S pnpm exec tsx
import { Argv } from 'yargs'

import Console, { bright, green, reset } from '../utilities/Console'

export default function init(yargs: Argv): Argv {
    return yargs
        .command('init sky-config', '.sky/sky.config.ts', async () =>
            (await import('./init-sky-config')).default()
        )
        .command('init package.json', 'Update package.json', async () =>
            (await import('./init-package.json')).default()
        )
        .command(
            'init ts-configs',
            'Update ts-config.json for all modules, examples and apps',
            async () => (await import('./init-ts-configs')).default()
        )
        .command('init packages', 'Init packages and configs', async () =>
            (await import('./init-packages')).default()
        )
        .command('init .gitignore', './Init (if not exists) .gitignore', async () =>
            (await import('./init-.gitignore')).default()
        )
        .command('init vscode-workspace', 'Update vscode workspace in root', async () =>
            (await import('./init-.gitignore')).default()
        )
        .command('init vscode-workspace-tasks', 'Update vscode workspace tasks', async () =>
            (await import('./init-.gitignore')).default()
        )
        .command(
            '$0',
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
}
