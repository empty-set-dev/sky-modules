#!/usr/bin/env -S pnpm exec tsx
import { Argv } from 'yargs'

import Console from '../utilities/Console'

export default function init(yargs: Argv): Argv {
    return yargs
        .command('sky-config', '.sky/sky.config.ts', async () =>
            (await import('./init-sky-config')).default()
        )
        .command('$0', 'Init all', yargs => {
        })
}
// await multi_command('init', [
//     {
//         name: '',
//         description: 'Init all',
//         async run(): Promise<void> {
//             Console.log(`init sky-config`)
//             await import('./init-sky-config')

//             Console.log(`init package.json`)
//             await import('./init-package.json')

//             Console.log(`init ts-configs`)
//             await import('./init-ts-configs')

//             Console.log(`init packages`)
//             await import('./init-packages')

//             Console.log(`init .gitignore`)
//             await import('./init-.gitignore')
//         },
//     },
//     {
//         name: 'sky-config',
//         description: 'sky.config.ts',
//     },
//     {
//         name: 'packages',
//         description: 'npm packages and configs',
//     },
//     {
//         name: 'package.json',
//         description: 'package.json',
//     },
//     {
//         name: 'ts-configs',
//         description: 'tsconfig.json for all modules and apps',
//     },
//     {
//         name: '.gitignore',
//         description: '.gitignore',
//     },
//     {
//         name: 'vscode-workspace',
//         description: 'vscode workspace',
//     },
//     {
//         name: 'vscode-workspace-tasks',
//         description: 'vscode workspace tasks',
//     },
// ])
