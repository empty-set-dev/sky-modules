import { describe, it, expect } from 'vitest'
import { VueGenerator } from '../VueGenerator'
import type { GenerationContext } from '../types'

describe('VueGenerator', () => {
    const generator = new VueGenerator()

    describe('canHandle', () => {
        it('should detect Vue defineComponent pattern', () => {
            const code = `
import { defineComponent } from 'vue'

export default defineComponent({
  props: [],
})
`
            expect(generator.canHandle(code)).toBe(true)
        })

        it('should not detect non-Vue code', () => {
            const code = `function MyComponent() { return null }`
            expect(generator.canHandle(code)).toBe(false)
        })
    })

    describe('generate', () => {
        it('should add global imports', () => {
            const context: GenerationContext = {
                code: `import { defineComponent } from 'vue'\nexport default defineComponent({})`,
                missingVars: [],
                globalImports: ['import { ref } from "vue"'],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('import { ref } from "vue"')
        })

        it('should add generics to defineComponent', () => {
            const context: GenerationContext = {
                code: `import { defineComponent } from 'vue'\nexport default defineComponent({})`,
                missingVars: [],
                globalImports: [],
                generics: '<T>',
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('defineComponent<T>(')
        })

        it('should generate setup function with variables', () => {
            const context: GenerationContext = {
                code: `import { defineComponent } from 'vue'\nexport default defineComponent({ props: [] })`,
                missingVars: [
                    { name: 'message', value: 'props.message', line: 1 },
                    { name: 'count', value: '42', line: 2 },
                ],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('setup(props)')
            expect(result.code).toContain('const message = props.message;')
            expect(result.code).toContain('const count = 42;')
            expect(result.code).toContain('return { message, count };')
        })

        it('should handle rest props with computed', () => {
            const context: GenerationContext = {
                code: `import { defineComponent } from 'vue'\nexport default defineComponent({ props: [] })`,
                missingVars: [
                    {
                        name: 'restProps',
                        value: '',
                        line: 1,
                        isRest: true,
                        omittedKeys: 'as, className',
                        sourceValue: 'props',
                    },
                ],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('import { defineComponent, computed }')
            expect(result.code).toContain('const restProps = computed(() => {')
            expect(result.code).toContain('const { as, className, ...rest } = props;')
            expect(result.code).toContain('return rest;')
        })

        it('should replace existing setup function', () => {
            const context: GenerationContext = {
                code: `import { defineComponent } from 'vue'\nexport default defineComponent({ setup(props) { return {} } })`,
                missingVars: [{ name: 'message', value: 'props.message', line: 1 }],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('setup(props)')
            expect(result.code).toContain('const message = props.message;')
            expect(result.code).toContain('return { message };')
        })
    })
})
