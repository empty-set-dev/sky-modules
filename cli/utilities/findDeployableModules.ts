import '@sky-modules/cli/configuration/Sky.Module.global'
import { readdirSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

import Console from './Console'
import workspaceRoot from './workspaceRoot'

export interface DeployableModule {
    path: string
    name: string
    config: Sky.ModuleConfig
}

/**
 * Find all modules with module.json files for NPM deployment
 */
export default function findDeployableModules(): DeployableModule[] {
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

    const modules: DeployableModule[] = []

    // Scan all folders in project root
    const entries = readdirSync(workspaceRoot, { withFileTypes: true })

    for (const entry of entries) {
        if (!entry.isDirectory()) continue

        const modulePath = entry.name
        const fullPath = join(workspaceRoot, modulePath)
        const moduleJsonPath = join(fullPath, 'module.json')

        // Check for module.json existence
        if (!existsSync(moduleJsonPath)) continue

        try {
            // Read and parse module.json
            const configContent = readFileSync(moduleJsonPath, 'utf-8')
            const config = JSON.parse(configContent) as Sky.ModuleConfig

            modules.push({
                path: modulePath,
                name: config.name,
                config,
            })
        } catch (error) {
            Console.warn(`⚠️  Failed to parse module.json in ${modulePath}:`, error)
        }
    }

    return modules
}
