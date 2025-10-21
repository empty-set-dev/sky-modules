import { describe, it, expect, beforeEach } from 'vitest'
import './transform'

describe('transform', () => {
    describe('defineTransform', () => {
        it('should define custom transform', () => {
            defineTransform('uppercase',
                (value: string) => value.toUpperCase(),
                (value: string) => value.toLowerCase()
            )

            expect(to.uppercase).toBeDefined()
            expect(from.uppercase).toBeDefined()
        })

        it('should transform value with custom transformer', () => {
            defineTransform('double',
                (value: number) => value * 2,
                (value: number) => value / 2
            )

            const result = to.double(5)
            expect(result).toBe(10)
        })

        it('should untransform value with custom transformer', () => {
            defineTransform('triple',
                (value: number) => value * 3,
                (value: number) => value / 3
            )

            const result = from.triple(15)
            expect(result).toBe(5)
        })
    })

    describe('built-in transforms', () => {
        describe('json', () => {
            it('should transform object to JSON string', () => {
                const obj = { name: 'Anna', age: 25 }
                const result = to.json(obj)

                expect(typeof result).toBe('string')
                expect(JSON.parse(result)).toEqual(obj)
            })

            it('should untransform JSON string to object', () => {
                const json = '{"name":"Anna","age":25}'
                const result = from.json(json)

                expect(result).toEqual({ name: 'Anna', age: 25 })
            })

            it('should handle arrays', () => {
                const arr = [1, 2, 3, 4, 5]
                const json = to.json(arr)
                const restored = from.json(json)

                expect(restored).toEqual(arr)
            })

            it('should handle nested objects', () => {
                const nested = {
                    user: {
                        name: 'Anna',
                        address: {
                            city: 'Moscow'
                        }
                    }
                }
                const json = to.json(nested)
                const restored = from.json(json)

                expect(restored).toEqual(nested)
            })

            it('should handle null and undefined', () => {
                expect(to.json(null)).toBe('null')
                expect(to.json(undefined)).toBe(undefined)
                expect(from.json('null')).toBe(null)
            })
        })

        describe('base64', () => {
            it('should encode string to base64', () => {
                const result = to.base64('Hello, World!')
                expect(result).toBe(btoa('Hello, World!'))
            })

            it('should decode base64 to string', () => {
                const encoded = btoa('Hello, World!')
                const result = from.base64(encoded)
                expect(result).toBe('Hello, World!')
            })

            it('should handle empty string', () => {
                const encoded = to.base64('')
                const decoded = from.base64(encoded)
                expect(decoded).toBe('')
            })

            it('should handle special characters', () => {
                const text = 'Привет! 你好! 🎉'
                const encoded = to.base64(text)
                const decoded = from.base64(encoded)
                expect(decoded).toBe(text)
            })
        })
    })

    describe('chaining transforms', () => {
        it('should chain multiple transforms', () => {
            const obj = { message: 'Hello' }

            const result = transform.json.base64.transform(obj)

            expect(typeof result).toBe('string')
            expect(result).toBe(btoa(JSON.stringify(obj)))
        })

        it('should untransform chained transforms in reverse order', () => {
            const obj = { message: 'Hello' }

            const transformed = transform.json.base64.transform(obj)
            const restored = transform.json.base64.untransform(transformed)

            expect(restored).toEqual(obj)
        })

        it('should handle complex chains', () => {
            defineTransform('prefix',
                (value: string) => `PREFIX_${value}`,
                (value: string) => value.replace(/^PREFIX_/, '')
            )

            const text = 'test'
            const transformed = transform.base64.prefix.transform(text)
            const restored = transform.base64.prefix.untransform(transformed)

            expect(restored).toBe(text)
        })

        it('should create new chain instance for each use', () => {
            const chain1 = transform.json.base64
            const chain2 = transform.json

            expect(chain1).not.toBe(chain2)
            expect(chain1.transformers).toHaveLength(2)
            expect(chain2.transformers).toHaveLength(1)
        })
    })

    describe('roundtrip tests', () => {
        it('should roundtrip simple values', () => {
            const values = [
                { name: 'Anna' },
                [1, 2, 3],
                'Hello',
                42,
                true,
                null
            ]

            values.forEach(value => {
                const json = to.json(value)
                const restored = from.json(json)
                expect(restored).toEqual(value)
            })
        })

        it('should roundtrip with json.base64 chain', () => {
            const testData = [
                { user: 'Anna', score: 100 },
                { items: ['a', 'b', 'c'] },
                { nested: { deep: { value: 42 } } }
            ]

            testData.forEach(data => {
                const transformed = transform.json.base64.transform(data)
                const restored = transform.json.base64.untransform(transformed)
                expect(restored).toEqual(data)
            })
        })
    })

    describe('error handling', () => {
        it('should throw on invalid JSON', () => {
            expect(() => from.json('invalid json')).toThrow()
        })

        it('should throw on invalid base64', () => {
            expect(() => from.base64('!!!')).toThrow()
        })
    })

    describe('edge cases', () => {
        it('should handle empty objects', () => {
            const empty = {}
            const json = to.json(empty)
            const restored = from.json(json)
            expect(restored).toEqual(empty)
        })

        it('should handle empty arrays', () => {
            const empty: never[] = []
            const json = to.json(empty)
            const restored = from.json(json)
            expect(restored).toEqual(empty)
        })

        it('should handle large objects', () => {
            const large = { data: Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item-${i}` })) }
            const json = to.json(large)
            const restored = from.json(json)
            expect(restored).toEqual(large)
        })

        it('should handle unicode strings', () => {
            const unicode = '🎉 Привет 你好 مرحبا'
            const encoded = to.base64(unicode)
            const decoded = from.base64(encoded)
            expect(decoded).toBe(unicode)
        })
    })
})
