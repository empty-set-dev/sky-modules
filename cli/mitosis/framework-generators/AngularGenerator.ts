import type { FrameworkGenerator, GenerationContext, GenerationResult } from './types.ts'

/**
 * Angular code generator
 * Handles @Component decorator and class-based components with getters
 */
export class AngularGenerator implements FrameworkGenerator {
    canHandle(code: string): boolean {
        return code.includes('@Component') && code.includes('export default class')
    }

    generate(context: GenerationContext): GenerationResult {
        let { code, missingVars, globalImports, generics, componentName } = context

        // Remove any invalid ViewChild declarations
        code = code
            .replace(/@ViewChild\('[^']*\.[^']*'\)\s+[\w.]+\.[\w.]+[^\n]*\n?/g, '')
            .replace(/\n\s*\n\s*\n/g, '\n\n')

        // Add global imports at the beginning
        if (globalImports.length > 0) {
            const globalImportsStr = globalImports.join('\n') + '\n\n'
            code = globalImportsStr + code
        }

        // Add generics to Angular class if detected
        if (generics) {
            const classPattern = new RegExp(
                `(export\\s+default\\s+class\\s+${componentName})\\s`,
                'g'
            )
            code = code.replace(classPattern, `$1${generics} `)
        }

        if (missingVars.length === 0) return { code }

        // Generate getters for Angular
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
            code = code.replace(
                /(export default class \w+ \{)\s*(\})/,
                `$1
  props: any;
${getters.join('\n')}
$2`
            )
        } else {
            // Class has content - add getters after first line
            code = code.replace(
                /(export default class \w+ \{\s*)/,
                `$1
  props: any;
${getters.join('\n')}

`
            )
        }

        return { code }
    }
}
