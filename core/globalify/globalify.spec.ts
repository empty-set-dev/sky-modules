import '@sky-modules/platform/node'
import '@sky-modules/core/runtime'
import '@sky-modules/core/as'
import '@sky-modules/core/define'
import { describe, test, expect } from 'vitest'

import globalify from './globalify'

describe('globalify', () => {
    describe('basic functionality', () => {
        test('adds functions to global namespace', () => {
            const testFunc = () => 'test'
            define('test.globalify.func1', testFunc)

            globalify({ testGlobalFunc: testFunc })

            expect(global['testGlobalFunc']).toBe(testFunc)
        })

        test('adds objects to global namespace', () => {
            const testObj = { value: 42 }
            define('test.globalify.obj1', testObj)

            globalify({ testGlobalObj: testObj })

            expect(global['testGlobalObj']).toBe(testObj)
        })
    })

    describe('namespace function', () => {
        test('creates nested namespaces', () => {
            const testFunc = () => 'test'
            define('test.globalify.func2', testFunc)

            globalify.namespace('testNS.utils', { helper: testFunc })

            expect(global['testNS']).toBeDefined()
            expect(global['testNS']['utils']).toBeDefined()
            expect(global['testNS']['utils']['helper']).toBe(testFunc)
        })

        test('merges into existing namespaces', () => {
            const func1 = () => 'func1'
            const func2 = () => 'func2'
            define('test.globalify.func3', func1)
            define('test.globalify.func4', func2)

            globalify.namespace('testNS2.utils', { func1 })
            globalify.namespace('testNS2.utils', { func2 })

            expect(global['testNS2']['utils']['func1']).toBe(func1)
            expect(global['testNS2']['utils']['func2']).toBe(func2)
        })

        test('handles deep nesting', () => {
            const testFunc = () => 'deep'
            define('test.globalify.func5', testFunc)

            globalify.namespace('deep.nested.namespace.path', { testFunc })

            expect(global['deep']['nested']['namespace']['path']['testFunc']).toBe(testFunc)
        })
    })

    describe('prototype pollution protection', () => {
        test('prevents __proto__ pollution', () => {
            const malicious = { '__proto__': { polluted: true } }

            expect(() => {
                globalify(malicious as any)
            }).toThrow('Prototype pollution')
        })

        test('prevents constructor pollution', () => {
            const malicious = { 'constructor': { polluted: true } }

            expect(() => {
                globalify(malicious as any)
            }).toThrow('Prototype pollution')
        })

        test('prevents prototype pollution', () => {
            const malicious = { 'prototype': { polluted: true } }

            expect(() => {
                globalify(malicious as any)
            }).toThrow('Prototype pollution')
        })

        test('prevents __proto__ in namespace paths', () => {
            const testFunc = () => 'test'
            define('test.globalify.func6', testFunc)

            expect(() => {
                globalify.namespace('__proto__.polluted', { testFunc })
            }).toThrow('Prototype pollution')
        })

        test('prevents constructor in namespace paths', () => {
            const testFunc = () => 'test'
            define('test.globalify.func7', testFunc)

            expect(() => {
                globalify.namespace('safe.constructor.unsafe', { testFunc })
            }).toThrow('Prototype pollution')
        })

        test('prevents prototype in namespace paths', () => {
            const testFunc = () => 'test'
            define('test.globalify.func8', testFunc)

            expect(() => {
                globalify.namespace('safe.prototype.unsafe', { testFunc })
            }).toThrow('Prototype pollution')
        })

        test('allows safe property names', () => {
            const testFunc = () => 'safe'
            define('test.globalify.func9', testFunc)

            expect(() => {
                globalify({ safeProperty: testFunc })
                globalify.namespace('safe.namespace', { anotherSafe: testFunc })
            }).not.toThrow()
        })
    })

    describe('error handling', () => {
        test('throws error when namespace path is not a scope', () => {
            const testFunc = () => 'test'
            define('test.globalify.func10', testFunc)

            // First set a primitive value
            global['primitiveNS'] = 'string value'

            expect(() => {
                globalify.namespace('primitiveNS.nested', { testFunc })
            }).toThrow('not a scope')
        })
    })
})
