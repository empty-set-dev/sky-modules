import 'sky/platform/node/initial'
import 'sky/core/Array/global'
import { describe, expect, test } from 'vitest'

describe('Array extensions', () => {
    describe('last()', () => {
        test('returns last element of non-empty array', () => {
            const arr = [1, 2, 3, 4, 5]
            expect(arr.last()).toBe(5)
        })

        test('returns last element of single-element array', () => {
            const arr = [42]
            expect(arr.last()).toBe(42)
        })

        test('returns undefined for empty array', () => {
            const arr: number[] = []
            expect(arr.last()).toBeUndefined()
        })

        test('works with different data types', () => {
            expect(['a', 'b', 'c'].last()).toBe('c')
            expect([{ id: 1 }, { id: 2 }].last()).toEqual({ id: 2 })
            expect([true, false, true].last()).toBe(true)
        })
    })

    describe('remove()', () => {
        test('removes existing element and returns true', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = arr.remove(3)

            expect(result).toBe(true)
            expect(arr).toEqual([1, 2, 4, 5])
        })

        test('removes first occurrence of duplicate elements', () => {
            const arr = [1, 2, 3, 2, 4]
            const result = arr.remove(2)

            expect(result).toBe(true)
            expect(arr).toEqual([1, 3, 2, 4])
        })

        test('returns false when element not found', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = arr.remove(6)

            expect(result).toBe(false)
            expect(arr).toEqual([1, 2, 3, 4, 5])
        })

        test('works with different data types', () => {
            const strings = ['a', 'b', 'c']
            expect(strings.remove('b')).toBe(true)
            expect(strings).toEqual(['a', 'c'])

            const objects = [{ id: 1 }, { id: 2 }]
            const objToRemove = objects[0]
            expect(objects.remove(objToRemove)).toBe(true)
            expect(objects).toEqual([{ id: 2 }])
        })

        test('returns false for empty array', () => {
            const arr: number[] = []
            expect(arr.remove(1)).toBe(false)
            expect(arr).toEqual([])
        })
    })

    describe('shuffle()', () => {
        test('returns the same array instance', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = arr.shuffle()

            expect(result).toBe(arr)
        })

        test('maintains array length', () => {
            const arr = [1, 2, 3, 4, 5]
            const originalLength = arr.length

            arr.shuffle()

            expect(arr.length).toBe(originalLength)
        })

        test('contains same elements after shuffle', () => {
            const arr = [1, 2, 3, 4, 5]
            const originalElements = [...arr]

            arr.shuffle()

            expect(arr.sort()).toEqual(originalElements.sort())
        })

        test('handles empty array', () => {
            const arr: number[] = []
            const result = arr.shuffle()

            expect(result).toBe(arr)
            expect(arr).toEqual([])
        })

        test('handles single element array', () => {
            const arr = [42]
            const result = arr.shuffle()

            expect(result).toBe(arr)
            expect(arr).toEqual([42])
        })

        test('actually shuffles array (probabilistic test)', () => {
            const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            const original = [...arr]

            let hasChanged = false
            for (let i = 0; i < 10; i++) {
                arr.splice(0, arr.length, ...original)
                arr.shuffle()

                if (JSON.stringify(arr) !== JSON.stringify(original)) {
                    hasChanged = true
                    break
                }
            }

            expect(hasChanged).toBe(true)
        })
    })

    describe('toShuffled()', () => {
        test('returns new array instance', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = arr.toShuffled()

            expect(result).not.toBe(arr)
        })

        test('does not modify original array', () => {
            const arr = [1, 2, 3, 4, 5]
            const original = [...arr]

            arr.toShuffled()

            expect(arr).toEqual(original)
        })

        test('maintains array length', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = arr.toShuffled()

            expect(result.length).toBe(arr.length)
        })

        test('contains same elements as original', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = arr.toShuffled()

            expect(result.sort()).toEqual(arr.sort())
        })

        test('handles empty array', () => {
            const arr: number[] = []
            const result = arr.toShuffled()

            expect(result).not.toBe(arr)
            expect(result).toEqual([])
        })

        test('handles single element array', () => {
            const arr = [42]
            const result = arr.toShuffled()

            expect(result).not.toBe(arr)
            expect(result).toEqual([42])
        })

        test('actually shuffles array (probabilistic test)', () => {
            const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

            let hasChanged = false
            for (let i = 0; i < 10; i++) {
                const shuffled = arr.toShuffled()

                if (JSON.stringify(shuffled) !== JSON.stringify(arr)) {
                    hasChanged = true
                    break
                }
            }

            expect(hasChanged).toBe(true)
        })
    })

    describe('Array methods are non-enumerable', () => {
        test('last method is non-enumerable', () => {
            const arr = [1, 2, 3]
            const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'last')

            expect(descriptor?.enumerable).toBe(false)
            expect(Object.keys(arr)).not.toContain('last')
        })

        test('remove method is non-enumerable', () => {
            const arr = [1, 2, 3]
            const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'remove')

            expect(descriptor?.enumerable).toBe(false)
            expect(Object.keys(arr)).not.toContain('remove')
        })

        test('shuffle method is non-enumerable', () => {
            const arr = [1, 2, 3]
            const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'shuffle')

            expect(descriptor?.enumerable).toBe(false)
            expect(Object.keys(arr)).not.toContain('shuffle')
        })

        test('toShuffled method is non-enumerable', () => {
            const arr = [1, 2, 3]
            const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'toShuffled')

            expect(descriptor?.enumerable).toBe(false)
            expect(Object.keys(arr)).not.toContain('toShuffled')
        })
    })
})