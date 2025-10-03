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

    // Store extracted variables from the source code
    let extractedVariables: Array<{
        name: string
        value: string
        line: number
        isRest?: boolean
        omittedKeys?: string
        sourceValue?: string
    }> = []

    const getVariableNamesFromCode = (code: string): string[] => {
        const variables = new Set<string>()

        // Extract const variable declarations
        const constMatches = code.match(/const\s+(\w+)\s*=/g) || []
        constMatches.forEach(match => {
            const varName = match.match(/const\s+(\w+)/)?.[1]
            if (varName) variables.add(varName)
        })

        // Extract destructured variables including rest parameters
        const destructMatches = code.match(/const\s*\{\s*([^}]+)\s*\}\s*=/g) || []
        destructMatches.forEach(match => {
            const vars = match.match(/const\s*\{\s*([^}]+)\s*\}/)?.[1]
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

        return Array.from(variables)
    }

    const parseVariablesFromSourceCode = (code: string): void => {
        extractedVariables = []
        const lines = code.split('\n')

        lines.forEach((line, index) => {
            // Match const variable declarations
            const constMatch = line.match(/const\s+(\w+)\s*=\s*(.+)/)
            if (constMatch) {
                extractedVariables.push({
                    name: constMatch[1],
                    value: constMatch[2].trim(),
                    line: index,
                })
            }

            // Match destructuring with rest
            const destructMatch = line.match(/const\s*\{\s*([^}]+)\s*\}\s*=\s*(.+)/)
            if (destructMatch) {
                const vars = destructMatch[1]
                const value = destructMatch[2].trim()
                const parsedVars: Array<{ name: string; isRest: boolean }> = []

                vars.split(',').forEach(v => {
                    const trimmed = v.trim()
                    if (trimmed.startsWith('...')) {
                        const restName = trimmed.substring(3).trim()
                        if (restName) parsedVars.push({ name: restName, isRest: true })
                    } else {
                        const varName = trimmed.split(':')[0].trim()
                        if (varName) parsedVars.push({ name: varName, isRest: false })
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
                            line: index,
                            isRest: true,
                            omittedKeys: omittedKeys,
                            sourceValue: value,
                        })
                    } else {
                        extractedVariables.push({
                            name: variable.name,
                            value: `${value}.${variable.name}`,
                            line: index,
                        })
                    }
                })
            }
        })

        extractedVariables.sort((a, b) => a.line - b.line)
    }

    const findUsedVariables = (code: string): string[] => {
        const usedVars = new Set<string>()

        // Common variable patterns in templates/JSX
        const patterns = [
            /\{(\w+)\}/g, // {varName}
            /\{\{(\w+)\}\}/g, // {{varName}}
            /\{\.\.\.(\w+)\}/g, // {...restProps}
            /v-bind="(\w+)"/g, // v-bind="restProps" (Vue)
            /className=\{(\w+)\}/g, // className={varName}
            /class=\{(\w+)\}/g, // class={varName}
            /\[class\]="(\w+)"/g, // [class]="varName"
            /\*ngIf="(\w+)"/g, // *ngIf="varName"
            /v-if="(\w+)"/g, // v-if="varName"
            /#if\s+(\w+)/g, // #if varName
            /:class="(\w+)"/g, // :class="varName"
            /\$\{(\w+)\s*\?/g, // ${varName ?
            /`[^`]*\$\{[^}]*(\w+)[^}]*\}[^`]*`/g, // template literals ${varName}
            /(\w+)\s*\?/g, // varName ?
            /(\w+)\s*&&/g, // varName &&
            /setAttributes\([^,]+,\s*(\w+)\)/g, // setAttributes(el, restProps) (Angular)
            /(\w+)\)\s*;$/gm, // restProps); (Angular end of line)
            /\|\|\s*(\w+)/g, // || varName
            /(\w+)\s*\|\|/g, // varName ||
            /as=\{(\w+)/g, // as={varName}
            /=\{(\w+)\s*\?\?/g, // ={varName ??
        ]

        patterns.forEach(pattern => {
            let match

            while ((match = pattern.exec(code)) !== null) {
                if (match[1] && !['props', 'children', 'slot'].includes(match[1])) {
                    usedVars.add(match[1])
                }
            }
        })

        return Array.from(usedVars)
    }

    return () => ({
        name: 'local-vars-preserve',
        order: 10,

        code: {
            // @ts-expect-error
            pre: (code: string, options?: { path?: string }): string => {
                parseVariablesFromSourceCode(code)
                return code
            },

            // @ts-expect-error
            post: (code: string, options?: { path?: string }): string => {
                if (!enabled) return code

                if (extractedVariables.length === 0) return code

                const usedVars = findUsedVariables(code)
                const declaredVars = getVariableNamesFromCode(code)

                // Find variables that are used but not declared
                const missingVarNames = usedVars.filter(name =>
                    !declaredVars.includes(name) &&
                    name !== 'null' && // ignore literals
                    name !== 'undefined'
                )

                // Create missing variable declarations
                let missingVars = missingVarNames.map(name => {
                    // Try to find in extracted variables first
                    const extracted = extractedVariables.find(v => v.name === name)
                    if (extracted) return extracted

                    // For any missing variable, try to create it from props
                    return {
                        name: name,
                        value: `props.${name}`,
                        line: 0,
                    }
                })

                // Add dependent variables if any required variable is used
                if (usedVars.includes('className') && !declaredVars.includes('isVisible')) {
                    const isVisibleVar = extractedVariables.find(v => v.name === 'isVisible')
                    if (isVisibleVar && !missingVars.includes(isVisibleVar)) {
                        missingVars.push(isVisibleVar)
                    }
                }

                if (missingVars.length === 0) return code

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
                if (code.includes('defineComponent')) {
                    // Add computed import if restProps is used
                    const hasRestProps = missingVars.some(v => v.isRest)
                    const computedImport =
                        hasRestProps && !code.includes('computed')
                            ? code.replace(
                                  'import { defineComponent }',
                                  'import { defineComponent, computed }'
                              )
                            : code

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

                // Svelte support
                if (code.includes('<script lang="ts">') && code.includes('</script>')) {
                    // In Svelte, we need to declare props individually and create restProps
                    const restVar = missingVars.find(v => v.isRest)
                    let svelteCode = code

                    if (restVar && restVar.omittedKeys) {
                        // Add export declarations for individual props
                        const propsToExport = restVar.omittedKeys.split(', ')
                        const exportDeclarations = propsToExport
                            .map(prop => `  export let ${prop}: any = undefined;`)
                            .join('\n')

                        // Create restProps reactive statement
                        const restDeclaration = `  $: ${restVar.name} = (() => {
    const { ${restVar.omittedKeys}, ...rest } = $$props;
    return rest;
  })();`

                        svelteCode = svelteCode.replace(
                            /(<script lang="ts">)(\s*)/,
                            `$1$2
${exportDeclarations}
${restDeclaration}

`
                        )
                    }

                    return svelteCode
                }

                // Angular support
                if (code.includes('@Component') && code.includes('export default class')) {
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
                    if (code.includes('export default class') && code.includes('{\n}')) {
                        // Empty class - add props and getters
                        return code.replace(
                            /(export default class \w+ \{)\s*(\})/,
                            `$1
  props: any;
${getters.join('\n')}
$2`
                        )
                    } else {
                        // Class has content - add getters after first line
                        return code.replace(
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
                    code.includes('function ') ||
                    code.includes('component$(') ||
                    code.includes('=> {')
                ) {
                    const functionPattern =
                        /(function\s+\w+[^{]*\{|component\$\([^{]*\{|=>\s*\{)(\s*)/

                    if (functionPattern.test(code)) {
                        return code.replace(
                            functionPattern,
                            `$1$2  // Preserved local variables (added by local-vars-plugin)${declarations}
`
                        )
                    }
                }

                return code
            },
        },
    })
}

export default localVarsPlugin
