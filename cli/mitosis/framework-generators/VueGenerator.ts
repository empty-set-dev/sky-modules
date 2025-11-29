import type { FrameworkGenerator, GenerationContext, GenerationResult } from './types.ts'

/**
 * Vue.js code generator
 * Handles defineComponent pattern with setup function
 */
export class VueGenerator implements FrameworkGenerator {
    canHandle(code: string): boolean {
        return code.includes('defineComponent')
    }

    generate(context: GenerationContext): GenerationResult {
        let { code, missingVars, globalImports, generics } = context

        // Add global imports at the beginning
        if (globalImports.length > 0) {
            const globalImportsStr = globalImports.join('\n') + '\n\n'
            code = globalImportsStr + code
        }

        // Add generics to Vue component if detected
        if (generics) {
            const vueGenericPattern = /defineComponent\s*\(/g
            code = code.replace(vueGenericPattern, `defineComponent${generics}(`)
        }

        // Add computed import if restProps is used
        const hasRestProps = missingVars.some(v => v.isRest)

        if (hasRestProps && !code.includes('computed')) {
            code = code.replace(
                'import { defineComponent }',
                'import { defineComponent, computed }'
            )
        }

        // Generate Vue-specific variable declarations
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
        if (code.includes('setup(props)')) {
            code = code.replace(/setup\(props\)\s*\{[^}]*\}/, setupFunction.trim())
        } else if (code.includes('props: []')) {
            code = code.replace(/props:\s*\[\s*\]/, `props: [],${setupFunction}`)
        } else {
            code = code.replace(/(defineComponent\(\{)(\s*)/, `$1$2${setupFunction}\n`)
        }

        return { code }
    }
}
