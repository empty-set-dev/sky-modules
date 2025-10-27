import fs from 'fs'
import path from 'path'

import { Argv } from 'yargs'

import {
    copyBoilerplate,
    extractModuleName,
    renameFile,
    replaceInFile,
} from './utilities/createHelpers'

export default function create(yargs: Argv): Argv {
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
                copyBoilerplate('global-module', argv.modulePath)
                const moduleName = extractModuleName(argv.modulePath)

                renameFile(
                    `${argv.modulePath}/_{{GLOBAL_MODULE}}.ts`,
                    `${argv.modulePath}/_${moduleName}`
                )

                replaceInFile(`${argv.modulePath}/global.ts`, {
                    $GLOBAL_MODULE: moduleName,
                })
                replaceInFile(`${argv.modulePath}/index.ts`, {
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
                copyBoilerplate('global-namespace', argv.namespacePath)
                const namespaceName = extractModuleName(argv.namespacePath)
                replaceInFile(`${argv.namespacePath}/index.ts`, {
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
                copyBoilerplate('module', argv.modulePath)
                const moduleName = extractModuleName(argv.modulePath)
                renameFile(
                    `./${argv.modulePath}/_{{MODULE}}.ts`,
                    `./${argv.modulePath}/_${moduleName}.ts`
                )
                replaceInFile(`${argv.modulePath}/index.ts`, {
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
                copyBoilerplate('namespace', argv.namespacePath)
                const namespaceName = extractModuleName(argv.namespacePath)
                replaceInFile(`${argv.namespacePath}/index.ts`, {
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
                copyBoilerplate('react-component', reactComponentPath)
                const moduleName = extractModuleName(argv.reactComponentPath)
                renameFile(
                    `./${reactComponentPath}/{{REACT_COMPONENT}}.tsx`,
                    `./${reactComponentPath}/${moduleName}.tsx`
                )
                replaceInFile(`${reactComponentPath}/${moduleName}.tsx`, {
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
                copyBoilerplate('mitosis-component', mitosisComponentPath)
                const moduleName = extractModuleName(argv.mitosisComponentPath)
                const recipeVariant = moduleName.slice(0, 1).toLowerCase() + moduleName.slice(1)

                renameFile(
                    `./${mitosisComponentPath}/{{MITOSIS_COMPONENT}}.lite.css`,
                    `./${mitosisComponentPath}/${moduleName}.lite.css`
                )
                replaceInFile(`${mitosisComponentPath}/${moduleName}.lite.css`, {
                    $MITOSIS_COMPONENT: `${moduleName}`,
                })

                renameFile(
                    `./${mitosisComponentPath}/{{MITOSIS_COMPONENT}}.lite.tsx`,
                    `./${mitosisComponentPath}/${moduleName}.lite.tsx`
                )
                replaceInFile(`${mitosisComponentPath}/${moduleName}.lite.tsx`, {
                    $MITOSIS_COMPONENT_RECIPE: recipeVariant,
                    $MITOSIS_COMPONENT: `${moduleName}`,
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })

                renameFile(
                    `./${mitosisComponentPath}/{{MITOSIS_COMPONENT}}.recipe.lite.ts`,
                    `./${mitosisComponentPath}/${moduleName}.recipe.lite.ts`
                )
                replaceInFile(`${mitosisComponentPath}/${moduleName}.recipe.lite.ts`, {
                    $MITOSIS_COMPONENT_RECIPE: recipeVariant,
                    $MITOSIS_COMPONENT: `${moduleName}`,
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })

                replaceInFile(`${mitosisComponentPath}/index.lite.ts`, {
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
                copyBoilerplate('mitosis-slots-component', mitosisSlotsComponentPath)
                const moduleName = extractModuleName(argv.mitosisSlotsComponentPath)
                const recipeVariant = moduleName.slice(0, 1).toLowerCase() + moduleName.slice(1)

                renameFile(
                    `./${mitosisSlotsComponentPath}/{{MITOSIS_COMPONENT}}.lite.css`,
                    `./${mitosisSlotsComponentPath}/${moduleName}.lite.css`
                )
                replaceInFile(`${mitosisSlotsComponentPath}/${moduleName}.lite.css`, {
                    $MITOSIS_COMPONENT: `${moduleName}`,
                })

                renameFile(
                    `./${mitosisSlotsComponentPath}/{{MITOSIS_COMPONENT}}.lite.tsx`,
                    `./${mitosisSlotsComponentPath}/${moduleName}.lite.tsx`
                )
                replaceInFile(`${mitosisSlotsComponentPath}/${moduleName}.lite.tsx`, {
                    $MITOSIS_COMPONENT_RECIPE: recipeVariant,
                    $MITOSIS_COMPONENT: `${moduleName}`,
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })

                renameFile(
                    `./${mitosisSlotsComponentPath}/{{MITOSIS_COMPONENT}}.recipe.lite.ts`,
                    `./${mitosisSlotsComponentPath}/${moduleName}.recipe.lite.ts`
                )
                replaceInFile(`${mitosisSlotsComponentPath}/${moduleName}.recipe.lite.ts`, {
                    $MITOSIS_COMPONENT_RECIPE: recipeVariant,
                    $MITOSIS_COMPONENT: `${moduleName}`,
                    '{{MITOSIS_COMPONENT}}': `${moduleName}`,
                })

                replaceInFile(`${mitosisSlotsComponentPath}/index.lite.ts`, {
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
                copyBoilerplate('mitosis-controller', mitosisControllerPath)
                const moduleName = extractModuleName(argv.mitosisControllerPath)

                renameFile(
                    `./${mitosisControllerPath}/{{MITOSIS_CONTROLLER}}Controller.ts`,
                    `./${mitosisControllerPath}/${moduleName}Controller.ts`
                )
                replaceInFile(`${mitosisControllerPath}/${moduleName}Controller.ts`, {
                    $MITOSIS_CONTROLLER: `${moduleName}`,
                })

                renameFile(
                    `./${mitosisControllerPath}/use{{MITOSIS_CONTROLLER}}Controller.ts`,
                    `./${mitosisControllerPath}/use${moduleName}Controller.ts`
                )
                replaceInFile(`${mitosisControllerPath}/${moduleName}Controller.ts`, {
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
