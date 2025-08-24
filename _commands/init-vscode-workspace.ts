#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'

import SkyApp from '../configuration/SkyApp'

import { nodeCommands, mobileCommands, tauriCommands, webCommands } from './lib/commands'
import __loadSkyConfig from './lib/loadSkyConfig'

await initVscodeWorkspaceTasks()

async function initVscodeWorkspaceTasks(): Promise<void> {
    const appName = process.argv[4]

    const skyConfig = await __loadSkyConfig()

    if (!skyConfig) {
        return
    }

    let vsCodeWorkspaceConfigPath = fs
        .readdirSync(process.cwd())
        .find(file => file.endsWith('.code-workspace'))

    if (!vsCodeWorkspaceConfigPath) {
        vsCodeWorkspaceConfigPath = `${
            skyConfig.package
                ? skyConfig.package
                : skyConfig.name.replaceAll(' ', '-').toLocaleLowerCase()
        }.vscode-workspace`
        fs.writeFileSync(vsCodeWorkspaceConfigPath, '{\n\n}\n', 'utf-8')
    }

    const vsCodeWorkspaceConfig = JSON.parse(fs.readFileSync(vsCodeWorkspaceConfigPath, 'utf-8'))

    fs.writeFileSync(
        vsCodeWorkspaceConfigPath,
        JSON.stringify(vsCodeWorkspaceConfig, null, '    '),
        'utf-8'
    )
}
