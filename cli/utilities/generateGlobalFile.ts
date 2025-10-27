import { readFileSync } from 'fs'
import { basename } from 'path'

interface DefaultExportInfo {
    hasDefault: boolean
    isTypeOnly: boolean
    isNamespace: boolean
}

/**
 * Extract the name of the default export from file content
 */
export function getDefaultExportName(content: string): string | null {
    // Pattern: export default [async] function Name or export default class Name
    const functionOrClassMatch = content.match(/export\s+default\s+(?:async\s+)?(?:function|class)\s+(\w+)/)
    if (functionOrClassMatch) {
        return functionOrClassMatch[1]
    }

    // Pattern: export default Name (identifier only, not function/class/const/etc)
    const directExportMatch = content.match(/export\s+default\s+(?!function|class|const|let|var|async|interface|type|namespace)(\w+)/)
    if (directExportMatch) {
        return directExportMatch[1]
    }

    // Pattern: export { Name as default }
    const namedExportMatch = content.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/)
    if (namedExportMatch) {
        return namedExportMatch[1]
    }

    return null
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
        // Pattern: namespace Name ... export default Name (exact match, not Name.something)
        const namespacePattern = /namespace\s+(\w+)[\s\S]*?export\s+default\s+\1(?!\w|\.)/
        const isNamespace = namespacePattern.test(content)

        // Check if it's a type-only export
        // Pattern: type Name ... followed by export default Name (exact match)
        // or: interface Name ... followed by export default Name (exact match)
        // BUT: If there's also a function/const/class with the same name, it's NOT type-only
        const typeAliasPattern = /type\s+(\w+)[\s\S]*?export\s+default\s+\1(?!\w|\.)/
        const interfacePattern = /interface\s+(\w+)[\s\S]*?export\s+default\s+\1(?!\w|\.)/

        let isTypeOnly = typeAliasPattern.test(content) || interfacePattern.test(content)

        // If type-only, check if there's a value with the same name
        if (isTypeOnly) {
            const exportDefaultMatch = content.match(/export\s+default\s+(\w+)/)
            if (exportDefaultMatch) {
                const exportedName = exportDefaultMatch[1]
                // Check if there's a function, const, or class with this name
                const hasFunctionValue = new RegExp(`function\\s+${exportedName}\\s*[<(]`).test(content)
                const hasConstValue = new RegExp(`(?:const|let|var)\\s+${exportedName}\\s*[=:]`).test(content)
                const hasClassValue = new RegExp(`class\\s+${exportedName}\\s*[{<]`).test(content)

                if (hasFunctionValue || hasConstValue || hasClassValue) {
                    isTypeOnly = false
                }
            }
        }

        return { hasDefault: true, isTypeOnly, isNamespace }
    } catch {
        return { hasDefault: false, isTypeOnly: false, isNamespace: false }
    }
}

interface TypeExport {
    name: string
    generics?: string // Full definition e.g. "<T extends Function>" or "<T, U>"
    genericsParams?: string // Only param names e.g. "<T>" or "<T, U>"
}

interface ExportInfo {
    valueExports: string[] // const, function, class, enum
    typeExports: TypeExport[]  // interface, type with optional generics
}

/**
 * Remove content inside namespace blocks to avoid detecting namespace-internal exports
 */
function removeNamespaceContent(content: string): string {
    // Remove everything between 'namespace Name {' and matching '}'
    // This is a simple approach - won't handle nested namespaces perfectly but works for most cases
    return content.replace(/namespace\s+\w+\s*\{[^}]*\}/gs, '')
}

/**
 * Extract parameter names from generic definition
 * Examples:
 *   "<T>" -> "<T>"
 *   "<T extends Function>" -> "<T>"
 *   "<T, U extends object>" -> "<T, U>"
 *   "<T = unknown, U extends Array<T>>" -> "<T, U>"
 */
function extractGenericParams(generics: string): string {
    // Remove < and >
    const inner = generics.slice(1, -1)

    // Split by comma (but not inside nested <>)
    const params: string[] = []
    let depth = 0
    let current = ''

    for (const char of inner) {
        if (char === '<') depth++
        else if (char === '>') depth--
        else if (char === ',' && depth === 0) {
            params.push(current.trim())
            current = ''
            continue
        }
        current += char
    }
    if (current.trim()) params.push(current.trim())

    // Extract only the parameter name (before 'extends' or '=')
    const paramNames = params.map(param => {
        const match = param.match(/^(\w+)/)
        return match ? match[1] : param
    })

    return `<${paramNames.join(', ')}>`
}

/**
 * Extract named exports from file, separated by value and type exports
 */
function extractNamedExports(filePath: string): ExportInfo {
    try {
        let content = readFileSync(filePath, 'utf-8')

        // Remove namespace content to avoid detecting internal exports
        content = removeNamespaceContent(content)

        const valueExports: string[] = []
        const typeExports: TypeExport[] = []

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

        // Match: export interface InterfaceName or export interface InterfaceName<T>
        const interfaceMatches = content.matchAll(/export\s+interface\s+(\w+)(<[^>=]*>)?/g)
        for (const match of interfaceMatches) {
            const generics = match[2]
            const typeExport: TypeExport = { name: match[1] }
            if (generics) {
                typeExport.generics = generics
                typeExport.genericsParams = extractGenericParams(generics)
            }
            typeExports.push(typeExport)
        }

        // Match: export type TypeName or export type TypeName<T>
        const typeMatches = content.matchAll(/export\s+type\s+(\w+)(<[^>=]*>)?/g)
        for (const match of typeMatches) {
            const generics = match[2]
            const typeExport: TypeExport = { name: match[1] }
            if (generics) {
                typeExport.generics = generics
                typeExport.genericsParams = extractGenericParams(generics)
            }
            typeExports.push(typeExport)
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

        // Remove duplicates from typeExports based on name
        const uniqueTypeExports = typeExports.filter((type, index, self) =>
            index === self.findIndex(t => t.name === type.name)
        )

        return {
            valueExports: [...new Set(valueExports)],
            typeExports: uniqueTypeExports
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

    const { hasDefault, isTypeOnly, isNamespace } = getDefaultExportInfo(filePath)
    const { valueExports, typeExports } = extractNamedExports(filePath)

    // Get the actual export name from the file, or fall back to sanitized filename
    let identifierName: string
    if (hasDefault) {
        const content = readFileSync(filePath, 'utf-8')
        const actualExportName = getDefaultExportName(content)
        // If we found the actual export name, use it; otherwise sanitize the filename
        identifierName = actualExportName || baseFileName.replace(/\.lite$/, '').replace(/[-.]/g, '_')
    } else {
        // No default export - use sanitized filename
        identifierName = baseFileName.replace(/\.lite$/, '').replace(/[-.]/g, '_')
    }

    // Don't generate if no exports at all (neither value nor type)
    if (!hasDefault && valueExports.length === 0 && typeExports.length === 0) {
        return null
    }

    let content = `import globalify from '@sky-modules/core/globalify'\n\n`

    // Import statement
    if (hasDefault && !isTypeOnly && !isNamespace) {
        // Value export: import both default and namespace
        content += `import ${identifierName}, * as imports from './${baseFileName}'\n\n`
    } else if (isNamespace) {
        // Namespace: import only default (namespace is both value and type)
        content += `import ${identifierName} from './${baseFileName}'\n\n`
    } else {
        // Type-only export or no default: import only namespace
        content += `import * as imports from './${baseFileName}'\n\n`
    }

    // Declare global block
    content += `declare global {\n`

    if (hasDefault) {
        if (isNamespace) {
            // Namespace: add both const and type (namespace is both value and type)
            // Namespace members are accessible via Namespace.Member
            content += `    const ${identifierName}: typeof ${identifierName}\n`
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
        // Create a map of type exports for quick lookup
        const typeExportsMap = new Map(typeExports.map(t => [t.name, t]))

        // Add value exports
        for (const exportName of valueExports) {
            content += `    const ${exportName}: typeof imports.${exportName}\n`

            // If there's also a type export with the same name (function with generics),
            // use the type export to preserve generics
            const typeExport = typeExportsMap.get(exportName)
            if (typeExport) {
                const genericsLeft = typeExport.generics || ''
                const genericsRight = typeExport.genericsParams || ''
                content += `    type ${typeExport.name}${genericsLeft} = imports.${typeExport.name}${genericsRight}\n`
            } else {
                // No type export - use typeof (for non-generic functions/consts)
                content += `    type ${exportName} = typeof imports.${exportName}\n`
            }
        }

        // Add type-only exports (types/interfaces that don't have value counterparts)
        for (const typeExport of typeExports) {
            // Skip if already added as part of value export
            if (!valueExports.includes(typeExport.name)) {
                const genericsLeft = typeExport.generics || ''
                const genericsRight = typeExport.genericsParams || ''
                content += `    type ${typeExport.name}${genericsLeft} = imports.${typeExport.name}${genericsRight}\n`
            }
        }
    }

    content += `}\n\n`

    // Globalify call
    const globalsToAdd: string[] = []

    // Add default export if it's a value (not type-only)
    // Namespace IS a runtime value that should be globalized
    if (hasDefault && !isTypeOnly) {
        globalsToAdd.push(identifierName)
    }

    // Add named exports (namespace spread doesn't include default)
    if (valueExports.length > 0 && !isNamespace) {
        globalsToAdd.push('...imports')
    }

    if (globalsToAdd.length > 0) {
        content += `globalify({ ${globalsToAdd.join(', ')} })\n`
    } else {
        content += `// No runtime values to globalize\n`
    }

    return content
}
