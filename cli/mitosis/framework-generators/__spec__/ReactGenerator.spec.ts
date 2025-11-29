import { describe, it, expect } from 'vitest'
import { ReactGenerator } from '../ReactGenerator'
import type { ReactGenerationContext } from '../ReactGenerator'

describe('ReactGenerator', () => {
    const generator = new ReactGenerator()

    describe('canHandle', () => {
        it('should detect function components', () => {
            const code = `function MyComponent() { return null }`
            expect(generator.canHandle(code)).toBe(true)
        })

        it('should detect arrow function components', () => {
            const code = `const MyComponent = () => { return null }`
            expect(generator.canHandle(code)).toBe(true)
        })

        it('should detect Qwik component$', () => {
            const code = `component$(() => { return null })`
            expect(generator.canHandle(code)).toBe(true)
        })

        it('should not detect class components', () => {
            const code = `class MyComponent extends React.Component {}`
            expect(generator.canHandle(code)).toBe(false)
        })
    })

    describe('generate', () => {
        it('should add global imports', () => {
            const context: ReactGenerationContext = {
                code: `function MyComponent() { return null }\nexport default MyComponent`,
                missingVars: [],
                globalImports: ['import React from "react"'],
                generics: null,
                componentName: 'MyComponent',
                usesForwardRef: false,
            }

            const result = generator.generate(context)
            expect(result.code).toContain('import React from "react"')
        })

        it('should handle property assignments', () => {
            const context: ReactGenerationContext = {
                code: `function Grid() { return null }\nexport default Grid`,
                missingVars: [{ name: 'Grid.Item', value: 'GridItem', line: 1 }],
                globalImports: [],
                generics: null,
                componentName: 'Grid',
                usesForwardRef: false,
            }

            const result = generator.generate(context)
            expect(result.code).toContain('Grid.Item = GridItem;')
            expect(result.code.indexOf('Grid.Item')).toBeLessThan(
                result.code.indexOf('export default Grid')
            )
        })

        it('should add variable declarations inside function', () => {
            const context: ReactGenerationContext = {
                code: `function MyComponent(props) {\n  return null\n}`,
                missingVars: [
                    { name: 'message', value: 'props.message', line: 1 },
                    { name: 'count', value: '42', line: 2 },
                ],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
                usesForwardRef: false,
            }

            const result = generator.generate(context)
            expect(result.code).toContain('// Preserved local variables (added by local-vars-plugin)')
            expect(result.code).toContain('const message = props.message;')
            expect(result.code).toContain('const count = 42;')
        })

        it('should handle rest props', () => {
            const context: ReactGenerationContext = {
                code: `function MyComponent(props) {\n  return null\n}`,
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
                usesForwardRef: false,
            }

            const result = generator.generate(context)
            expect(result.code).toContain(
                'const restProps = (({ as, className, ...rest }) => rest)(props);'
            )
        })

        it('should handle forwardRef transformation', () => {
            const context: ReactGenerationContext = {
                code: `const MyComponent = forwardRef<HTMLDivElement>((function MyComponent(props,inputRef) {\n  return null\n}))`,
                missingVars: [],
                globalImports: [],
                generics: '<T>',
                componentName: 'MyComponent',
                usesForwardRef: true,
            }

            const result = generator.generate(context)
            expect(result.code).toContain('function MyComponent<T>(props, inputRef?: unknown)')
            expect(result.code).not.toContain('forwardRef<')
        })

        it('should transform forwardRef export', () => {
            const context: ReactGenerationContext = {
                code: `const MyComponent = forwardRef<HTMLDivElement>((function MyComponent(props,inputRef) {\n  return null\n}))\nexport default MyComponent`,
                missingVars: [],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
                usesForwardRef: true,
            }

            const result = generator.generate(context)
            expect(result.code).toContain(
                'export default React.forwardRef(MyComponent) as typeof MyComponent'
            )
        })

        it('should remove forwardRef imports', () => {
            const context: ReactGenerationContext = {
                code: `import { forwardRef } from 'react'\nconst MyComponent = forwardRef<HTMLDivElement>((function MyComponent(props,inputRef) {\n  return null\n}))\nexport default MyComponent`,
                missingVars: [],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
                usesForwardRef: true,
            }

            const result = generator.generate(context)
            expect(result.code).not.toContain('import { forwardRef }')
        })

        it('should add generics to function (non-forwardRef)', () => {
            const context: ReactGenerationContext = {
                code: `function MyComponent(props) {\n  return null\n}`,
                missingVars: [],
                globalImports: [],
                generics: '<T, K>',
                componentName: 'MyComponent',
                usesForwardRef: false,
            }

            const result = generator.generate(context)
            expect(result.code).toContain('function MyComponent<T, K>(')
        })

        it('should remove forwardRef from mixed imports with only forwardRef', () => {
            const context: ReactGenerationContext = {
                code: `import React, { forwardRef } from 'react'\nconst MyComponent = forwardRef<HTMLDivElement>((function MyComponent(props,inputRef) {\n  return null\n}))\nexport default MyComponent`,
                missingVars: [],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
                usesForwardRef: true,
            }

            const result = generator.generate(context)
            expect(result.code).toContain("import React from 'react'")
            expect(result.code).not.toContain('import React, { forwardRef }')
        })

        it('should replace props.inputRef with inputRef', () => {
            const context: ReactGenerationContext = {
                code: `const MyComponent = forwardRef<HTMLDivElement>((function MyComponent(props,inputRef) {\n  return <div ref={props.inputRef} />\n}))\nexport default MyComponent`,
                missingVars: [],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
                usesForwardRef: true,
            }

            const result = generator.generate(context)
            expect(result.code).toContain('ref={inputRef}')
            expect(result.code).not.toContain('props.inputRef')
        })

        it('should handle Svelte edge case for uncovered lines', () => {
            const context: ReactGenerationContext = {
                code: `<script lang="ts">\nimport { something } from './lib'\n</script>`,
                missingVars: [],
                globalImports: [],
                generics: null,
                componentName: 'MyComponent',
                usesForwardRef: false,
            }

            // Should not match any framework pattern and return code as-is
            const result = generator.generate(context)
            expect(result.code).toContain('<script')
        })
    })
})
