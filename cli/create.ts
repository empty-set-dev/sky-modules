import fs from 'fs'
import path from 'path'

import { Argv } from 'yargs'

import cliPath from './utilities/cliPath'
import replaceFileContents from './utilities/replaceFileContents'

function renameFile(filePath: string, newFilePath: string): void {
    if (fs.existsSync(`./${newFilePath}`)) {
        fs.rmSync(`./${filePath}`)
    } else {
        fs.renameSync(`./${filePath}`, `./${newFilePath}`)
    }
}

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
                fs.cpSync(path.resolve(cliPath, 'boilerplates/global-module'), argv.modulePath, {
                    recursive: true,
                    force: false,
                })
                const moduleName = argv.modulePath.replace(/^.*(\\|\/|:)/, '')

                renameFile(
                    `${argv.modulePath}/_{{GLOBAL_MODULE}}.ts`,
                    `${argv.modulePath}/_${moduleName}`
                )

                replaceFileContents(`./${argv.modulePath}/global.ts`, {
                    $GLOBAL_MODULE: moduleName,
                })
                replaceFileContents(`./${argv.modulePath}/index.ts`, {
                    '{{GLOBAL_MODULE}}': moduleName,
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
                    path.resolve(cliPath, 'boilerplates/global-namespace'),
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
            'module <module-path>',
            'Create module',
            yargs =>
                yargs.positional('module-path', {
                    describe: 'module path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                fs.cpSync(path.resolve(cliPath, 'boilerplates/module'), argv.modulePath, {
                    recursive: true,
                    force: false,
                })
                const moduleName = argv.modulePath.replace(/^.*(\\|\/|:)/, '')
                renameFile(
                    `./${argv.modulePath}/_{{MODULE}}.ts`,
                    `./${argv.modulePath}/_${moduleName}.ts`
                )
                replaceFileContents(`./${argv.modulePath}/index.ts`, {
                    '{{MODULE}}': `${moduleName}`,
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
                fs.cpSync(path.resolve(cliPath, 'boilerplates/namespace'), argv.namespacePath, {
                    recursive: true,
                    force: false,
                })
                const namespaceName = argv.namespacePath.replace(/^.*(\\|\/|:)/, '')
                replaceFileContents(`./${argv.namespacePath}/index.ts`, {
                    '{{NAMESPACE}}': namespaceName,
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
                    path.resolve(cliPath, 'boilerplates/react-component'),
                    reactComponentPath,
                    {
                        recursive: true,
                        force: false,
                    }
                )
                const moduleName = argv.reactComponentPath.replace(/^.*(\\|\/|:)/, '')
                renameFile(
                    `./${reactComponentPath}/{{REACT_COMPONENT}}.tsx`,
                    `./${reactComponentPath}/${moduleName}.tsx`
                )
                replaceFileContents(`./${reactComponentPath}/${moduleName}.tsx`, {
                    $REACT_COMPONENT: `${moduleName}`,
                })
            }
        )
        .command(
            'mitosis-component <mitosis-component-path>',
            'Create mitosis component',
            yargs =>
                yargs.positional('mitosis-component-path', {
                    describe: 'mitosis component path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                const mitosisComponentPath = argv.mitosisComponentPath
                fs.cpSync(
                    path.resolve(cliPath, 'boilerplates/mitosis-component'),
                    mitosisComponentPath,
                    {
                        recursive: true,
                        force: false,
                    }
                )
                const moduleName = argv.mitosisComponentPath.replace(/^.*(\\|\/|:)/, '')
                renameFile(
                    `./${mitosisComponentPath}/{{MITOSIS_COMPONENT}}.lite.css`,
                    `./${mitosisComponentPath}/${moduleName}.lite.css`
                )
                replaceFileContents(`./${mitosisComponentPath}/${moduleName}.lite.css`, {
                    $MITOSIS_COMPONENT: `${moduleName}`,
                })

                renameFile(
                    `./${mitosisComponentPath}/{{MITOSIS_COMPONENT}}.lite.tsx`,
                    `./${mitosisComponentPath}/${moduleName}.lite.tsx`
                )
                replaceFileContents(`./${mitosisComponentPath}/${moduleName}.lite.tsx`, {
                    $MITOSIS_COMPONENT_RECIPE: `${moduleName.slice(0, 1).toLowerCase() + moduleName.slice(1)}`,
                    $MITOSIS_COMPONENT: `${moduleName}`,
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })

                renameFile(
                    `./${mitosisComponentPath}/{{MITOSIS_COMPONENT}}.recipe.lite.ts`,
                    `./${mitosisComponentPath}/${moduleName}.recipe.lite.ts`
                )
                replaceFileContents(`./${mitosisComponentPath}/${moduleName}.recipe.lite.ts`, {
                    $MITOSIS_COMPONENT_RECIPE: `${moduleName.slice(0, 1).toLowerCase() + moduleName.slice(1)}`,
                    $MITOSIS_COMPONENT: `${moduleName}`,
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })

                replaceFileContents(`./${mitosisComponentPath}/index.lite.ts`, {
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })
            }
        )
        .command(
            'mitosis-slots-component <mitosis-slots-component-path>',
            'Create mitosis slots component',
            yargs =>
                yargs.positional('mitosis-slots-component-path', {
                    describe: 'mitosis slots component path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                const mitosisSlotsComponentPath = argv.mitosisSlotsComponentPath
                fs.cpSync(
                    path.resolve(cliPath, 'boilerplates/mitosis-slots-component'),
                    mitosisSlotsComponentPath,
                    {
                        recursive: true,
                        force: false,
                    }
                )
                const moduleName = argv.mitosisSlotsComponentPath.replace(/^.*(\\|\/|:)/, '')
                renameFile(
                    `./${mitosisSlotsComponentPath}/{{MITOSIS_COMPONENT}}.lite.css`,
                    `./${mitosisSlotsComponentPath}/${moduleName}.lite.css`
                )
                replaceFileContents(`./${mitosisSlotsComponentPath}/${moduleName}.lite.css`, {
                    $MITOSIS_COMPONENT: `${moduleName}`,
                })

                renameFile(
                    `./${mitosisSlotsComponentPath}/{{MITOSIS_COMPONENT}}.lite.tsx`,
                    `./${mitosisSlotsComponentPath}/${moduleName}.lite.tsx`
                )
                replaceFileContents(`./${mitosisSlotsComponentPath}/${moduleName}.lite.tsx`, {
                    $MITOSIS_COMPONENT_RECIPE: `${moduleName.slice(0, 1).toLowerCase() + moduleName.slice(1)}`,
                    $MITOSIS_COMPONENT: `${moduleName}`,
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })

                renameFile(
                    `./${mitosisSlotsComponentPath}/{{MITOSIS_COMPONENT}}.recipe.lite.ts`,
                    `./${mitosisSlotsComponentPath}/${moduleName}.recipe.lite.ts`
                )
                replaceFileContents(`./${mitosisSlotsComponentPath}/${moduleName}.recipe.lite.ts`, {
                    $MITOSIS_COMPONENT_RECIPE: `${moduleName.slice(0, 1).toLowerCase() + moduleName.slice(1)}`,
                    $MITOSIS_COMPONENT: `${moduleName}`,
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })

                replaceFileContents(`./${mitosisSlotsComponentPath}/index.lite.ts`, {
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })
            }
        )
        .command(
            'mitosis-controller <mitosis-controller-path>',
            'Create mitosis component',
            yargs =>
                yargs.positional('mitosis-controller-path', {
                    describe: 'mitosis controller path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                const mitosisControllerPath = argv.mitosisControllerPath
                fs.cpSync(
                    path.resolve(cliPath, 'boilerplates/mitosis-controller'),
                    mitosisControllerPath,
                    {
                        recursive: true,
                        force: false,
                    }
                )
                const moduleName = argv.mitosisControllerPath.replace(/^.*(\\|\/|:)/, '')
                renameFile(
                    `./${mitosisControllerPath}/{{MITOSIS_CONTROLLER}}Controller.ts`,
                    `./${mitosisControllerPath}/${moduleName}Controller.ts`
                )
                replaceFileContents(`./${mitosisControllerPath}/${moduleName}Controller.ts`, {
                    $MITOSIS_CONTROLLER: `${moduleName}`,
                })

                renameFile(
                    `./${mitosisControllerPath}/use{{MITOSIS_CONTROLLER}}Controller.ts`,
                    `./${mitosisControllerPath}/use${moduleName}Controller.ts`
                )
                replaceFileContents(`./${mitosisControllerPath}/${moduleName}Controller.ts`, {
                    $MITOSIS_CONTROLLER: `${moduleName}`,
                })
            }
        )
        .command(
            'slice <slice-path>',
            'Create slice config',
            yargs =>
                yargs.positional('slice-path', {
                    describe: 'slice path',
                    type: 'string',
                    demandOption: true,
                }),
            async argv => {
                fs.writeFileSync(
                    path.join(argv.slicePath, 'slice.json'),
                    JSON.stringify(
                        {
                            name: '',
                            description: '',
                            keywords: [],
                            access: '',
                            modules: [],
                            dependencies: [],
                            peerDependencies: [],
                        },
                        null,
                        '    '
                    ),
                    'utf-8'
                )
                fs.writeFileSync(
                    path.join(argv.slicePath, 'package.json'),
                    JSON.stringify(
                        {
                            name: '',
                            description: '',
                            type: 'module',
                        },
                        null,
                        '    '
                    ),
                    'utf-8'
                )
            }
        )
        .command(
            'workspace-config',
            'Create workspace config',
            () => null,
            async () => (await import('./create--workspace-config')).default()
        )
        .command(
            '*',
            'Create workspace',
            () => null,
            async () => (await import('./init--all')).default()
        )
        .completion('completion', 'Generate completion for terminal')
}
