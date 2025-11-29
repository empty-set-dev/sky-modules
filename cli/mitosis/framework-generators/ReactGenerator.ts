import type { FrameworkGenerator, GenerationContext, GenerationResult } from './types.ts'

export interface ReactGenerationContext extends GenerationContext {
    usesForwardRef: boolean
}

/**
 * React/Qwik code generator
 * Handles function components with forwardRef support and property assignments
 */
export class ReactGenerator implements FrameworkGenerator {
    canHandle(code: string): boolean {
        return code.includes('function ') || code.includes('component$(') || code.includes('=> {')
    }

    generate(context: ReactGenerationContext): GenerationResult {
        let { code, missingVars, globalImports, generics, componentName, usesForwardRef } = context

        // Add global imports at the beginning
        if (globalImports.length > 0) {
            const globalImportsStr = globalImports.join('\n') + '\n\n'
            code = globalImportsStr + code
        }

        // Handle property assignments (e.g., Grid.Item = ...)
        const propertyAssignmentVars = missingVars.filter(v => v.name.includes('.'))

        if (propertyAssignmentVars.length > 0) {
            const propertyAssignments = propertyAssignmentVars
                .map(v => `${v.name} = ${v.value};`)
                .join('\n')

            // Add before export default statement
            const exportPattern = new RegExp(`(\\s*)(export\\s+default\\s+${componentName};?)`, 'g')
            const matched = exportPattern.test(code)

            if (matched) {
                // Reset regex since test() consumed it
                const exportPattern2 = new RegExp(
                    `(\\s*)(export\\s+default\\s+${componentName};?)`,
                    'g'
                )
                code = code.replace(exportPattern2, `\n${propertyAssignments}\n\n$1$2`)
            }

            // Remove these from missingVars
            missingVars = missingVars.filter(v => !v.name.includes('.'))
        }

        // Handle forwardRef pattern transformation
        if (usesForwardRef) {
            code = this.handleForwardRef(code, componentName, generics)
        } else if (generics && code.includes('function ')) {
            // Add generics to function declaration (non-forwardRef case)
            const genericPattern = new RegExp(`(function\\s+${componentName})\\s*\\(`, 'g')
            code = code.replace(genericPattern, `$1${generics}(`)
        }

        // Generate variable declarations
        const variableDeclarations = missingVars
            .map(v => {
                if (v.isRest) {
                    return `  const ${v.name} = (({ ${v.omittedKeys}, ...rest }) => rest)(${v.sourceValue});`
                }

                return `  const ${v.name} = ${v.value};`
            })
            .join('\n')

        if (variableDeclarations) {
            const declarations = '\n' + variableDeclarations + '\n'
            const functionPattern = /(function\s+\w+[^{]*\{|component\$\([^{]*\{|=>\s*\{)(\s*)/

            if (functionPattern.test(code)) {
                code = code.replace(
                    functionPattern,
                    `$1$2  // Preserved local variables (added by local-vars-plugin)${declarations}
`
                )
            }
        }

        return { code }
    }

    /**
     * Handle forwardRef pattern transformation
     */
    private handleForwardRef(code: string, componentName: string, generics: string | null): string {
        const forwardRefStart = `const ${componentName} = forwardRef<`
        const functionStart = `(function ${componentName}(`

        if (code.includes(forwardRefStart) && code.includes(functionStart)) {
            // Find the function signature
            const functionStartIndex = code.indexOf(functionStart)
            const paramsStart = functionStartIndex + functionStart.length
            const paramsEnd = code.indexOf(',inputRef', paramsStart)

            if (paramsEnd > paramsStart) {
                const params = code.substring(paramsStart, paramsEnd).trim()

                // Find the opening brace
                const openBraceIndex = code.indexOf('{', paramsEnd)

                // Replace the forwardRef declaration
                const beforeForwardRef = code.substring(0, code.indexOf(forwardRefStart))
                const afterOpenBrace = code.substring(openBraceIndex + 1)

                code =
                    beforeForwardRef +
                    `function ${componentName}${generics || ''}(${params}, inputRef?: unknown) {\n` +
                    afterOpenBrace

                // Remove the closing }) from forwardRef
                const lines = code.split('\n')

                for (let i = lines.length - 1; i >= 0; i--) {
                    if (lines[i].trim() === '})') {
                        lines[i] = '}'
                        break
                    }
                }

                code = lines.join('\n')
            }
        }

        // Transform export to use forwardRef
        const exportPattern = new RegExp(`export\\s+default\\s+${componentName}\\s*;?`)

        if (exportPattern.test(code)) {
            code = code.replace(
                exportPattern,
                `export default React.forwardRef(${componentName}) as typeof ${componentName}`
            )
        }

        // Replace props.inputRef with inputRef in the code
        code = code.replace(/props\.inputRef/g, 'inputRef')

        // Remove forwardRef from imports
        code = code.replace(/import\s*\{\s*forwardRef\s*\}\s*from\s*['"]react['"];?\s*\n?/g, '')

        // Remove forwardRef from mixed imports
        code = code.replace(
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

        return code
    }
}
