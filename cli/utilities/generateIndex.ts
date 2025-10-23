import '../configuration/Sky.Slice.namespace'
import '../configuration/Sky.Module.namespace'

import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

import Console from './Console'
import { getDefaultExportInfo } from './generateGlobalFile'
import workspaceRoot from './workspaceRoot'

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
        return (
            /export\s+default\s+/.test(content) ||
            /export\s*\{\s*default\s*\}/.test(content) ||
            /export\s+type\s*\{\s*default\s*\}/.test(content)
        )
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

/**
 * Convert filename to valid JavaScript identifier
 * Replace hyphens with underscores to create valid export names
 */
function toValidIdentifier(name: string): string {
    return name.replace(/-/g, '_')
}

/**
 * Generate default export statement
 * For directories with index files, check the actual module file (moduleName/moduleName.ts)
 */
function generateDefaultExport(indexFilePath: string, moduleName: string, validName: string): string {
    // Try to find the actual module file (e.g., Callback/Callback.ts)
    const moduleDir = join(indexFilePath, '..')
    const actualModuleFile = findModuleFile(join(moduleDir, moduleName))

    // If we found the actual module file, check it for type-only export
    // Otherwise fall back to checking the index file
    const fileToCheck = actualModuleFile || indexFilePath
    const { isTypeOnly } = getDefaultExportInfo(fileToCheck)

    if (isTypeOnly) {
        return `export type { default as ${validName} } from './${moduleName}'`
    } else {
        return `export { default as ${validName} } from './${moduleName}'`
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
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

    const sliceJsonPath = join(workspaceRoot, path, 'slice.json')
    const moduleJsonPath = join(workspaceRoot, path, 'module.json')

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
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

    const { type, config } = getConfigInfo(path)
    const modules = config.modules || []

    if (modules.length === 0) {
        throw new Error(`No modules specified in ${type}.json for ${path}`)
    }

    const exports: string[] = []
    const moduleDir = join(workspaceRoot, path)

    for (const moduleName of modules) {
        // Special handling for "." - find all modules in current directory
        if (moduleName === '.') {
            const allItems = readdirSync(moduleDir)

            // First, collect all directory names to avoid duplicates with files
            const directories = new Set(
                allItems.filter(item => {
                    const itemPath = join(moduleDir, item)
                    return statSync(itemPath).isDirectory() && !item.startsWith('.')
                })
            )

            const items = allItems.filter(item => {
                const itemPath = join(moduleDir, item)
                const stat = statSync(itemPath)

                // Include directories
                if (stat.isDirectory()) {
                    return !item.startsWith('.')
                }

                // For files: exclude if there's a directory with the same base name
                const baseName = item.replace(/\.(ts|tsx|js|jsx)$/, '')

                if (directories.has(baseName)) {
                    return false
                }

                const hasValidExt = MODULE_EXTENSIONS.some(ext => item.endsWith(ext))
                const isNotIndex = !item.startsWith('index.')
                const isNotTest = !item.includes('.test.') && !item.includes('.spec.')

                return hasValidExt && isNotIndex && isNotTest
            })

            for (const item of items) {
                const itemPath = join(moduleDir, item)
                const stat = statSync(itemPath)

                if (stat.isDirectory()) {
                    // Check if directory has index file
                    const indexFile = MODULE_EXTENSIONS.map(ext =>
                        join(itemPath, `index${ext}`)
                    ).find(indexPath => existsSync(indexPath))

                    if (indexFile) {
                        const hasDefault = hasDefaultExport(indexFile)
                        const hasNamed = hasNamedExports(indexFile)
                        const validName = toValidIdentifier(item)

                        if (hasDefault && hasNamed) {
                            exports.push(generateDefaultExport(indexFile, item, validName))
                            exports.push(`export * from './${item}'`)
                        } else if (hasDefault) {
                            exports.push(generateDefaultExport(indexFile, item, validName))
                        } else {
                            exports.push(`export * from './${item}'`)
                        }
                    } else {
                        // No index file, just export all from directory
                        exports.push(`export * from './${item}'`)
                    }
                } else {
                    // It's a file
                    const moduleName = item.replace(/\.(ts|tsx|js|jsx)$/, '')
                    const validName = toValidIdentifier(moduleName)
                    const hasDefault = hasDefaultExport(itemPath)
                    const hasNamed = hasNamedExports(itemPath)

                    if (hasDefault && hasNamed) {
                        exports.push(generateDefaultExport(itemPath, moduleName, validName))
                        exports.push(`export * from './${moduleName}'`)
                    } else if (hasDefault) {
                        exports.push(generateDefaultExport(itemPath, moduleName, validName))
                    } else {
                        exports.push(`export * from './${moduleName}'`)
                    }
                }
            }

            continue
        }

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
                const validName = toValidIdentifier(moduleName)

                if (hasDefault && hasNamed) {
                    // Both default and named exports
                    exports.push(generateDefaultExport(indexFile, moduleName, validName))
                    exports.push(`export * from './${moduleName}'`)
                } else if (hasDefault) {
                    // Only default export
                    exports.push(generateDefaultExport(indexFile, moduleName, validName))
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
                const validName = toValidIdentifier(moduleName)

                if (hasDefault && hasNamed) {
                    // Both default and named exports
                    exports.push(generateDefaultExport(moduleFile, moduleName, validName))
                    exports.push(`export * from './${moduleName}'`)
                } else if (hasDefault) {
                    // Only default export
                    exports.push(generateDefaultExport(moduleFile, moduleName, validName))
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
