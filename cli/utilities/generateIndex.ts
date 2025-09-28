import '@sky-modules/configuration/Sky.Slice.global'
import '@sky-modules/configuration/Sky.Module.global'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

import Console from './Console'
import skyPath from './skyPath'

// Supported file extensions for modules
const MODULE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

/**
 * Check if module file exists with any supported extension
 */
function moduleFileExists(modulePath: string): boolean {
    return MODULE_EXTENSIONS.some(ext => existsSync(`${modulePath}${ext}`))
}

/**
 * Find module file with extension
 */
function findModuleFile(modulePath: string): string | null {
    for (const ext of MODULE_EXTENSIONS) {
        const filePath = `${modulePath}${ext}`

        if (existsSync(filePath)) {
            return filePath
        }
    }

    return null
}

/**
 * Check if file has default export
 */
function hasDefaultExport(filePath: string): boolean {
    try {
        const content = readFileSync(filePath, 'utf-8')
        return /export\s+default\s+/.test(content) || /export\s*\{\s*default\s*\}/.test(content)
    } catch {
        return false
    }
}

/**
 * Check if file has named exports
 */
function hasNamedExports(filePath: string): boolean {
    try {
        const content = readFileSync(filePath, 'utf-8')
        return (
            /export\s*\*/.test(content) ||
            /export\s*\{[^}]*[^d][^e][^f][^a][^u][^l][^t]/.test(content) ||
            /export\s+(const|function|class|let|var)/.test(content)
        )
    } catch {
        return false
    }
}

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

export default function generateIndex(path: string): string {
    const { type, config } = getConfigInfo(path)
    const modules = config.modules || []

    if (modules.length === 0) {
        throw new Error(`No modules specified in ${type}.json for ${path}`)
    }

    const exports: string[] = []
    const moduleDir = join(skyPath, path)

    for (const moduleName of modules) {
        const moduleItemPath = join(moduleDir, moduleName)

        if (!existsSync(moduleItemPath) && !moduleFileExists(moduleItemPath)) {
            Console.warn(`⚠️  Module ${moduleName} not found in ${path}`)
            continue
        }

        if (existsSync(moduleItemPath) && statSync(moduleItemPath).isDirectory()) {
            // Check for index file with any supported extension
            const indexFile = MODULE_EXTENSIONS.map(ext =>
                join(moduleItemPath, `index${ext}`)
            ).find(indexPath => existsSync(indexPath))

            if (indexFile) {
                const hasDefault = hasDefaultExport(indexFile)
                const hasNamed = hasNamedExports(indexFile)

                if (hasDefault && hasNamed) {
                    // Both default and named exports
                    exports.push(`export { default as ${moduleName} } from './${moduleName}'`)
                    exports.push(`export * from './${moduleName}'`)
                } else if (hasDefault) {
                    // Only default export
                    exports.push(`export { default as ${moduleName} } from './${moduleName}'`)
                } else {
                    // Only named exports or star exports
                    exports.push(`export * from './${moduleName}'`)
                }
            } else {
                // Check for any module files in directory
                const files = readdirSync(moduleItemPath).filter(f => {
                    const hasValidExt = MODULE_EXTENSIONS.some(ext => f.endsWith(ext))
                    const isNotTest = !f.includes('.test.') && !f.includes('.spec.')
                    return hasValidExt && isNotTest
                })

                if (files.length > 0) {
                    exports.push(`export * from './${moduleName}'`)
                }
            }
        } else if (moduleFileExists(moduleItemPath)) {
            const moduleFile = findModuleFile(moduleItemPath)

            if (moduleFile) {
                const hasDefault = hasDefaultExport(moduleFile)
                const hasNamed = hasNamedExports(moduleFile)

                if (hasDefault && hasNamed) {
                    // Both default and named exports
                    exports.push(`export { default as ${moduleName} } from './${moduleName}'`)
                    exports.push(`export * from './${moduleName}'`)
                } else if (hasDefault) {
                    // Only default export
                    exports.push(`export { default as ${moduleName} } from './${moduleName}'`)
                } else {
                    // Only named exports
                    exports.push(`export * from './${moduleName}'`)
                }
            }
        }
    }

    if (exports.length === 0) {
        throw new Error(`No valid modules found for ${type} ${path}`)
    }

    const header = `// Auto-generated index file for @sky-modules/${path}\n// Generated from ${type}.json configuration\n\n`

    return header + exports.join('\n') + '\n'
}
