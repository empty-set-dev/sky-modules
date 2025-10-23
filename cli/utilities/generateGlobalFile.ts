import { readFileSync } from 'fs'
import { basename } from 'path'

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
    const fileName = basename(filePath, '.ts').replace(/\.tsx$/, '')
    const hasDefault = hasDefaultExport(filePath)
    const { valueExports, typeExports } = extractNamedExports(filePath)

    // Don't generate if no value exports (only types/interfaces)
    if (!hasDefault && valueExports.length === 0) {
        return null
    }

    let content = `import globalify from '@sky-modules/core/globalify'\n`

    // Import statement
    if (hasDefault) {
        content += `import ${fileName}, * as imports from './${fileName}'\n\n`
    } else {
        content += `import * as imports from './${fileName}'\n\n`
    }

    // Declare global block
    content += `declare global {\n`

    if (hasDefault) {
        // Add default export type and const
        content += `    type ${fileName} = typeof imports.default\n`
        content += `    const ${fileName}: typeof imports.default\n`
    }

    // Add value exports as const
    for (const exportName of valueExports) {
        content += `    const ${exportName}: typeof imports.${exportName}\n`
    }

    // Add type exports as type only
    for (const exportName of typeExports) {
        content += `    type ${exportName} = typeof imports.${exportName}\n`
    }

    content += `}\n\n`

    // Globalify call
    if (hasDefault) {
        content += `globalify({ ${fileName}, ...imports })\n`
    } else {
        content += `globalify({ ...imports })\n`
    }

    return content
}
