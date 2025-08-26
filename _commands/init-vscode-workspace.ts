#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'

import __loadSkyConfig from './lib/loadSkyConfig'

await initVscodeWorkspaceTasks()

async function initVscodeWorkspaceTasks(): Promise<void> {
    const skyConfig = await __loadSkyConfig()

    if (!skyConfig) {
        return
    }

    let vsCodeWorkspaceConfigPath = fs
        .readdirSync(process.cwd())
        .find(file => file.endsWith('.code-workspace'))

    if (!vsCodeWorkspaceConfigPath) {
        vsCodeWorkspaceConfigPath = `${
            skyConfig.id ? skyConfig.id : skyConfig.name.replaceAll(' ', '-').toLocaleLowerCase()
        }.vscode-workspace`
        fs.writeFileSync(vsCodeWorkspaceConfigPath, '{\n\n}\n', 'utf-8')
    }

    const vsCodeWorkspaceConfig = JSON.parse(fs.readFileSync(vsCodeWorkspaceConfigPath, 'utf-8'))
    vsCodeWorkspaceConfig.folders = []
    const folders = skyConfig.folders
    if (folders != null) {
        Object.keys(folders).forEach(k => {
            vsCodeWorkspaceConfig.folders.push({ name: folders[k], path: k })
        })
    } else {
        vsCodeWorkspaceConfig.folders = [{ path: ',' }]
    }

    fs.writeFileSync(
        vsCodeWorkspaceConfigPath,
        JSON.stringify(vsCodeWorkspaceConfig, null, '    '),
        'utf-8'
    )
}
