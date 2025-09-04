import fs from 'fs'
import path from 'path'

import { Argv } from 'yargs'

import replaceFileContents from './lib/replaceFileContents'
import skyPath from './lib/skyPath'

export default function init(yargs: Argv): Argv {
    return yargs
        .command(
            'global-module <module-path>',
            'Create global module',
            yargs =>
                yargs.positional('module-path', {
                    describe: 'module path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                fs.cpSync(path.resolve(skyPath, 'boilerplates/global-module'), argv.modulePath, {
                    recursive: true,
                    force: false,
                })
                const moduleName = argv.modulePath.replace(/^.*(\\|\/|:)/, '')
                fs.renameSync(
                    `./${argv.modulePath}/_global-module.ts`,
                    `./${argv.modulePath}/_${moduleName}.ts`
                )
                replaceFileContents(`./${argv.modulePath}/global.ts`, {
                    'global-module': moduleName,
                })
                replaceFileContents(`./${argv.modulePath}/index.ts`, {
                    'global-module': moduleName,
                })
            }
        )
        .command(
            'global-namespace <namespace-path>',
            'Create global namespace',
            yargs =>
                yargs.positional('namespace-path', {
                    describe: 'namespace path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                fs.cpSync(
                    path.resolve(skyPath, 'boilerplates/global-namespace'),
                    argv.namespacePath,
                    {
                        recursive: true,
                        force: false,
                    }
                )
                const namespaceName = argv.namespacePath.replace(/^.*(\\|\/|:)/, '')
                replaceFileContents(`./${argv.namespacePath}/index.ts`, {
                    'global-namespace': namespaceName,
                })
            }
        )
        .command(
            'module <module-path>',
            'Create module',
            yargs =>
                yargs.positional('module-path', {
                    describe: 'module path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                fs.cpSync(path.resolve(skyPath, 'boilerplates/module'), argv.modulePath, {
                    recursive: true,
                    force: false,
                })
                const moduleName = argv.modulePath.replace(/^.*(\\|\/|:)/, '')
                fs.renameSync(
                    `./${argv.modulePath}/_module.ts`,
                    `./${argv.modulePath}/_${moduleName}.ts`
                )
                replaceFileContents(`./${argv.modulePath}/index.ts`, {
                    "module'": `${moduleName}'`,
                    'module:': `${moduleName}:`,
                })
            }
        )
        .command(
            'namespace <namespace-path>',
            'Create namespace',
            yargs =>
                yargs.positional('namespace-path', {
                    describe: 'namespace path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                fs.cpSync(path.resolve(skyPath, 'boilerplates/namespace'), argv.namespacePath, {
                    recursive: true,
                    force: false,
                })
                const namespaceName = argv.namespacePath.replace(/^.*(\\|\/|:)/, '')
                replaceFileContents(`./${argv.namespacePath}/index.ts`, {
                    namespace: namespaceName,
                })
            }
        )
        .command(
            '*',
            'Create workspace',
            () => null,
            async () => (await import('./init-all')).default()
        )
        .completion('completion', 'Generate completion for terminal')
}
