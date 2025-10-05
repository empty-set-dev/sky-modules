import fs from 'fs'
import path from 'path'

import type { MitosisPlugin } from '@builder.io/mitosis'

export interface LocalVarsPluginOptions {
    /**
     * Enable the plugin
     * @default true
     */
    enabled?: boolean
}

/**
 * Plugin that supports local variables without Mitosis hooks
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
 */
export const localVarsPlugin = (options: LocalVarsPluginOptions = {}): MitosisPlugin => {
    const { enabled = true } = options

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

    const getVariableNamesFromCode = (code: string): string[] => {
        const variables = new Set<string>()

        // Extract all variable declarations (const, let, var)
        const varDeclarations = code.match(/(const|let|var)\s+(\w+)/g) || []
        varDeclarations.forEach(match => {
            const varName = match.match(/(const|let|var)\s+(\w+)/)?.[2]

            if (varName) variables.add(varName)
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

    /**
     * Extract variables from source code of a component
     */
    const extractVariablesFromSourceFile = (componentName: string): void => {
        const sourceFile = findComponentSourceFile(componentName)

        if (!sourceFile) {
            console.log(`⚠️ Source file not found for component: ${componentName}`)
            return
        }

        console.log(`📖 Reading source file for ${componentName}: ${sourceFile}`)

        try {
            const sourceCode = fs.readFileSync(sourceFile, 'utf8')
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
            const lines = sourceCode.split('\n')
            let lineIndex = 0

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

            // 2. Simple const declarations (including multiline with balanced parentheses)
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
                    extractedVariables.push({
                        name: varName,
                        value: value.trim(),
                        line: lineNum,
                    })
                }
            }

            extractedVariables.sort((a, b) => a.line - b.line)
            componentVariables.set(componentName, extractedVariables)

            console.log(
                `🔍 Extracted variables from ${componentName}:`,
                extractedVariables.map(v => v.name)
            )
        } catch (error) {
            console.error(`❌ Failed to read source file ${sourceFile}:`, error)
        }
    }

    return () => ({
        name: 'local-vars-preserve',
        order: 10,

        json: {
            pre: (json: any): any => {
                const componentName = json.name || 'unknown'
                console.log(`🔧 [${componentName}] JSON PRE processing`)

                // Extract variables from source file instead of trying to guess from JSON
                extractVariablesFromSourceFile(componentName)

                return json
            },
        },

        code: {
            pre: (code: string, context?: any): string => {
                // Try to identify component by function name in code
                const componentMatch = code.match(/function\s+(\w+)/)
                const componentName = componentMatch?.[1] || 'unknown'

                console.log('🔍 Code PRE - detected component:', componentName)

                return code + `\n/* LOCAL_VARS_COMPONENT:${componentName} */`
            },

            post: (code: string): string => {
                if (!enabled) return code

                console.log('🔍 local-vars-plugin POST processing:', code.slice(0, 100) + '...')

                // Extract component name from code comment and remove it
                const componentMatch = code.match(/\/\* LOCAL_VARS_COMPONENT:(.+?) \*\//)
                const componentName = componentMatch?.[1] || 'unknown'
                const cleanCode = code.replace(/\/\* LOCAL_VARS_COMPONENT:.+? \*\/\s*/s, '')

                console.log('🔑 Found component name:', componentName)

                // Get extracted variables from source file reading
                const extractedVariables = componentVariables.get(componentName) || []

                console.log(
                    '📋 Extracted variables from source file:',
                    extractedVariables.map(v => v.name)
                )

                const declaredVars = getVariableNamesFromCode(cleanCode)
                console.log('📝 Currently declared variables:', declaredVars)

                // Find which extracted variables are missing from the current code
                const missingVarNames = extractedVariables
                    .map(v => v.name)
                    .filter(
                        name =>
                            !declaredVars.includes(name) && name.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)
                    )

                console.log('❌ Missing variables:', missingVarNames)

                // Create missing variable declarations using original source data
                let missingVars = missingVarNames.map(name => {
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
                let cleanedCode = cleanCode
                    .replace(/^\s*let\s+[\w.]+\.[\w.]+.*$/gm, '') // Remove lines with "let varName.property"
                    .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up multiple empty lines

                if (missingVars.length === 0) return cleanedCode

                // Sort by original line order to preserve dependencies
                missingVars.sort((a, b) => a.line - b.line)

                const variableDeclarations = missingVars
                    .map(v => {
                        if (v.isRest) {
                            // Framework-specific rest variable generation
                            return `  const ${v.name} = (({ ${v.omittedKeys}, ...rest }) => rest)(${v.sourceValue});`
                        }

                        return `  const ${v.name} = ${v.value};`
                    })
                    .join('\n')

                const declarations = '\n' + variableDeclarations + '\n'

                // Vue.js support
                if (cleanedCode.includes('defineComponent')) {
                    // Add computed import if restProps is used
                    const hasRestProps = missingVars.some(v => v.isRest)
                    const computedImport =
                        hasRestProps && !cleanedCode.includes('computed')
                            ? cleanedCode.replace(
                                  'import { defineComponent }',
                                  'import { defineComponent, computed }'
                              )
                            : cleanedCode

                    const vueDeclarations = missingVars
                        .map(v => {
                            if (v.isRest) {
                                // For Vue, use computed property
                                return `    const ${v.name} = computed(() => {
      const { ${v.omittedKeys}, ...rest } = ${v.sourceValue};
      return rest;
    });`
                            }

                            return `    const ${v.name} = ${v.value};`
                        })
                        .join('\n')

                    const returnVars = missingVars.map(v => v.name).join(', ')
                    const setupFunction = `
  setup(props) {
${vueDeclarations}
    return { ${returnVars} };
  },`

                    // Replace existing setup or add new one
                    if (computedImport.includes('setup(props)')) {
                        return computedImport.replace(
                            /setup\(props\)\s*\{[^}]*\}/,
                            setupFunction.trim()
                        )
                    } else if (computedImport.includes('props: []')) {
                        return computedImport.replace(
                            /props:\s*\[\s*\]/,
                            `props: [],${setupFunction}`
                        )
                    } else {
                        return computedImport.replace(
                            /(defineComponent\(\{)(\s*)/,
                            `$1$2${setupFunction}\n`
                        )
                    }
                }

                // Svelte support - check for any Svelte patterns
                if (
                    cleanedCode.includes("<script lang='ts'>") ||
                    cleanedCode.includes('<script lang="ts">') ||
                    cleanedCode.includes('<script context=')
                ) {
                    if (missingVars.length === 0) {
                        return cleanedCode
                    }

                    // Add variable declarations to Svelte script
                    const svelteDeclarations = missingVars
                        .map(v => {
                            if (v.isRest) {
                                // Create reactive statement for rest props
                                return `  $: ${v.name} = (() => {
    const { ${v.omittedKeys}, ...rest } = $$props;
    return rest;
  })();`
                            }

                            return `  export let ${v.name}: any = undefined;`
                        })
                        .join('\n')

                    // Find the last import or insert at beginning of script
                    const scriptMatch = cleanedCode.match(
                        /(<script lang=['"]ts['"]>)([\s\S]*?)(\n\s*)([\s\S]*?<\/script>)/
                    )

                    if (scriptMatch) {
                        const beforeScript = cleanedCode.substring(
                            0,
                            cleanedCode.indexOf(scriptMatch[0])
                        )
                        const afterScript = cleanedCode.substring(
                            cleanedCode.indexOf(scriptMatch[0]) + scriptMatch[0].length
                        )

                        // Find last import or first non-import line
                        const scriptContent = scriptMatch[2]
                        const lines = scriptContent.split('\n')
                        let insertIndex = 0

                        for (let i = lines.length - 1; i >= 0; i--) {
                            if (lines[i].trim().startsWith('import ')) {
                                insertIndex = i + 1
                                break
                            }
                        }

                        lines.splice(insertIndex, 0, '', ...svelteDeclarations.split('\n'), '')
                        const newScriptContent = lines.join('\n')
                        const result =
                            beforeScript +
                            `<script lang="ts">${newScriptContent}</script>` +
                            afterScript

                        return result
                    }

                    // Fallback
                    return cleanedCode.replace(
                        /(<script lang=['"]ts['"]>)(\s*)/,
                        `$1$2
${svelteDeclarations}

`
                    )
                }

                // Angular support
                if (
                    cleanedCode.includes('@Component') &&
                    cleanedCode.includes('export default class')
                ) {
                    // First, remove any invalid ViewChild declarations like "@ViewChild('popover.triggerRef') popover.triggerRef!: ElementRef"
                    let angularCode = cleanedCode
                        .replace(/@ViewChild\('[^']*\.[^']*'\)\s+[\w.]+\.[\w.]+[^\n]*\n?/g, '') // Remove lines with invalid ViewChild
                        .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up multiple empty lines

                    if (missingVars.length === 0) return angularCode

                    const getters = missingVars.map(v => {
                        if (v.isRest) {
                            // For Angular, create computed getter for rest props
                            return `  get ${v.name}() {
    const { ${v.omittedKeys}, ...rest } = this.props || {};
    return rest;
  }`
                        }

                        let value = v.value.replace(/props\./g, 'this.props?.')

                        // Replace variable references with this. references for computed variables
                        missingVars.forEach(otherVar => {
                            if (otherVar.name !== v.name) {
                                const varPattern = new RegExp(`\\b${otherVar.name}\\b`, 'g')
                                value = value.replace(varPattern, `this.${otherVar.name}`)
                            }
                        })

                        return `  get ${v.name}() { return ${value}; }`
                    })

                    // Check if class has content
                    if (
                        angularCode.includes('export default class') &&
                        angularCode.includes('{\n}')
                    ) {
                        // Empty class - add props and getters
                        return angularCode.replace(
                            /(export default class \w+ \{)\s*(\})/,
                            `$1
  props: any;
${getters.join('\n')}
$2`
                        )
                    } else {
                        // Class has content - add getters after first line
                        return angularCode.replace(
                            /(export default class \w+ \{\s*)/,
                            `$1
  props: any;
${getters.join('\n')}

`
                        )
                    }
                }

                // React/Qwik support
                if (
                    cleanedCode.includes('function ') ||
                    cleanedCode.includes('component$(') ||
                    cleanedCode.includes('=> {')
                ) {
                    const functionPattern =
                        /(function\s+\w+[^{]*\{|component\$\([^{]*\{|=>\s*\{)(\s*)/

                    if (functionPattern.test(cleanedCode)) {
                        return cleanedCode.replace(
                            functionPattern,
                            `$1$2  // Preserved local variables (added by local-vars-plugin)${declarations}
`
                        )
                    }
                }

                return cleanedCode
            },
        },
    })
}

export default localVarsPlugin
