import { describe, it, expect, beforeEach } from '@jest/globals'

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
        const mockFunction = jest.fn()
        target.func = mockFunction
        const source = { func: { prop1: 'value1', prop2: 123 } }

        mergeNamespace(target, source)

        expect(target.func).toBe(mockFunction)
        expect((target.func as Record<string, unknown>).prop1).toBe('value1')
        expect((target.func as Record<string, unknown>).prop2).toBe(123)
    })

    it('should replace object with function when source has function', () => {
        target.item = { oldProp: 'old' }
        const mockFunction = jest.fn()
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

    it('should work with complex nested structures', () => {
        const complexFunc = (): string => 'result'
        complexFunc.staticProp = 'existing'

        target.complex = complexFunc
        const source = {
            complex: {
                newProp: 'added',
                nestedObj: { deep: true },
            },
        }

        mergeNamespace(target, source)

        expect(target.complex).toBe(complexFunc)
        expect((target.complex as Record<string, unknown>).staticProp).toBe('existing')
        expect((target.complex as Record<string, unknown>).newProp).toBe('added')
        expect((target.complex as Record<string, unknown>).nestedObj).toEqual({ deep: true })
    })

    it('should handle empty objects', () => {
        const source = {}

        mergeNamespace(target, source)

        expect(target).toEqual({})
    })

    it('should preserve function behavior after merging', () => {
        const mockFunction = jest.fn(() => 'original')
        target.func = mockFunction
        const source = { func: { helper: 'utility' } }

        mergeNamespace(target, source)

        const result = (target.func as Function)()
        expect(result).toBe('original')
        expect((target.func as Record<string, unknown>).helper).toBe('utility')
        expect(mockFunction).toHaveBeenCalled()
    })
})
