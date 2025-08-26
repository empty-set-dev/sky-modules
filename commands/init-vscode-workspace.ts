#!/usr/bin/env -S pnpm exec bun
import fs from 'fs'

import { bright, green, reset } from 'sky/utilities/Console'

import loadSkyConfig from './lib/loadSkyConfig'

export default async function initVscodeWorkspaceTasks(): Promise<void> {
    const skyConfig = await loadSkyConfig()

    if (!skyConfig) {
        return
    }

    let vsCodeWorkspaceConfigPath = fs
        .readdirSync(process.cwd())
        .find(file => file.endsWith('.code-workspace'))

    if (!vsCodeWorkspaceConfigPath) {
        vsCodeWorkspaceConfigPath = `${
            skyConfig.id ? skyConfig.id : skyConfig.nameId
        }.code-workspace`
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

    process.stdout.write(`${green}${bright}Update ${vsCodeWorkspaceConfigPath}${reset}`)

    fs.writeFileSync(
        vsCodeWorkspaceConfigPath,
        JSON.stringify(vsCodeWorkspaceConfig, null, '    '),
        'utf-8'
    )

    process.stdout.write(` 👌\n`)
}
