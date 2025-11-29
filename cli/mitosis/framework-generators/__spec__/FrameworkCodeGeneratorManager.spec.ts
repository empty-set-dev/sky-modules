import { describe, it, expect } from 'vitest'

import { FrameworkCodeGeneratorManager } from '../FrameworkCodeGeneratorManager'
import type { GenerationContext } from '../types'

describe('FrameworkCodeGeneratorManager', () => {
    const manager = new FrameworkCodeGeneratorManager()

    it('should delegate to VueGenerator for Vue code', () => {
        const context: GenerationContext = {
            code: 'import { defineComponent } from "vue"\nexport default defineComponent({})',
            missingVars: [],
            globalImports: [],
            generics: null,
            componentName: 'MyComponent',
        }

        const result = manager.generate(context)
        expect(result.code).toContain('defineComponent')
    })

    it('should delegate to SvelteGenerator for Svelte code', () => {
        const context: GenerationContext = {
            code: '<script lang="ts">\nexport let name\n</script>',
            missingVars: [],
            globalImports: [],
            generics: null,
            componentName: 'MyComponent',
        }

        const result = manager.generate(context)
        expect(result.code).toContain('<script lang="ts">')
    })

    it('should delegate to AngularGenerator for Angular code', () => {
        const context: GenerationContext = {
            code: '@Component({})\nexport default class MyComponent {}',
            missingVars: [],
            globalImports: [],
            generics: null,
            componentName: 'MyComponent',
        }

        const result = manager.generate(context)
        expect(result.code).toContain('@Component')
    })

    it('should delegate to ReactGenerator for React code', () => {
        const context: GenerationContext = {
            code: 'function MyComponent() { return null }',
            missingVars: [],
            globalImports: [],
            generics: null,
            componentName: 'MyComponent',
        }

        const result = manager.generate(context)
        expect(result.code).toContain('function MyComponent')
    })

    it('should return code unchanged for unknown framework', () => {
        const context: GenerationContext = {
            code: 'const x = 42;',
            missingVars: [],
            globalImports: [],
            generics: null,
            componentName: 'MyComponent',
        }

        const result = manager.generate(context)
        expect(result.code).toBe('const x = 42;')
    })

    it('should prioritize Vue over React for defineComponent', () => {
        // This tests that Vue is checked before React
        const context: GenerationContext = {
            code: 'import { defineComponent } from "vue"\nexport default defineComponent({})',
            missingVars: [{ name: 'test', value: 'props.test', line: 1 }],
            globalImports: [],
            generics: null,
            componentName: 'MyComponent',
        }

        const result = manager.generate(context)
        // Should use Vue's setup function, not React's const declarations
        expect(result.code).toContain('setup(props)')
        expect(result.code).not.toContain('// Preserved local variables')
    })
})
