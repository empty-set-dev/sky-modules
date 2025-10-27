// Shared helper functions for generate commands
import { existsSync, readFileSync, readdirSync } from 'fs'
import path from 'path'

import { filePredicates, MODULE_EXTENSIONS } from './filePredicates'
import { getDefaultExportInfo, getDefaultExportName } from './generateGlobalFile'
import { removeExtension, shouldSkipDirectory } from './pathHelpers'

/**
 * Read separateModules from slice.json if it exists
 */
export function getSeparateModules(basePath: string): string[] {
    const sliceJsonPath = path.join(basePath, 'slice.json')

    if (existsSync(sliceJsonPath)) {
        try {
            const sliceJson = JSON.parse(readFileSync(sliceJsonPath, 'utf-8'))
            return sliceJson.separateModules || []
        } catch {
            return []
        }
    }

    return []
}

/**
 * Check if directory contains module files
 */
export function hasModuleFiles(dirPath: string): boolean {
    try {
        const files = readdirSync(dirPath)
        return files.some(
            file =>
                filePredicates.isModule(file) &&
                !filePredicates.isTest(file) &&
                !filePredicates.isIndex(file) &&
                !filePredicates.isGlobal(file) &&
                !filePredicates.isExample(file)
        )
    } catch {
        return false
    }
}

/**
 * Check if directory contains .lite.* files
 */
export function hasLiteFiles(dirPath: string): boolean {
    try {
        const files = readdirSync(dirPath)
        return files.some(file => filePredicates.isLite(file))
    } catch {
        return false
    }
}

/**
 * Convert filename to valid JavaScript identifier
 * Replace hyphens and dots with underscores
 */
export function toValidIdentifier(name: string): string {
    return name.replace(/[-.]/g, '_')
}

/**
 * Generate index.ts for a directory without config (scan files directly)
 */
export function generateIndexForDirectory(
    dirPath: string,
    isLiteIndex = false,
    separateModules: string[] = []
): string {
    const fullPath = path.resolve(dirPath)
    const dirName = path.basename(fullPath)
    const entries = readdirSync(fullPath, { withFileTypes: true })
    const imports: string[] = []
    const exports: string[] = []

    // Collect directories first to avoid duplicates
    const directories = new Set(
        entries
            .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
            .map(entry => entry.name)
    )

    for (const entry of entries) {
        // Skip hidden files and common exclusions
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
            continue
        }

        if (entry.isDirectory()) {
            // Skip directories in separateModules
            if (separateModules.includes(entry.name)) {
                continue
            }

            // Skip jsx-runtime directories
            if (entry.name === 'jsx-runtime' || entry.name === 'jsx-dev-runtime') {
                continue
            }

            const subdirPath = path.join(fullPath, entry.name)

            // Check if directory has index file
            const hasIndex = MODULE_EXTENSIONS.some(ext =>
                existsSync(path.join(subdirPath, `index${ext}`))
            )

            // Skip if this is a lite-only directory (for regular index)
            if (!isLiteIndex && hasLiteFiles(subdirPath) && !hasModuleFiles(subdirPath)) {
                continue
            }

            if (hasIndex) {
                exports.push(`export * from './${entry.name}'`)
            }
        } else {
            const hasLite = filePredicates.isLite(entry.name)

            // For lite index: include only .lite.* files
            // For regular index: exclude .lite.* files
            if (isLiteIndex && !hasLite) {
                continue
            }
            if (!isLiteIndex && hasLite) {
                continue
            }

            if (
                !filePredicates.isModule(entry.name) ||
                filePredicates.isTest(entry.name) ||
                filePredicates.isIndex(entry.name) ||
                filePredicates.isInternal(entry.name) ||
                filePredicates.isExample(entry.name) ||
                filePredicates.isRecipe(entry.name) ||
                filePredicates.isContext(entry.name) ||
                filePredicates.isJsxRuntime(entry.name)
            ) {
                continue
            }

            // Handle .extension.*, .namespace.*, and .implementation.* files (side-effect imports)
            if (
                filePredicates.isExtension(entry.name) ||
                filePredicates.isNamespace(entry.name) ||
                filePredicates.isImplementation(entry.name)
            ) {
                const baseName = removeExtension(entry.name)
                imports.push(`import './${baseName}'`)
                continue
            }

            if (filePredicates.isGlobal(entry.name)) {
                continue
            }

            // Get base name without extension
            const baseName = removeExtension(entry.name)

            // Skip if there's a directory with same name
            if (directories.has(baseName)) {
                continue
            }

            // Check if file has default export
            const filePath = path.join(fullPath, entry.name)
            const { hasDefault, isTypeOnly } = getDefaultExportInfo(filePath)

            if (hasDefault) {
                // If file name matches directory name, export default as default
                if (baseName === dirName) {
                    if (isTypeOnly) {
                        exports.push(`export type { default } from './${baseName}'`)
                    } else {
                        exports.push(`export { default } from './${baseName}'`)
                    }
                } else {
                    // Get the actual export name from the file
                    const content = readFileSync(filePath, 'utf-8')
                    const actualExportName = getDefaultExportName(content)

                    // If we found the actual export name, use it; otherwise fall back to sanitized name
                    const exportName = actualExportName || (hasLite ? baseName.replace(/\.lite$/, '') : baseName)
                    const validName = actualExportName || toValidIdentifier(exportName)

                    if (isTypeOnly) {
                        exports.push(`export type { default as ${validName} } from './${baseName}'`)
                    } else {
                        exports.push(`export { default as ${validName} } from './${baseName}'`)
                    }
                }
            }

            exports.push(`export * from './${baseName}'`)
        }
    }

    if (imports.length === 0 && exports.length === 0) {
        return '// No modules to export\n'
    }

    let content = '// Auto-generated index file\n\n'

    if (imports.length > 0) {
        content += imports.join('\n') + '\n\n'
    }

    if (exports.length > 0) {
        content += exports.join('\n') + '\n'
    }

    return content
}

/**
 * Generate global.ts for a directory without config (scan files directly)
 */
export function generateGlobalForDirectory(dirPath: string, separateModules: string[] = []): string {
    const fullPath = path.resolve(dirPath)
    const entries = readdirSync(fullPath, { withFileTypes: true })
    const imports: string[] = []

    for (const entry of entries) {
        // Skip hidden files and common exclusions
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
            continue
        }

        if (entry.isDirectory()) {
            // Skip directories in separateModules
            if (separateModules.includes(entry.name)) {
                continue
            }

            // Skip jsx-runtime directories
            if (entry.name === 'jsx-runtime' || entry.name === 'jsx-dev-runtime') {
                continue
            }

            const subdirPath = path.join(fullPath, entry.name)

            // Skip lite-only directories
            if (hasLiteFiles(subdirPath) && !hasModuleFiles(subdirPath)) {
                continue
            }

            // Check if directory has global.ts
            const globalPath = path.join(subdirPath, 'global.ts')

            if (existsSync(globalPath)) {
                imports.push(`import './${entry.name}/global'`)
            }
        } else {
            // Check for .global.*, .extension.*, .namespace.*, and .implementation.* files
            // Include both regular and .lite versions
            if (filePredicates.isSpecialFile(entry.name)) {
                const baseName = removeExtension(entry.name)
                imports.push(`import './${baseName}'`)
            }
        }
    }

    if (imports.length === 0) {
        return '// No global files found\n'
    }

    // Sort imports for consistency
    imports.sort()

    return `// Auto-generated global imports\n\n${imports.join('\n')}\n`
}

export { shouldSkipDirectory }
