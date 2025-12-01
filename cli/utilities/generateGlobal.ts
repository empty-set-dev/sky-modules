import '@sky-modules/cli/configuration/Sky.Slice.namespace'
import '@sky-modules/cli/configuration/Sky.Module.namespace'
import { readFileSync, existsSync, statSync, readdirSync } from 'fs'
import { join } from 'path'

import workspaceRoot from './workspaceRoot'

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
        throw new Error('Sky workspace not found')
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

/**
 * Recursively find all global.ts files in subdirectories
 */
function findGlobalFiles(dir: string, relativePath = '', separateModules: string[] = []): string[] {
    const imports: string[] = []

    try {
        const entries = readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
            // Skip hidden files, node_modules, and dev directories
            if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                continue
            }

            // Skip directories in separateModules (only check at root level)
            if (!relativePath && separateModules.includes(entry.name)) {
                continue
            }

            const fullPath = join(dir, entry.name)
            const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name

            if (entry.isDirectory()) {
                // Skip jsx-runtime directories
                if (entry.name === 'jsx-runtime' || entry.name === 'jsx-dev-runtime') {
                    continue
                }

                // Skip lite-only directories
                const dirFiles = readdirSync(fullPath)
                const hasLiteFiles = dirFiles.some(f => /\.lite\.(ts|tsx|js|jsx)$/.test(f))
                const hasRegularModuleFiles = dirFiles.some(f => {
                    const ext = ['.ts', '.tsx', '.js', '.jsx']
                    const hasValidExt = ext.some(e => f.endsWith(e))
                    const isNotLite = !/\.lite\.(ts|tsx|js|jsx)$/.test(f)
                    const isNotTest = !f.includes('.test.') && !f.includes('.spec.')
                    const isNotIndex = !f.startsWith('index.')
                    const isNotGlobal = !f.startsWith('global.') && !f.includes('.global.')
                    const isNotExample = !f.includes('.example.')
                    return hasValidExt && isNotLite && isNotTest && isNotIndex && isNotGlobal && isNotExample
                })

                if (hasLiteFiles && !hasRegularModuleFiles) {
                    continue
                }

                // Check for global/ folder in this directory
                const globalDir = join(fullPath, 'global')
                if (existsSync(globalDir)) {
                    imports.push(`import './${relPath}/global'`)
                    // Don't recurse into directories that have global/ folder
                    // Their global/index.ts should import their subdirectories
                    continue
                }

                // Recursively search subdirectories
                imports.push(...findGlobalFiles(fullPath, relPath, separateModules))
            }
        }
    } catch (error) {
        // Ignore directories we can't read
    }

    return imports
}

/**
 * Generates global/index.ts file that imports all global/ folders from the modules
 */
export default function generateGlobal(path: string): string {
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    const { type, config } = getConfigInfo(path)
    const modules = config.modules || []
    const separateModules = (config as Sky.Slice).separateModules || []

    if (modules.length === 0) {
        return '// No modules to import\n'
    }

    const imports: string[] = []
    const moduleDir = join(workspaceRoot, path)

    // Check if modules contains "." - meaning scan all subdirectories
    if (modules.includes('.')) {
        // First, collect .global.ts files in current directory
        const entries = readdirSync(moduleDir, { withFileTypes: true })

        for (const entry of entries) {
            if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                continue
            }

            if (entry.isDirectory()) {
                const dirPath = join(moduleDir, entry.name)

                // Skip jsx-runtime directories
                if (entry.name === 'jsx-runtime' || entry.name === 'jsx-dev-runtime') {
                    continue
                }

                // Skip lite-only directories
                const dirFiles = readdirSync(dirPath)
                const hasLiteFiles = dirFiles.some(f => /\.lite\.(ts|tsx|js|jsx)$/.test(f))
                const hasRegularModuleFiles = dirFiles.some(f => {
                    const ext = ['.ts', '.tsx', '.js', '.jsx']
                    const hasValidExt = ext.some(e => f.endsWith(e))
                    const isNotLite = !/\.lite\.(ts|tsx|js|jsx)$/.test(f)
                    const isNotTest = !f.includes('.test.') && !f.includes('.spec.')
                    const isNotIndex = !f.startsWith('index.')
                    const isNotGlobal = !f.startsWith('global.') && !f.includes('.global.')
                    const isNotExample = !f.includes('.example.')
                    return hasValidExt && isNotLite && isNotTest && isNotIndex && isNotGlobal && isNotExample
                })

                if (hasLiteFiles && !hasRegularModuleFiles) {
                    continue
                }
            }
            // Note: .global.ts files no longer exist at root level
            // All global implementations are now in global/ folders
        }

        // Recursively find all global files
        const foundImports = findGlobalFiles(moduleDir, '', separateModules)
        imports.push(...foundImports)
    } else {
        // Process specific modules
        for (const moduleName of modules) {
            const moduleItemPath = join(moduleDir, moduleName)

            // Check if module is a directory or file
            if (existsSync(moduleItemPath) && statSync(moduleItemPath).isDirectory()) {
                // Directory module - check for global/ folder inside
                const globalDir = join(moduleItemPath, 'global')

                if (existsSync(globalDir)) {
                    imports.push(`import './${moduleName}/global'`)
                }
            }

            // Note: .global.ts files no longer exist
            // All global implementations are now in global/ folders
        }
    }

    if (imports.length === 0) {
        return '// No global files found\n'
    }

    // Sort imports for consistency
    imports.sort()

    // Generate content
    const header = `// Auto-generated global imports for @sky-modules/${path}\n// Generated from ${type}.json modules\n\n`

    return header + imports.join('\n') + '\n'
}
