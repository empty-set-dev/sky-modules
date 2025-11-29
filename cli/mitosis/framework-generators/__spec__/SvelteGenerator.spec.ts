import { describe, it, expect } from 'vitest'

import { SvelteGenerator } from '../SvelteGenerator'
import type { GenerationContext } from '../types'

describe('SvelteGenerator', () => {
    const generator = new SvelteGenerator()

    describe('canHandle', () => {
        it('should detect Svelte script tags with double quotes', () => {
            const code = `<script lang="ts">\nexport let name\n</script>`
            expect(generator.canHandle(code)).toBe(true)
        })

        it('should detect Svelte script tags with single quotes', () => {
            const code = `<script lang='ts'>\nexport let name\n</script>`
            expect(generator.canHandle(code)).toBe(true)
        })

        it('should detect Svelte context script', () => {
            const code = `<script context="module">\nexport const data = {}\n</script>`
            expect(generator.canHandle(code)).toBe(true)
        })

        it('should not detect non-Svelte code', () => {
            const code = `function MyComponent() { return null }`
            expect(generator.canHandle(code)).toBe(false)
        })
    })

    describe('generate', () => {
        it('should add global imports before script tag', () => {
            const context: GenerationContext = {
                code: `<script lang="ts">\nexport let name\n</script>`,
                missingVars: [],
                globalImports: ['import { writable } from "svelte/store"'],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('import { writable } from "svelte/store"')
            expect(result.code.indexOf('import { writable }')).toBeLessThan(
                result.code.indexOf('<script')
            )
        })

        it('should add generics to script tag with double quotes', () => {
            const context: GenerationContext = {
                code: `<script lang="ts">\nexport let name\n</script>`,
                missingVars: [],
                globalImports: [],
                generics: '<T>',
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('<script lang="ts" generics="T">')
        })

        it('should add generics to script tag with single quotes', () => {
            const context: GenerationContext = {
                code: `<script lang='ts'>\nexport let name\n</script>`,
                missingVars: [],
                globalImports: [],
                generics: '<T>',
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain("<script lang='ts' generics='T'>")
        })

        it('should add export let declarations', () => {
            const context: GenerationContext = {
                code: `<script lang="ts">\nimport { something } from './lib'\n</script>`,
                missingVars: [
                    { name: 'message', value: 'props.message', line: 1 },
                    { name: 'count', value: '42', line: 2 },
                ],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('export let message: any = undefined;')
            expect(result.code).toContain('export let count: any = undefined;')
        })

        it('should add declarations in script section', () => {
            const context: GenerationContext = {
                code: `<script lang="ts">\nimport { something } from './lib'\n\nlet localVar = 123\n</script>`,
                missingVars: [{ name: 'message', value: 'props.message', line: 1 }],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('export let message: any = undefined;')
            expect(result.code).toContain('let localVar = 123')
        })

        it('should handle rest props with reactive statement', () => {
            const context: GenerationContext = {
                code: `<script lang="ts">\nexport let name\n</script>`,
                missingVars: [
                    {
                        name: 'restProps',
                        value: '',
                        line: 1,
                        isRest: true,
                        omittedKeys: 'as, className',
                        sourceValue: '$$props',
                    },
                ],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('$: restProps = (() => {')
            expect(result.code).toContain('const { as, className, ...rest } = $$props;')
            expect(result.code).toContain('return rest;')
        })

        it('should return code unchanged if no missing vars', () => {
            const context: GenerationContext = {
                code: `<script lang="ts">\nexport let name\n</script>`,
                missingVars: [],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toBe(context.code)
        })

        it('should handle script with no imports', () => {
            const context: GenerationContext = {
                code: `<script lang="ts">\nlet count = 0\n</script>`,
                missingVars: [{ name: 'message', value: 'props.message', line: 1 }],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('export let message: any = undefined;')
            expect(result.code).toContain('let count = 0')
        })
    })
})
