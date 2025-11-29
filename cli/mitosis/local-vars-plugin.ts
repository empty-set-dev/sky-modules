import fs from 'fs'
import path from 'path'

import { FrameworkCodeGeneratorManager } from './framework-generators/FrameworkCodeGeneratorManager.ts'
import { fixIndentation } from './utils/formatting.ts'

import type { ReactGenerationContext } from './framework-generators/ReactGenerator.ts'
import type { MitosisPlugin } from '@builder.io/mitosis'

export interface SkyMitosisPluginOptions {
    /**
     * Enable the plugin
     * @default true
     */
    enabled?: boolean
    /**
     * Enable generic type detection for Design.SlotProps<T>
     * @default true
     */
    detectGenerics?: boolean
    /**
     * Tab width for formatting (spaces)
     * @default 4
     */
    tabWidth?: number
}

/**
 * Sky Mitosis Plugin for Sky Modules Framework
 *
 * Supports local variables without Mitosis hooks and applies consistent formatting.
 *
 * Instead of using Mitosis hooks like useStore, useRef, etc.,
 * this plugin ensures that regular JavaScript const variables,
 * destructuring, and mutations work across all frameworks.
 *
 * Supports:
 * - const styles = linkStyles(props)
 * - const boxProps: extractBoxProps<T>(props)
 * - const { foo, boo } = props
 * - const { foo, boo, ...restProps } = props
 * - foo.x += 5
 * - boo = foo.name
 * - const test = boo.name
 *
 * WITHOUT using Mitosis hooks:
 * - No useStore
 * - No useRef
 * - No useState
 * - Pure JavaScript only!
 *
 * Also applies consistent code formatting with configurable tab width.
 */
export const skyMitosisPlugin = (options: SkyMitosisPluginOptions = {}): MitosisPlugin => {
    const { enabled = true, detectGenerics = true, tabWidth = 4 } = options

    // Store extracted variables per component name
    const componentVariables = new Map<
        string,
        Array<{
            name: string
            value: string
            line: number
            isRest?: boolean
            omittedKeys?: string
            sourceValue?: string
        }>
    >()

    // Store component generics per component name
    const componentGenerics = new Map<string, string>()

    // Store global imports per component name
    const componentGlobalImports = new Map<string, string[]>()

    /**
     * Find the source file for a component by searching for the function name inside .lite files
     */
    const findComponentSourceFile = (componentName: string): string | null => {
        // Recursively search for .lite files and check their content
        const searchInDirectory = (dir: string): string | null => {
            try {
                const entries = fs.readdirSync(dir, { withFileTypes: true })

                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name)

                    if (entry.isDirectory()) {
                        // Skip node_modules, mitosis output, and .dev directories
                        if (
                            entry.name === 'node_modules' ||
                            entry.name === 'mitosis' ||
                            entry.name === '.dev'
                        ) {
                            continue
                        }

                        const result = searchInDirectory(fullPath)

                        if (result) return result
                    } else if (entry.isFile()) {
                        // Check if this is a .lite file
                        if (entry.name.endsWith('.lite.tsx') || entry.name.endsWith('.lite.ts')) {
                            try {
                                const content = fs.readFileSync(fullPath, 'utf8')

                                // Look for function declaration with the component name
                                const functionPattern = new RegExp(
                                    `(?:export\\s+default\\s+)?function\\s+${componentName}\\s*[<(]`,
                                    'g'
                                )

                                if (functionPattern.test(content)) {
                                    return fullPath
                                }
                            } catch {
                                // File might not be readable, continue
                                continue
                            }
                        }
                    }
                }
            } catch {
                // Directory might not exist or be readable
                return null
            }

            return null
        }

        return searchInDirectory(process.cwd())
    }

    /**
     * Extract global imports (imports without named/default exports)
     */
    const extractGlobalImports = (sourceCode: string): string[] => {
        const globalImports: string[] = []
        const importLines = sourceCode.split('\n').filter(line => line.trim().startsWith('import'))

        importLines.forEach(line => {
            const trimmed = line.trim()
            // Match imports like: import '@sky-modules/design/Box/global'
            // These are imports without any named/default imports - just for side effects
            if (/^import\s+['"][^'"]+['"]/.test(trimmed)) {
                globalImports.push(trimmed)
            }
        })

        return globalImports
    }

    /**
     * Extract generic type parameters from function declaration
     */
    const extractGenericsFromFunction = (
        sourceCode: string,
        componentName: string
    ): string | null => {
        if (!detectGenerics) return null

        // Look for function declaration with generics
        const functionPattern = new RegExp(
            `(?:export\\s+default\\s+)?function\\s+${componentName}\\s*(<[^>]+>)`,
            'g'
        )

        const match = functionPattern.exec(sourceCode)
        if (!match) return null

        const generics = match[1]

        // Check if this function uses any Props<T> pattern (Design.SlotProps<T>, ColProps<T>, FlexProps<T>, etc.)
        const propsPattern = new RegExp(
            `function\\s+${componentName}\\s*${generics.replace(/[<>]/g, '\\$&')}\\s*\\([^:]*:\\s*[\\w.]*Props<[^>]*>`,
            'g'
        )

        if (propsPattern.test(sourceCode)) {
            return generics
        }

        return null
    }

    const getVariableNamesFromCode = (code: string): string[] => {
        const variables = new Set<string>()

        // Extract all variable declarations (const, let, var) but exclude Mitosis hooks
        const varDeclarations = code.match(/(const|let|var)\s+(\w+)/g) || []
        varDeclarations.forEach(match => {
            const varName = match.match(/(const|let|var)\s+(\w+)/)?.[2]

            // Skip Mitosis hook variables
            if (
                varName &&
                ![
                    'useStore',
                    'onMount',
                    'onUnMount',
                    'setContext',
                    'useState',
                    'useRef',
                    'onUpdate',
                ].includes(varName)
            ) {
                variables.add(varName)
            }
        })

        // Extract destructured variables including rest parameters
        const destructMatches = code.match(/(const|let|var)\s*\{\s*([^}]+)\s*\}\s*=/g) || []
        destructMatches.forEach(match => {
            const vars = match.match(/(const|let|var)\s*\{\s*([^}]+)\s*\}/)?.[2]

            if (vars) {
                vars.split(',').forEach(v => {
                    const trimmed = v.trim()

                    if (trimmed.startsWith('...')) {
                        const restName = trimmed.substring(3).trim()

                        if (restName) variables.add(restName)
                    } else {
                        const varName = trimmed.split(':')[0].trim()

                        if (varName) variables.add(varName)
                    }
                })
            }
        })

        // Extract function declarations
        const functionDeclarations = code.match(/function\s+(\w+)/g) || []
        functionDeclarations.forEach(match => {
            const funcName = match.match(/function\s+(\w+)/)?.[1]

            if (funcName) variables.add(funcName)
        })

        // Extract imports (named and default) - more comprehensive
        const importLines = code.split('\n').filter(line => line.trim().startsWith('import'))
        importLines.forEach(line => {
            // Handle various import patterns

            // import React from 'react'
            const defaultImportMatch = line.match(/import\s+(\w+)\s+from/)

            if (defaultImportMatch && !line.includes('{')) {
                variables.add(defaultImportMatch[1])
            }

            // import { useState, useRef } from 'react'
            const namedImportsMatch = line.match(/import\s*\{\s*([^}]+)\s*\}\s*from/)

            if (namedImportsMatch) {
                namedImportsMatch[1].split(',').forEach(imp => {
                    const trimmed = imp.trim()
                    // Handle 'import as' syntax
                    const asMatch = trimmed.match(/(\w+)\s+as\s+(\w+)/)

                    if (asMatch) {
                        variables.add(asMatch[2]) // use the alias
                    } else {
                        variables.add(trimmed)
                    }
                })
            }

            // import React, { useState } from 'react'
            const mixedImportMatch = line.match(/import\s+(\w+)\s*,\s*\{\s*([^}]+)\s*\}\s*from/)

            if (mixedImportMatch) {
                variables.add(mixedImportMatch[1]) // default import
                mixedImportMatch[2].split(',').forEach(imp => {
                    const trimmed = imp.trim()
                    const asMatch = trimmed.match(/(\w+)\s+as\s+(\w+)/)

                    if (asMatch) {
                        variables.add(asMatch[2])
                    } else {
                        variables.add(trimmed)
                    }
                })
            }

            // import * as React from 'react'
            const namespaceImportMatch = line.match(/import\s+\*\s+as\s+(\w+)\s+from/)

            if (namespaceImportMatch) {
                variables.add(namespaceImportMatch[1])
            }
        })

        // Extract function parameters in arrow functions and regular functions
        const functionParams = code.match(/\(([^)]*)\)\s*[=>]|\bfunction[^(]*\(([^)]*)\)/g) || []
        functionParams.forEach(match => {
            const params = match.match(/\(([^)]*)\)/)?.[1]

            if (params) {
                params.split(',').forEach(param => {
                    const trimmed = param
                        .trim()
                        .split(/\s*[:=]/)[0]
                        .trim()

                    if (trimmed && trimmed.match(/^\w+$/)) {
                        variables.add(trimmed)
                    }
                })
            }
        })

        return Array.from(variables)
    }

    // Store forwardRef usage per component name
    const componentUsesForwardRef = new Map<string, boolean>()

    /**
     * Check if component uses forwardRef pattern (props.inputRef)
     */
    const detectForwardRefUsage = (sourceCode: string): boolean => {
        return sourceCode.includes('props.inputRef')
    }

    /**
     * Extract variables from source code of a component
     */
    const extractVariablesFromSourceFile = (componentName: string): void => {
        const sourceFile = findComponentSourceFile(componentName)

        if (!sourceFile) {
            return
        }

        try {
            const sourceCode = fs.readFileSync(sourceFile, 'utf8')

            // Detect forwardRef usage
            const usesForwardRef = detectForwardRefUsage(sourceCode)

            if (usesForwardRef) {
                componentUsesForwardRef.set(componentName, true)
            }

            // Extract generics if enabled
            const generics = extractGenericsFromFunction(sourceCode, componentName)

            if (generics) {
                componentGenerics.set(componentName, generics)
            }

            // Extract global imports
            const globalImports = extractGlobalImports(sourceCode)

            if (globalImports.length > 0) {
                componentGlobalImports.set(componentName, globalImports)
            }

            const extractedVariables: Array<{
                name: string
                value: string
                line: number
                isRest?: boolean
                omittedKeys?: string
                sourceValue?: string
            }> = []

            /**
             * Extract const value with balanced parentheses/brackets/braces
             */
            const extractConstValue = (sourceCode: string, startPos: number): string | null => {
                let pos = startPos
                let depth = 0
                let inString = false
                let stringChar = ''
                let result = ''

                while (pos < sourceCode.length) {
                    const char = sourceCode[pos]
                    const nextChar = sourceCode[pos + 1]

                    // Handle string literals
                    if (!inString && (char === '"' || char === "'" || char === '`')) {
                        inString = true
                        stringChar = char
                        result += char
                        pos++
                        continue
                    }

                    if (inString) {
                        result += char

                        if (char === stringChar && sourceCode[pos - 1] !== '\\') {
                            inString = false
                            stringChar = ''
                        }

                        pos++
                        continue
                    }

                    // Handle parentheses, brackets, braces
                    if (char === '(' || char === '[' || char === '{') {
                        depth++
                        result += char
                    } else if (char === ')' || char === ']' || char === '}') {
                        depth--
                        result += char
                    } else if (depth === 0) {
                        // Check for end of const declaration
                        if (
                            char === '\n' &&
                            nextChar &&
                            /^\s*(?:const|let|var|function|export|import|return|\}|$)/.test(
                                sourceCode.substring(pos + 1)
                            )
                        ) {
                            break
                        }

                        if (char === ';') {
                            break
                        }

                        result += char
                    } else {
                        result += char
                    }

                    pos++
                }

                return result || null
            }

            // Process code to find all variable declarations with correct order

            // 1. Multiline destructuring patterns first (to get correct positions)
            const destructuringPattern = /const\s*\{\s*([\s\S]*?)\s*\}\s*=\s*([^;\n]+)/g
            let destructMatch

            while ((destructMatch = destructuringPattern.exec(sourceCode)) !== null) {
                const startPos = destructMatch.index
                const lineNum = sourceCode.substring(0, startPos).split('\n').length - 1

                const vars = destructMatch[1]
                const value = destructMatch[2].trim()
                const parsedVars: Array<{ name: string; isRest: boolean }> = []

                // Handle complex destructuring patterns (multiline safe)
                vars.split(',').forEach(v => {
                    const trimmed = v.trim()

                    if (trimmed.startsWith('...')) {
                        const restName = trimmed.substring(3).trim()

                        if (restName) parsedVars.push({ name: restName, isRest: true })
                    } else if (trimmed) {
                        // Handle variables with types and default values: "as: ElementType", "showHeader = true"
                        let varName = trimmed.split(':')[0].trim() // Remove type annotation
                        varName = varName.split('=')[0].trim() // Remove default value

                        if (varName && varName.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
                            parsedVars.push({ name: varName, isRest: false })
                        }
                    }
                })

                parsedVars.forEach(variable => {
                    if (variable.isRest) {
                        const omittedKeys = parsedVars
                            .filter(v => !v.isRest)
                            .map(v => v.name)
                            .join(', ')

                        extractedVariables.push({
                            name: variable.name,
                            value: `{ ...${value} }`,
                            line: lineNum,
                            isRest: true,
                            omittedKeys: omittedKeys,
                            sourceValue: value,
                        })
                    } else {
                        extractedVariables.push({
                            name: variable.name,
                            value: `${value}.${variable.name}`,
                            line: lineNum,
                        })
                    }
                })
            }

            // 2. Function property assignments (e.g., Grid.Item = GridItem)
            // These are module-level assignments that need to be preserved
            const propertyAssignmentPattern = /^(\w+)\.(\w+)\s*=\s*(\w+)\s*$/gm
            let propertyMatch

            while ((propertyMatch = propertyAssignmentPattern.exec(sourceCode)) !== null) {
                const startPos = propertyMatch.index
                const lineNum = sourceCode.substring(0, startPos).split('\n').length - 1
                const functionName = propertyMatch[1]
                const propertyName = propertyMatch[2]
                const value = propertyMatch[3]

                // Store the full assignment as-is
                extractedVariables.push({
                    name: `${functionName}.${propertyName}`,
                    value: value,
                    line: lineNum,
                })
            }

            // 3. Simple const declarations (including multiline with balanced parentheses)
            const simpleConstPattern = /const\s+(\w+)\s*=\s*/g
            let simpleConstMatch

            while ((simpleConstMatch = simpleConstPattern.exec(sourceCode)) !== null) {
                const startPos = simpleConstMatch.index
                const lineNum = sourceCode.substring(0, startPos).split('\n').length - 1
                const varName = simpleConstMatch[1]

                // Find the value part after the = sign
                const valueStartPos = startPos + simpleConstMatch[0].length
                const value = extractConstValue(sourceCode, valueStartPos)

                // Skip if this variable was already added by destructuring
                if (value && !extractedVariables.some(v => v.name === varName)) {
                    // Handle complex object construction with spread operators and conditionals
                    let processedValue = value.trim()

                    // Check if this is a complex object with spread operators and conditionals
                    if (
                        processedValue.includes('...(') &&
                        processedValue.includes('?') &&
                        processedValue.includes(': null')
                    ) {
                        // Transform spread conditional patterns to safe object construction
                        // Example: { ...(props.styles ? { styles: props.styles } : null), ... }
                        // becomes: (() => { const obj = {}; if (props.styles) obj.styles = props.styles; ... return obj; })()

                        // For now, use a simpler approach - extract individual properties
                        const spreadMatches = processedValue.match(
                            /\.\.\.\(([^?]+)\?\s*\{\s*(\w+):\s*([^}]+)\s*\}\s*:\s*null\)/g
                        )

                        if (spreadMatches) {
                            const objProperties: string[] = []
                            spreadMatches.forEach(match => {
                                const conditionMatch = match.match(
                                    /\.\.\.\(([^?]+)\?\s*\{\s*(\w+):\s*([^}]+)\s*\}\s*:\s*null\)/
                                )

                                if (conditionMatch) {
                                    const condition = conditionMatch[1].trim()
                                    const propName = conditionMatch[2].trim()
                                    const propValue = conditionMatch[3].trim()
                                    objProperties.push(
                                        `...(${condition} ? { ${propName}: ${propValue} } : {})`
                                    )
                                }
                            })

                            if (objProperties.length > 0) {
                                processedValue = `{ ${objProperties.join(', ')} }`
                            }
                        }
                    }

                    extractedVariables.push({
                        name: varName,
                        value: processedValue,
                        line: lineNum,
                    })
                }
            }

            extractedVariables.sort((a, b) => a.line - b.line)
            componentVariables.set(componentName, extractedVariables)
        } catch {
            // Silently ignore read errors
        }
    }

    return () => ({
        name: 'local-vars-preserve',
        order: 10,

        json: {
            // @ts-ignore
            pre: (json: Record<string, unknown>): Record<string, unknown> => {
                const componentName = (json.name as string) || 'unknown'

                // Extract variables from source file instead of trying to guess from JSON
                extractVariablesFromSourceFile(componentName)

                return json
            },
        },

        code: {
            pre: (code: string): string => {
                // Try to identify component by function name in code
                const componentMatch = code.match(/function\s+(\w+)/)
                const componentName = componentMatch?.[1] || 'unknown'
                return code + `\n/* LOCAL_VARS_COMPONENT:${componentName} */`
            },

            post: (code: string): string => {
                if (!enabled) return code

                // Extract component name from code comment and remove it
                const componentMatch = code.match(/\/\* LOCAL_VARS_COMPONENT:(.+?) \*\//)
                const componentName = componentMatch?.[1] || 'unknown'
                const cleanCode = code.replace(/\/\* LOCAL_VARS_COMPONENT:.+? \*\/\s*/s, '')

                // Get extracted variables from source file reading
                const extractedVariables = componentVariables.get(componentName) || []
                const generics = componentGenerics.get(componentName)
                const globalImports = componentGlobalImports.get(componentName) || []
                const usesForwardRef = componentUsesForwardRef.get(componentName) || false

                const declaredVars = getVariableNamesFromCode(cleanCode)

                // Find which extracted variables are missing from the current code
                const missingVarNames = extractedVariables
                    .map(v => v.name)
                    .filter(name => {
                        // Property assignments (e.g., Grid.Item) should always be included
                        if (name.includes('.')) {
                            return true
                        }

                        return (
                            !declaredVars.includes(name) &&
                            name.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/) &&
                            // Skip variables that are assigned Mitosis hooks
                            !extractedVariables.some(
                                ev =>
                                    ev.name === name &&
                                    /useStore|onMount|onUnMount|setContext|useState|useRef|onUpdate/.test(
                                        ev.value
                                    )
                            )
                        )
                    })

                // Create missing variable declarations using original source data
                const missingVars = missingVarNames.map(name => {
                    const extracted = extractedVariables.find(v => v.name === name)
                    return (
                        extracted || {
                            name: name,
                            value: `props.${name}`,
                            line: 0,
                        }
                    )
                })

                // Clean up any invalid variable declarations
                const cleanedCode = cleanCode
                    .replace(/^\s*let\s+[\w.]+\.[\w.]+.*$/gm, '') // Remove lines with "let varName.property"
                    .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up multiple empty lines

                if (missingVars.length === 0) return fixIndentation(cleanedCode, tabWidth)

                // Sort by original line order to preserve dependencies
                missingVars.sort((a, b) => a.line - b.line)

                // Use FrameworkCodeGeneratorManager for all framework-specific generation
                const generatorManager = new FrameworkCodeGeneratorManager()

                const context: ReactGenerationContext = {
                    code: cleanedCode,
                    missingVars,
                    globalImports,
                    generics,
                    componentName,
                    usesForwardRef,
                }

                const result = generatorManager.generate(context)

                return fixIndentation(result.code, tabWidth)
            },
        },
    })
}

export default skyMitosisPlugin
export { skyMitosisPlugin as localVarsPlugin } // Backward compatibility alias
