import { describe, it, expect } from 'vitest'

import { AngularGenerator } from '../AngularGenerator'
import type { GenerationContext } from './types'

describe('AngularGenerator', () => {
    const generator = new AngularGenerator()

    describe('canHandle', () => {
        it('should detect Angular components', () => {
            const code = `@Component({})\nexport default class MyComponent {}`
            expect(generator.canHandle(code)).toBe(true)
        })

        it('should not detect non-Angular code', () => {
            const code = `export default class MyComponent {}`
            expect(generator.canHandle(code)).toBe(false)
        })

        it('should not detect component without export default class', () => {
            const code = `@Component({})\nclass MyComponent {}`
            expect(generator.canHandle(code)).toBe(false)
        })
    })

    describe('generate', () => {
        it('should add global imports', () => {
            const context: GenerationContext = {
                code: `@Component({})\nexport default class MyComponent {}`,
                missingVars: [],
                globalImports: ['import { Injectable } from "@angular/core"'],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('import { Injectable } from "@angular/core"')
        })

        it('should add generics to class', () => {
            const context: GenerationContext = {
                code: `@Component({})\nexport default class MyComponent {}`,
                missingVars: [],
                globalImports: [],
                generics: '<T>',
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('export default class MyComponent<T>')
        })

        it('should remove invalid ViewChild declarations', () => {
            const context: GenerationContext = {
                code: `@Component({})\nexport default class MyComponent {\n  @ViewChild('popover.triggerRef') popover.triggerRef!: ElementRef\n}`,
                missingVars: [],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).not.toContain("@ViewChild('popover.triggerRef')")
        })

        it('should add getters to empty class', () => {
            const context: GenerationContext = {
                code: `@Component({})\nexport default class MyComponent {\n}`,
                missingVars: [
                    { name: 'message', value: 'props.message', line: 1 },
                    { name: 'count', value: '42', line: 2 },
                ],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('props: any;')
            expect(result.code).toContain('get message() { return this.props?.message; }')
            expect(result.code).toContain('get count() { return 42; }')
        })

        it('should add getters to non-empty class', () => {
            const context: GenerationContext = {
                code: `@Component({})\nexport default class MyComponent {\n  someMethod() {}\n}`,
                missingVars: [{ name: 'message', value: 'props.message', line: 1 }],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('props: any;')
            expect(result.code).toContain('get message() { return this.props?.message; }')
            expect(result.code).toContain('someMethod()')
        })

        it('should handle rest props with getter', () => {
            const context: GenerationContext = {
                code: `@Component({})\nexport default class MyComponent {\n}`,
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
            expect(result.code).toContain('get restProps() {')
            expect(result.code).toContain('const { as, className, ...rest } = this.props || {};')
            expect(result.code).toContain('return rest;')
        })

        it('should replace variable references with this.', () => {
            const context: GenerationContext = {
                code: `@Component({})\nexport default class MyComponent {\n}`,
                missingVars: [
                    { name: 'foo', value: 'props.foo', line: 1 },
                    { name: 'bar', value: 'foo + 1', line: 2 },
                ],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
            }

            const result = generator.generate(context)
            expect(result.code).toContain('get foo() { return this.props?.foo; }')
            expect(result.code).toContain('get bar() { return this.foo + 1; }')
        })
    })
})
