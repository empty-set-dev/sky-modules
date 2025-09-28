import 'sky/configuration/Sky.Module.global'
import { readdirSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

import Console from './Console'
import skyPath from './skyPath'

export interface DeployableModule {
    path: string
    name: string
    config: Sky.ModuleConfig
}

/**
 * Find all modules with module.json files for NPM deployment
 */
export default function findDeployableModules(): DeployableModule[] {
    const modules: DeployableModule[] = []

    // Scan all folders in project root
    const entries = readdirSync(skyPath, { withFileTypes: true })

    for (const entry of entries) {
        if (!entry.isDirectory()) continue

        const modulePath = entry.name
        const fullPath = join(skyPath, modulePath)
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
