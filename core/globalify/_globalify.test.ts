import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('globalify', () => {
    let originalGlobal: Record<PropertyKey, unknown>
    let globalify: typeof import('./_globalify').default

    beforeEach(async () => {
        // Save original global state
        originalGlobal = { ...global }

        // Import fresh module
        vi.resetModules()
        const module = await import('.')
        globalify = module.default
    })

    afterEach(() => {
        // Restore global state
        Object.keys(global).forEach(key => {
            if (!(key in originalGlobal)) {
                delete (global as Record<PropertyKey, unknown>)[key]
            }
        })

        // Restore original properties safely, skipping read-only ones
        Object.keys(originalGlobal).forEach(key => {
            try {
                ;(global as Record<PropertyKey, unknown>)[key] = originalGlobal[key]
            } catch {
                // Skip read-only properties like 'navigator'
            }
        })
    })

    describe('globalify function', () => {
        it('should add module exports to global scope', () => {
            const testModule = {
                testFunction: (): string => 'test result',
                testValue: 42,
                TestClass: class TestClass {
                    value = 'test'
                },
            }

            globalify(testModule)

            expect((global as Record<string, unknown>).testFunction).toBe(testModule.testFunction)
            expect((global as Record<string, unknown>).testValue).toBe(testModule.testValue)
            expect((global as Record<string, unknown>).TestClass).toBe(testModule.TestClass)
        })

        it('should handle empty module', () => {
            const emptyModule = {}
            expect(() => globalify(emptyModule)).not.toThrow()
        })

        it('should handle module with various property types', () => {
            const complexModule = {
                stringProp: 'test',
                numberProp: 123,
                booleanProp: true,
                objectProp: { nested: 'value' },
                arrayProp: [1, 2, 3],
                functionProp: (): number => 456,
                nullProp: null,
                undefinedProp: undefined,
            }

            globalify(complexModule)

            Object.entries(complexModule).forEach(([key, value]) => {
                expect((global as Record<string, unknown>)[key]).toBe(value)
            })
        })
    })

    describe('globalify.namespace function', () => {
        it('should create simple namespace', () => {
            const moduleData = { testProp: 'value' }

            globalify.namespace('testNamespace', moduleData)

            const scope = (global as unknown as Record<string, Record<string, unknown>>)
                .testNamespace
            expect(scope).toBeDefined()
            expect(scope.testProp).toBe('value')
        })

        it('should create nested namespaces', () => {
            const moduleData = { nestedProp: 'nested value' }

            globalify.namespace('app.utils.helpers', moduleData)

            const scope = (
                global as unknown as Record<
                    string,
                    Record<string, Record<string, Record<string, unknown>>>
                >
            ).app?.utils?.helpers
            expect(scope).toBeDefined()
            expect(scope.nestedProp).toBe('nested value')
        })

        it('should handle deep nesting', () => {
            const moduleData = { deepProp: 'deep value' }

            globalify.namespace('a.b.c.d.e.f', moduleData)

            const scope = (global as Record<string, unknown>).a as Record<string, unknown>
            const final = (scope.b as Record<string, unknown>).c as Record<string, unknown>
            const result = (final.d as Record<string, unknown>).e as Record<string, unknown>
            const target = result.f as Record<string, unknown>

            expect(target.deepProp).toBe('deep value')
        })

        it('should merge into existing namespace', () => {
            // Create initial namespace
            globalify.namespace('shared', { prop1: 'value1' })

            // Add to existing namespace
            globalify.namespace('shared', { prop2: 'value2' })

            const scope = (global as unknown as Record<string, Record<string, unknown>>).shared
            expect(scope.prop1).toBe('value1')
            expect(scope.prop2).toBe('value2')
        })

        it('should throw error when trying to use non-scope as namespace', () => {
            // Set up a primitive value in global
            ;(global as Record<string, unknown>).primitiveValue = 'not an object'

            expect(() => {
                globalify.namespace('primitiveValue.subNamespace', { prop: 'value' })
            }).toThrow('globalify.namespace: not a scope')
        })

        it('should handle empty namespace string', () => {
            const moduleData = { rootProp: 'root value' }

            // This should create namespace with empty string key
            expect(() => {
                globalify.namespace('', moduleData)
            }).not.toThrow()
        })

        it('should handle single dot namespace', () => {
            const moduleData = { singleDotProp: 'single dot value' }

            globalify.namespace('single', moduleData)

            const scope = (global as unknown as Record<string, Record<string, unknown>>).single
            expect(scope.singleDotProp).toBe('single dot value')
        })
    })

    describe('isScope function behavior through namespace', () => {
        it('should allow function as scope and create prytoperty on it', () => {
            const functionScope = (): void => {
                //
            }
            ;(global as Record<string, unknown>).functionScope = functionScope

            globalify.namespace('functionScope.sub', { prop: 'value' })

            // Verify the property was actually created
            const scope = (functionScope as unknown as Record<string, Record<string, unknown>>).sub
            expect(scope).toBeDefined()
            expect(scope.prop).toBe('value')
        })

        it('should allow object as scope and merge properties', () => {
            const objectScope = { existing: 'prop' }
            ;(global as Record<string, unknown>).objectScope = objectScope

            globalify.namespace('objectScope.sub', { newProp: 'newValue' })

            // Verify both old and new properties exist
            expect(objectScope.existing).toBe('prop')
            const scope = (objectScope as unknown as Record<string, Record<string, unknown>>).sub
            expect(scope.newProp).toBe('newValue')
        })

        it('should reject null as scope with exact error', () => {
            ;(global as Record<string, unknown>).nullScope = null

            expect(() => {
                globalify.namespace('nullScope.sub', { prop: 'value' })
            }).toThrow('globalify.namespace: not a scope')

            // Verify nothing was created
            expect((global as Record<string, unknown>).nullScope).toBe(null)
        })

        it('should reject primitive number as scope with exact error', () => {
            ;(global as Record<string, unknown>).numberScope = 42

            expect(() => {
                globalify.namespace('numberScope.sub', { prop: 'value' })
            }).toThrow('globalify.namespace: not a scope')

            // Verify original value unchanged
            expect((global as Record<string, unknown>).numberScope).toBe(42)
        })

        it('should reject primitive string as scope with exact error', () => {
            ;(global as Record<string, unknown>).stringScope = 'not a scope'

            expect(() => {
                globalify.namespace('stringScope.sub', { prop: 'value' })
            }).toThrow('globalify.namespace: not a scope')

            // Verify original value unchanged
            expect((global as Record<string, unknown>).stringScope).toBe('not a scope')
        })

        it('should reject boolean as scope with exact error', () => {
            ;(global as Record<string, unknown>).booleanScope = true

            expect(() => {
                globalify.namespace('booleanScope.sub', { prop: 'value' })
            }).toThrow('globalify.namespace: not a scope')

            // Verify original value unchanged
            expect((global as Record<string, unknown>).booleanScope).toBe(true)
        })

        it('should reject undefined as scope', () => {
            ;(global as Record<string, unknown>).undefinedScope = undefined

            expect(() => {
                globalify.namespace('undefinedScope.sub', { prop: 'value' })
            }).toThrow('globalify.namespace: not a scope')
        })
    })

    describe('namespace function edge cases', () => {
        it('should handle dot splitting correctly', () => {
            globalify.namespace('a.b.c', { testProp: 'testValue' })

            // Verify exact structure
            const a = (global as unknown as Record<string, Record<string, unknown>>).a
            const b = a.b as Record<string, Record<string, unknown>>
            const c = b.c as Record<string, unknown>

            expect(c.testProp).toBe('testValue')
            expect(Object.keys(a)).toEqual(['b'])
            expect(Object.keys(b)).toEqual(['c'])
            expect(Object.keys(c)).toContain('testProp')
        })

        it('should create empty objects for intermediate namespaces', () => {
            globalify.namespace('x.y.z', { finalProp: 'final' })

            const x = (global as unknown as Record<string, Record<string, unknown>>).x
            const y = x.y as Record<string, Record<string, unknown>>

            // Intermediate objects should be created even if empty
            expect(x).toBeDefined()
            expect(y).toBeDefined()
            expect(typeof x).toBe('object')
            expect(typeof y).toBe('object')
        })

        it('should handle single character namespace parts', () => {
            globalify.namespace('a.b.c.d.e.f.g', { deepValue: 'very deep' })

            let current = global as Record<string, unknown>
            const path = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]] as Record<string, unknown>
                expect(current).toBeDefined()
                expect(typeof current).toBe('object')
            }

            const final = current[path[path.length - 1]] as Record<string, unknown>
            expect(final.deepValue).toBe('very deep')
        })

        it('should handle namespace with numeric string keys', () => {
            globalify.namespace('1.2.3', { numericPath: 'works' })

            const one = (global as unknown as Record<string, Record<string, unknown>>)['1']
            const two = one['2'] as Record<string, Record<string, unknown>>
            const three = two['3'] as Record<string, unknown>

            expect(three.numericPath).toBe('works')
        })

        it('should fail at exact point where non-scope is encountered', () => {
            // Set up nested structure with primitive at specific depth
            ;(global as Record<string, unknown>).level1 = {}
            ;(global as unknown as Record<string, Record<string, unknown>>).level1.level2 =
                'primitive'

            expect(() => {
                globalify.namespace('level1.level2.level3', { shouldFail: true })
            }).toThrow('globalify.namespace: not a scope')

            // Verify structure unchanged up to failure point
            expect((global as Record<string, unknown>).level1).toBeDefined()
            expect(
                (global as unknown as Record<string, Record<string, unknown>>).level1.level2
            ).toBe('primitive')
        })
    })

    describe('globalify function strict behavior', () => {
        it('should copy all enumerable properties exactly', () => {
            const sourceModule = {
                prop1: 'value1',
                prop2: 42,
                prop3: { nested: 'object' },
                prop4: [1, 2, 3],
            }

            globalify(sourceModule)

            // Check each property individually
            expect((global as Record<string, unknown>).prop1).toBe(sourceModule.prop1)
            expect((global as Record<string, unknown>).prop2).toBe(sourceModule.prop2)
            expect((global as Record<string, unknown>).prop3).toBe(sourceModule.prop3)
            expect((global as Record<string, unknown>).prop4).toBe(sourceModule.prop4)

            // Verify references are preserved (not deep copied)
            expect((global as Record<string, unknown>).prop3).toBe(sourceModule.prop3)
            expect((global as Record<string, unknown>).prop4).toBe(sourceModule.prop4)
        })

        it('should handle symbols as keys', () => {
            const sym1 = Symbol('test1')
            const sym2 = Symbol('test2')
            const moduleWithSymbols = {
                [sym1]: 'symbol value 1',
                [sym2]: 'symbol value 2',
                normalProp: 'normal',
            }

            globalify(moduleWithSymbols)

            expect((global as Record<PropertyKey, unknown>)[sym1]).toBe('symbol value 1')
            expect((global as Record<PropertyKey, unknown>)[sym2]).toBe('symbol value 2')
            expect((global as Record<string, unknown>).normalProp).toBe('normal')
        })

        it('should handle numeric keys', () => {
            const moduleWithNumbers = {
                0: 'zero',
                1: 'one',
                42: 'forty-two',
            }

            globalify(moduleWithNumbers)

            expect((global as Record<PropertyKey, unknown>)[0]).toBe('zero')
            expect((global as Record<PropertyKey, unknown>)[1]).toBe('one')
            expect((global as Record<PropertyKey, unknown>)[42]).toBe('forty-two')
        })
    })
})
