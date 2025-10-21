import '@sky-modules/cli/configuration/Sky.App.namespace'
import fs from 'fs'

import { ArgumentsCamelCase } from 'yargs'

import { nodeCommands, mobileCommands, tauriCommands, webCommands } from './utilities/commands'
import { bright, green, reset } from './utilities/Console'
import loadSkyConfig, { getAppConfig } from './utilities/loadSkyConfig'

export default async function initVscodeWorkspaceTasks(argv: ArgumentsCamelCase): Promise<void> {
    const appName = argv.appName as undefined | string

    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    if (appName != null && !getAppConfig(appName, skyConfig)) {
        return
    }

    const vsCodeWorkspaceConfigPath = fs
        .readdirSync(process.cwd())
        .find(file => file.endsWith('.code-workspace'))

    if (!vsCodeWorkspaceConfigPath) {
        throw new Error('vscode workspace is missing')
    }

    const vsCodeWorkspaceConfig = JSON.parse(fs.readFileSync(vsCodeWorkspaceConfigPath, 'utf-8'))

    vsCodeWorkspaceConfig.tasks = {
        version: '2.0.0',
        tasks: [],
    }

    const apps = {
        ...(skyConfig.apps ?? {}),
        ...(skyConfig.playgrounds ?? {}),
    }

    if (appName == null && skyConfig.scripts != null && typeof skyConfig.scripts !== 'boolean') {
        for (const [name] of Object.entries(skyConfig.scripts)) {
            vsCodeWorkspaceConfig.tasks.tasks.push({
                label: `${name}`,
                type: 'shell',
                options: {
                    cwd: process.cwd(),
                },
                command: `pnpm run "${name}"`,
            })
        }
    }

    if (appName == null) {
        if (Object.keys(apps).length > 0) {
            Object.keys(apps).forEach(name => {
                vsCodeWorkspaceConfig.tasks.tasks.push({
                    label: `${name}`,
                    type: 'shell',
                    options: {
                        cwd: process.cwd(),
                    },
                    command: `pnpm exec sky init vscode-workspace-tasks ${name}`,
                })
            })
        }
    } else {
        vsCodeWorkspaceConfig.tasks.tasks.push({
            label: `<-`,
            type: 'shell',
            options: {
                cwd: process.cwd(),
            },
            command: `pnpm exec sky init vscode-workspace-tasks`,
        })

        const app: Sky.App = skyConfig.apps[appName] ?? skyConfig.playgrounds[appName]

        if (app.target === 'node') {
            nodeCommands.forEach(command =>
                vsCodeWorkspaceConfig.tasks.tasks.push({
                    label: `${appName}:node:${command}`,
                    type: 'shell',
                    options: {
                        cwd: process.cwd(),
                    },
                    command: `pnpm exec sky node ${command} ${appName}`,
                })
            )
        }

        if (app.target === 'universal') {
            webCommands.forEach(command =>
                vsCodeWorkspaceConfig.tasks.tasks.push({
                    label: `${appName}:web:${command}`,
                    type: 'shell',
                    options: {
                        cwd: process.cwd(),
                    },
                    command: `pnpm exec sky web ${command} ${appName}`,
                })
            )
            tauriCommands.forEach(command =>
                vsCodeWorkspaceConfig.tasks.tasks.push({
                    label: `${appName}:desktop:${command}`,
                    type: 'shell',
                    options: {
                        cwd: process.cwd(),
                    },
                    command: `pnpm exec sky desktop ${command} ${appName}`,
                })
            )
            mobileCommands.forEach(command =>
                vsCodeWorkspaceConfig.tasks.tasks.push({
                    label: `${appName}:${command.replaceAll(' ', ':')}`,
                    type: 'shell',
                    options: {
                        cwd: process.cwd(),
                    },
                    command: `sky ${command} ${appName}`,
                })
            )
        }

        if (app.target === 'web') {
            webCommands.forEach(command =>
                vsCodeWorkspaceConfig.tasks.tasks.push({
                    label: `${appName}:web:${command}`,
                    type: 'shell',
                    options: {
                        cwd: process.cwd(),
                    },
                    command: `pnpm exec sky web ${command} ${appName}`,
                })
            )
        }
    }

    process.stdout.write(`${green}${bright}Update ${vsCodeWorkspaceConfigPath}${reset}`)

    fs.writeFileSync(
        vsCodeWorkspaceConfigPath,
        JSON.stringify(vsCodeWorkspaceConfig, null, '    '),
        'utf-8'
    )

    process.stdout.write(` 👌\n`)
}
