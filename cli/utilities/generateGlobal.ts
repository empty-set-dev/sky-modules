import '@sky-modules/configuration/Sky.Slice.global'
import '@sky-modules/configuration/Sky.Module.global'
import { readFileSync, existsSync, statSync } from 'fs'
import { join } from 'path'

import skyPath from './skyPath'

type ConfigType = 'slice' | 'module'

interface ConfigInfo {
    type: ConfigType
    config: Sky.Slice | Sky.ModuleConfig
    configPath: string
}

/**
 * Determine config type and read configuration
 */
function getConfigInfo(path: string): ConfigInfo {
    const sliceJsonPath = join(skyPath, path, 'slice.json')
    const moduleJsonPath = join(skyPath, path, 'module.json')

    if (existsSync(sliceJsonPath)) {
        const config: Sky.Slice = JSON.parse(readFileSync(sliceJsonPath, 'utf-8'))
        return { type: 'slice', config, configPath: sliceJsonPath }
    }

    if (existsSync(moduleJsonPath)) {
        const config: Sky.ModuleConfig = JSON.parse(readFileSync(moduleJsonPath, 'utf-8'))
        return { type: 'module', config, configPath: moduleJsonPath }
    }

    throw new Error(`No slice.json or module.json found in ${path}`)
}

/**
 * Generates global.ts file that imports all .global.ts files from the modules
 */
export default function generateGlobal(path: string): string {
    const { type, config } = getConfigInfo(path)
    const modules = config.modules || []

    if (modules.length === 0) {
        return '// No modules to import\n'
    }

    const imports: string[] = []
    const moduleDir = join(skyPath, path)

    for (const moduleName of modules) {
        const moduleItemPath = join(moduleDir, moduleName)

        // Check if module is a directory or file
        if (existsSync(moduleItemPath) && statSync(moduleItemPath).isDirectory()) {
            // Directory module - check for global.ts inside
            const globalPath = join(moduleItemPath, 'global.ts')

            if (existsSync(globalPath)) {
                imports.push(`import './${moduleName}/global'`)
            }
        }

        // Check for .global.ts file (either moduleName.global.ts or in moduleName/ folder)
        const globalFileName = `${moduleName}.global.ts`
        const globalFilePath = join(moduleDir, globalFileName)

        if (existsSync(globalFilePath)) {
            imports.push(`import './${moduleName}.global'`)
        }
    }

    if (imports.length === 0) {
        return '// No global files found\n'
    }

    // Generate content
    const header = `// Auto-generated global imports for @sky-modules/${path}\n// Generated from ${type}.json modules\n\n`

    return header + imports.join('\n') + '\n'
}
