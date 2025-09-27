import 'sky/platform/node/initial'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import mergeNamespace from './mergeNamespace'

describe('mergeNamespace', () => {
    let target: Record<string, unknown>

    beforeEach(() => {
        target = {}
    })

    it('should merge simple properties', () => {
        const source = { a: 1, b: 'test' }

        mergeNamespace(target, source)

        expect(target.a).toBe(1)
        expect(target.b).toBe('test')
    })

    it('should override existing properties with new values', () => {
        target.existing = 'old'
        const source = { existing: 'new', other: 42 }

        mergeNamespace(target, source)

        expect(target.existing).toBe('new')
        expect(target.other).toBe(42)
    })

    it('should merge function with object properties when target has function', () => {
        const mockFunction = vi.fn()
        target.func = mockFunction
        const source = { func: { prop1: 'value1', prop2: 123 } }

        mergeNamespace(target, source)

        expect(target.func).toBe(mockFunction)
        expect((target.func as Record<string, unknown>).prop1).toBe('value1')
        expect((target.func as Record<string, unknown>).prop2).toBe(123)
    })

    it('should replace object with function when source has function', () => {
        target.item = { oldProp: 'old' }
        const mockFunction = vi.fn()
        const source = { item: mockFunction }

        mergeNamespace(target, source)

        expect(target.item).toBe(mockFunction)
        expect((target.item as Record<string, unknown>).oldProp).toBe('old')
    })

    it('should handle arrays as regular values', () => {
        target.arr = [1, 2, 3]
        const source = { arr: [4, 5, 6], newArr: ['a', 'b'] }

        mergeNamespace(target, source)

        expect(target.arr).toEqual([4, 5, 6])
        expect(target.newArr).toEqual(['a', 'b'])
    })

    it('should handle null and undefined values', () => {
        target.nullProp = null
        target.undefinedProp = undefined
        const source = {
            nullProp: 'notNull',
            undefinedProp: 'notUndefined',
            newNull: null,
            newUndefined: undefined,
        }

        mergeNamespace(target, source)

        expect(target.nullProp).toBe('notNull')
        expect(target.undefinedProp).toBe('notUndefined')
        expect(target.newNull).toBeNull()
        expect(target.newUndefined).toBeUndefined()
    })

    it('should not merge function when source is array', () => {
        const mockFunction = vi.fn()
        target.func = mockFunction
        const source = { func: [1, 2, 3] }

        mergeNamespace(target, source)

        expect(target.func).toEqual([1, 2, 3])
        expect(target.func).not.toBe(mockFunction)
    })

    it('should not merge object when target is array', () => {
        target.arr = [1, 2, 3]
        const mockFunction = vi.fn()
        const source = { arr: mockFunction }

        mergeNamespace(target, source)

        expect(target.arr).toBe(mockFunction)
        expect(Array.isArray(target.arr)).toBe(false)
    })

    it('should handle null checks correctly', () => {
        target.nullProp = null
        const source = { nullProp: { newValue: 'test' } }

        mergeNamespace(target, source)

        expect(target.nullProp).toEqual({ newValue: 'test' })
        expect(target.nullProp).not.toBeNull()
    })

    it('should verify type checks for function merging', () => {
        const mockFunction = vi.fn()
        target.func = mockFunction
        const source = { func: 'not an object' }

        mergeNamespace(target, source)

        expect(target.func).toBe('not an object')
        expect(typeof target.func).toBe('string')
    })

    it('should verify type checks for object merging', () => {
        target.obj = { existing: 'prop' }
        const source = { obj: 'not a function' }

        mergeNamespace(target, source)

        expect(target.obj).toBe('not a function')
        expect(typeof target.obj).toBe('string')
    })

    it('should handle non-null falsy values', () => {
        target.falsyProp = 0
        const source = { falsyProp: { newProp: 'value' } }

        mergeNamespace(target, source)

        expect(target.falsyProp).toEqual({ newProp: 'value' })
    })
})
