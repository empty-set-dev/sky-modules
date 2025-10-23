import { readFileSync } from 'fs'
import { basename } from 'path'

interface DefaultExportInfo {
    hasDefault: boolean
    isTypeOnly: boolean
    isNamespace: boolean
}

/**
 * Check if file has default export and whether it's type-only or namespace
 */
export function getDefaultExportInfo(filePath: string): DefaultExportInfo {
    try {
        const content = readFileSync(filePath, 'utf-8')

        // Check for default export
        const hasDefaultExport = /export\s+default\s+/.test(content) || /export\s*\{\s*default\s*\}/.test(content)

        if (!hasDefaultExport) {
            return { hasDefault: false, isTypeOnly: false, isNamespace: false }
        }

        // Check if it's a namespace export
        // Pattern: namespace Name ... export default Name
        const namespacePattern = /namespace\s+(\w+)[\s\S]*?export\s+default\s+\1/
        const isNamespace = namespacePattern.test(content)

        // Check if it's a type-only export
        // Pattern: type Name ... followed by export default Name
        // or: interface Name ... followed by export default Name
        const typeAliasPattern = /type\s+(\w+)[\s\S]*?export\s+default\s+\1/
        const interfacePattern = /interface\s+(\w+)[\s\S]*?export\s+default\s+\1/

        const isTypeOnly = typeAliasPattern.test(content) || interfacePattern.test(content)

        return { hasDefault: true, isTypeOnly, isNamespace }
    } catch {
        return { hasDefault: false, isTypeOnly: false, isNamespace: false }
    }
}

interface ExportInfo {
    valueExports: string[] // const, function, class, enum
    typeExports: string[]  // interface, type
}

/**
 * Extract named exports from file, separated by value and type exports
 */
function extractNamedExports(filePath: string): ExportInfo {
    try {
        const content = readFileSync(filePath, 'utf-8')
        const valueExports: string[] = []
        const typeExports: string[] = []

        // Match: export function functionName
        const functionMatches = content.matchAll(/export\s+function\s+(\w+)/g)
        for (const match of functionMatches) {
            valueExports.push(match[1])
        }

        // Match: export const/let/var name
        const varMatches = content.matchAll(/export\s+(?:const|let|var)\s+(\w+)/g)
        for (const match of varMatches) {
            valueExports.push(match[1])
        }

        // Match: export class ClassName
        const classMatches = content.matchAll(/export\s+class\s+(\w+)/g)
        for (const match of classMatches) {
            valueExports.push(match[1])
        }

        // Match: export enum EnumName
        const enumMatches = content.matchAll(/export\s+enum\s+(\w+)/g)
        for (const match of enumMatches) {
            valueExports.push(match[1])
        }

        // Match: export interface InterfaceName
        const interfaceMatches = content.matchAll(/export\s+interface\s+(\w+)/g)
        for (const match of interfaceMatches) {
            typeExports.push(match[1])
        }

        // Match: export type TypeName
        const typeMatches = content.matchAll(/export\s+type\s+(\w+)/g)
        for (const match of typeMatches) {
            typeExports.push(match[1])
        }

        // Match: export { name1, name2 }
        const namedExportMatches = content.matchAll(/export\s*\{\s*([^}]+)\s*\}/g)
        for (const match of namedExportMatches) {
            const names = match[1].split(',').map(n => {
                // Handle "name as alias" - we want the original name
                const parts = n.trim().split(/\s+as\s+/)
                return parts[0].trim()
            })
            // We can't determine if these are values or types, assume values
            valueExports.push(...names.filter(n => n !== 'default'))
        }

        return {
            valueExports: [...new Set(valueExports)],
            typeExports: [...new Set(typeExports)]
        }
    } catch {
        return { valueExports: [], typeExports: [] }
    }
}

/**
 * Generate .global.ts file content for a module
 */
export default function generateGlobalFile(filePath: string): string | null {
    // Get base filename without extension
    const baseFileName = basename(filePath).replace(/\.(ts|tsx|js|jsx)$/, '')

    // Create valid identifier: remove .lite suffix and replace remaining dots/hyphens
    // Button.lite -> Button, Some-Component.lite -> Some_Component
    const identifierName = baseFileName.replace(/\.lite$/, '').replace(/[-.]/g, '_')

    const { hasDefault, isTypeOnly, isNamespace } = getDefaultExportInfo(filePath)
    const { valueExports, typeExports } = extractNamedExports(filePath)

    // Don't generate if no exports at all (neither value nor type)
    if (!hasDefault && valueExports.length === 0 && typeExports.length === 0) {
        return null
    }

    let content = `import globalify from '@sky-modules/core/globalify'\n\n`

    // Import statement
    if (hasDefault && !isTypeOnly) {
        // Value export: import both default and namespace
        content += `import ${identifierName}, * as imports from './${baseFileName}'\n\n`
    } else {
        // Type-only export or no default: import only namespace
        content += `import * as imports from './${baseFileName}'\n\n`
    }

    // Declare global block
    content += `declare global {\n`

    if (hasDefault) {
        if (isNamespace) {
            // Namespace: only add type (no const, no typeof - namespace is a type)
            // Namespace members are accessible via Namespace.Member
            content += `    type ${identifierName} = imports.default\n`
        } else if (isTypeOnly) {
            // Type-only export: only add type (no typeof for types)
            content += `    type ${identifierName} = imports.default\n`
        } else {
            // Value export: add both const and type
            content += `    const ${identifierName}: typeof imports.default\n`
            content += `    type ${identifierName} = typeof imports.default\n`
        }
    }

    // For namespace, don't extract internal exports (they're accessible via Namespace.Member)
    if (!isNamespace) {
        // Add value exports as const
        for (const exportName of valueExports) {
            content += `    const ${exportName}: typeof imports.${exportName}\n`
        }

        // Add type exports as type only (no typeof for types)
        for (const exportName of typeExports) {
            content += `    type ${exportName} = imports.${exportName}\n`
        }
    }

    content += `}\n\n`

    // Globalify call - only include default if it's a value (not type-only, not namespace)
    if (hasDefault && !isTypeOnly && !isNamespace) {
        content += `globalify({ ${identifierName}, ...imports })\n`
    } else {
        content += `globalify({ ...imports })\n`
    }

    return content
}
