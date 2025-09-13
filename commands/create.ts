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
                    `./${argv.modulePath}/_{{GLOBAL_MODULE}}.ts`,
                    `./${argv.modulePath}/_${moduleName}.ts`
                )
                replaceFileContents(`./${argv.modulePath}/global.ts`, {
                    $GLOBAL_MODULE: moduleName,
                })
                replaceFileContents(`./${argv.modulePath}/index.ts`, {
                    $GLOBAL_MODULE: moduleName,
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
                    $GLOBAL_NAMESPACE: namespaceName,
                })
            }
        )
        .command(
            'global-single-module <module-path>',
            'Create module global single file',
            yargs =>
                yargs.positional('module-path', {
                    describe: 'module path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                const modulePath = path.dirname(argv.modulePath)
                fs.cpSync(path.resolve(skyPath, 'boilerplates/global-single-module'), modulePath, {
                    recursive: true,
                    force: false,
                })
                const moduleName = argv.modulePath.replace(/^.*(\\|\/|:)/, '')
                fs.renameSync(
                    `./${modulePath}/{{GLOBAL_SINGLE_MODULE}}.global.ts`,
                    `./${modulePath}/${moduleName}.global.ts`
                )
                fs.renameSync(
                    `./${modulePath}/{{GLOBAL_SINGLE_MODULE}}.ts`,
                    `./${modulePath}/${moduleName}.ts`
                )
                replaceFileContents(`./${modulePath}/${moduleName}.global.ts`, {
                    $GLOBAL_SINGLE_MODULE: `${moduleName}`,
                })
                replaceFileContents(`./${modulePath}/${moduleName}.ts`, {
                    $GLOBAL_SINGLE_MODULE: `${moduleName}`,
                })
            }
        )
        .command(
            'global-single-react-component <react-component-path>',
            'Create react component global single file',
            yargs =>
                yargs.positional('react-component-path', {
                    describe: 'react component path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                const reactComponentPath = path.dirname(argv.reactComponentPath)
                fs.cpSync(
                    path.resolve(skyPath, 'boilerplates/global-single-react-component'),
                    reactComponentPath,
                    {
                        recursive: true,
                        force: false,
                    }
                )
                const moduleName = argv.reactComponentPath.replace(/^.*(\\|\/|:)/, '')
                fs.renameSync(
                    `./${reactComponentPath}/{{GLOBAL_SINGLE_REACT_COMPONENT}}.global.ts`,
                    `./${reactComponentPath}/${moduleName}.global.ts`
                )
                fs.renameSync(
                    `./${reactComponentPath}/{{GLOBAL_SINGLE_REACT_COMPONENT}}.tsx`,
                    `./${reactComponentPath}/${moduleName}.tsx`
                )
                replaceFileContents(`./${reactComponentPath}/${moduleName}.global.ts`, {
                    $GLOBAL_SINGLE_REACT_COMPONENT: `${moduleName}`,
                })
                replaceFileContents(`./${reactComponentPath}/${moduleName}.tsx`, {
                    $GLOBAL_SINGLE_REACT_COMPONENT: `${moduleName}`,
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
                    `./${argv.modulePath}/_{{MODULE}}.ts`,
                    `./${argv.modulePath}/_${moduleName}.ts`
                )
                replaceFileContents(`./${argv.modulePath}/index.ts`, {
                    $MODULE: `${moduleName}`,
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
                    $NAMESPACE: namespaceName,
                })
            }
        )
        .command(
            'react-component <react-component-path>',
            'Create react component',
            yargs =>
                yargs.positional('react-component-path', {
                    describe: 'react component path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                const reactComponentPath = path.dirname(argv.reactComponentPath)
                fs.cpSync(
                    path.resolve(skyPath, 'boilerplates/react-component'),
                    reactComponentPath,
                    {
                        recursive: true,
                        force: false,
                    }
                )
                const moduleName = argv.reactComponentPath.replace(/^.*(\\|\/|:)/, '')
                fs.renameSync(
                    `./${reactComponentPath}/{{REACT_COMPONENT}}.tsx`,
                    `./${reactComponentPath}/${moduleName}.tsx`
                )
                replaceFileContents(`./${reactComponentPath}/${moduleName}.tsx`, {
                    $REACT_COMPONENT: `${moduleName}`,
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
