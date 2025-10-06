import fs from 'fs'
import path from 'path'

import type { MitosisPlugin } from '@builder.io/mitosis'

export interface LocalVarsPluginOptions {
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
    const { enabled = true, detectGenerics = true } = options

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
            // Match imports like: import '@sky-modules/design/Box.global'
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
    const extractGenericsFromFunction = (sourceCode: string, componentName: string): string | null => {
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
            if (varName && !['useStore', 'onMount', 'onUnMount', 'setContext', 'useState', 'useRef', 'onUpdate'].includes(varName)) {
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
            console.log(`[DEBUG] Extracting generics for ${componentName}: "${generics}"`)
            if (generics) {
                componentGenerics.set(componentName, generics)
                console.log(`[DEBUG] Stored generics for ${componentName}: "${generics}"`)
            } else {
                console.log(`[DEBUG] No generics found for ${componentName}`)
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

                console.log(`[DEBUG] Component ${componentName} - generics: "${generics}", usesForwardRef: ${usesForwardRef}`)

                const declaredVars = getVariableNamesFromCode(cleanCode)

                // Find which extracted variables are missing from the current code
                // But exclude variables that use Mitosis hooks
                const missingVarNames = extractedVariables
                    .map(v => v.name)
                    .filter(
                        name =>
                            !declaredVars.includes(name) &&
                            name.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/) &&
                            // Skip variables that are assigned Mitosis hooks
                            !extractedVariables.some(ev =>
                                ev.name === name &&
                                /useStore|onMount|onUnMount|setContext|useState|useRef|onUpdate/.test(ev.value)
                            )
                    )

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
                    let vueCode = cleanedCode

                    // Add global imports at the beginning if they exist
                    if (globalImports.length > 0) {
                        const globalImportsStr = globalImports.join('\n') + '\n\n'
                        vueCode = globalImportsStr + vueCode
                    }

                    // Add generics to Vue component if detected
                    if (generics) {
                        const vueGenericPattern = /defineComponent\s*\(/g
                        vueCode = vueCode.replace(vueGenericPattern, `defineComponent${generics}(`)
                    }

                    // Add computed import if restProps is used
                    const hasRestProps = missingVars.some(v => v.isRest)
                    const computedImport =
                        hasRestProps && !vueCode.includes('computed')
                            ? vueCode.replace(
                                  'import { defineComponent }',
                                  'import { defineComponent, computed }'
                              )
                            : vueCode

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
                    let svelteCode = cleanedCode

                    // Add global imports at the beginning if they exist (before script tag)
                    if (globalImports.length > 0) {
                        const globalImportsStr = globalImports.join('\n') + '\n\n'
                        svelteCode = globalImportsStr + svelteCode
                    }

                    // Add generics to Svelte component script if detected
                    if (generics) {
                        // In Svelte, generics are added to the script tag
                        svelteCode = svelteCode.replace(
                            /<script lang="ts">/g,
                            `<script lang="ts" generics="${generics.slice(1, -1)}">`
                        ).replace(
                            /<script lang='ts'>/g,
                            `<script lang='ts' generics='${generics.slice(1, -1)}'>`
                        )
                    }

                    if (missingVars.length === 0) {
                        return svelteCode
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
                    const scriptMatch = svelteCode.match(
                        /(<script lang=['"]ts['"][^>]*>)([\s\S]*?)(\n\s*)([\s\S]*?<\/script>)/
                    )

                    if (scriptMatch) {
                        const beforeScript = svelteCode.substring(
                            0,
                            svelteCode.indexOf(scriptMatch[0])
                        )
                        const afterScript = svelteCode.substring(
                            svelteCode.indexOf(scriptMatch[0]) + scriptMatch[0].length
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
                            `${scriptMatch[1]}${newScriptContent}</script>` +
                            afterScript

                        return result
                    }

                    // Fallback
                    return svelteCode.replace(
                        /(<script lang=['"]ts['"][^>]*>)(\s*)/,
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

                    // Add global imports at the beginning if they exist
                    if (globalImports.length > 0) {
                        const globalImportsStr = globalImports.join('\n') + '\n\n'
                        angularCode = globalImportsStr + angularCode
                    }

                    // Add generics to Angular class if detected
                    if (generics) {
                        const classPattern = new RegExp(`(export\\s+default\\s+class\\s+${componentName})\\s`, 'g')
                        angularCode = angularCode.replace(classPattern, `$1${generics} `)
                    }

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
                    let updatedCode = cleanedCode

                    // Add global imports at the beginning if they exist
                    if (globalImports.length > 0) {
                        const globalImportsStr = globalImports.join('\n') + '\n\n'
                        updatedCode = globalImportsStr + updatedCode
                    }

                    // Handle forwardRef pattern transformation
                    if (usesForwardRef) {
                        // First, transform existing forwardRef syntax to regular function
                        // Match pattern like: const Flex = forwardRef<FlexProps<T>["inputRef"]>(function Flex(props:FlexProps<T>,inputRef) {
                        // OR: const Button = forwardRef<Design.SlotProps<T, typeof buttonRecipe>["inputRef"]>(function Button(props:Design.SlotProps<T, typeof buttonRecipe>,inputRef) {
                        const forwardRefFullPattern = new RegExp(
                            `const\\s+${componentName}\\s*=\\s*forwardRef<[^>]*(?:\\[[^\\]]*\\])?[^>]*>\\s*\\([\\s\\S]*?function\\s+${componentName}\\s*\\(([^,)]+),inputRef\\s*\\)[\\s\\S]*?\\{`,
                            'gm'
                        )

                        // Use simpler string-based approach instead of complex regex
                        const forwardRefStart = `const ${componentName} = forwardRef<`
                        const functionStart = `(function ${componentName}(`

                        if (updatedCode.includes(forwardRefStart) && updatedCode.includes(functionStart)) {
                            console.log(`[DEBUG] Found forwardRef pattern for ${componentName}`)

                            // Find the function signature
                            const functionStartIndex = updatedCode.indexOf(functionStart)
                            const paramsStart = functionStartIndex + functionStart.length
                            const paramsEnd = updatedCode.indexOf(',inputRef', paramsStart)

                            if (paramsEnd > paramsStart) {
                                const params = updatedCode.substring(paramsStart, paramsEnd).trim()
                                console.log(`[DEBUG] Extracted params: "${params}"`)

                                // Find the opening brace
                                const openBraceIndex = updatedCode.indexOf('{', paramsEnd)

                                // Replace the forwardRef declaration
                                const beforeForwardRef = updatedCode.substring(0, updatedCode.indexOf(forwardRefStart))
                                const afterOpenBrace = updatedCode.substring(openBraceIndex + 1)

                                updatedCode = beforeForwardRef +
                                    `function ${componentName}${generics || ''}(${params}, inputRef?: unknown) {\n` +
                                    afterOpenBrace

                                // Remove the closing }) from forwardRef
                                const lines = updatedCode.split('\n')
                                for (let i = lines.length - 1; i >= 0; i--) {
                                    if (lines[i].trim() === '})') {
                                        lines[i] = '}'
                                        break
                                    }
                                }
                                updatedCode = lines.join('\n')

                                console.log(`[DEBUG] Replacement completed for ${componentName}`)
                            }
                        } else {
                            console.log(`[DEBUG] ForwardRef pattern NOT found for ${componentName}`)
                        }
                        // No fallback logic - if forwardRef pattern is found, we handle it completely above

                        // Transform export to use forwardRef
                        const exportPattern = new RegExp(`export\\s+default\\s+${componentName}\\s*;?`)
                        if (exportPattern.test(updatedCode)) {
                            updatedCode = updatedCode.replace(
                                exportPattern,
                                `export default forwardRef(${componentName}) as typeof ${componentName}`
                            )
                        }

                        // Replace props.inputRef with inputRef in the code
                        updatedCode = updatedCode.replace(/props\.inputRef/g, 'inputRef')

                        // Remove forwardRef from imports if it's not needed anymore
                        // Remove lines like: import { forwardRef } from 'react'
                        updatedCode = updatedCode.replace(/import\s*\{\s*forwardRef\s*\}\s*from\s*['"]react['"];?\s*\n?/g, '')

                        // Remove forwardRef from mixed imports like: import React, { forwardRef, useState } from 'react'
                        updatedCode = updatedCode.replace(
                            /import\s+([^,]+),\s*\{\s*([^}]*?)forwardRef\s*,?\s*([^}]*?)\s*\}\s*from\s*(['"]react['"])/g,
                            (match, defaultImport, before, after, from) => {
                                const cleanBefore = before.trim().replace(/,$/, '')
                                const cleanAfter = after.trim().replace(/^,/, '')
                                const namedImports = [cleanBefore, cleanAfter].filter(x => x).join(', ')

                                if (namedImports) {
                                    return `import ${defaultImport}, { ${namedImports} } from ${from}`
                                } else {
                                    return `import ${defaultImport} from ${from}`
                                }
                            }
                        )
                    } else if (generics && cleanedCode.includes('function ')) {
                        // Add generics to function declaration if detected (non-forwardRef case)
                        const genericPattern = new RegExp(`(function\\s+${componentName})\\s*\\(`, 'g')
                        updatedCode = updatedCode.replace(genericPattern, `$1${generics}(`)
                    }

                    const functionPattern =
                        /(function\s+\w+[^{]*\{|component\$\([^{]*\{|=>\s*\{)(\s*)/

                    if (functionPattern.test(updatedCode)) {
                        return updatedCode.replace(
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
