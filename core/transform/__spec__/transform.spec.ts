import { describe, it, expect, beforeEach } from 'vitest'
import '../global'

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

    describe('url transformer', () => {
        it('should encode URL components', () => {
            const text = 'Hello World!'
            const encoded = to.url(text)
            expect(encoded).toBe('Hello%20World!')
        })

        it('should decode URL components', () => {
            const encoded = 'Hello%20World!'
            const decoded = from.url(encoded)
            expect(decoded).toBe('Hello World!')
        })

        it('should handle special URL characters', () => {
            const text = 'key=value&foo=bar?test=123'
            const encoded = to.url(text)
            const decoded = from.url(encoded)
            expect(decoded).toBe(text)
        })

        it('should roundtrip URL encoding', () => {
            const text = 'Привет мир! 🌍'
            const encoded = to.url(text)
            const decoded = from.url(encoded)
            expect(decoded).toBe(text)
        })
    })

    describe('hex transformer', () => {
        it('should encode to hexadecimal', () => {
            const text = 'Hi'
            const hex = to.hex(text)
            expect(hex).toBe('4869')
        })

        it('should decode from hexadecimal', () => {
            const hex = '4869'
            const text = from.hex(hex)
            expect(text).toBe('Hi')
        })

        it('should roundtrip hex encoding', () => {
            const text = 'Test 123!'
            const hex = to.hex(text)
            const decoded = from.hex(hex)
            expect(decoded).toBe(text)
        })

        it('should handle empty string', () => {
            const hex = to.hex('')
            expect(hex).toBe('')
            expect(from.hex(hex)).toBe('')
        })
    })

    describe('base64url transformer', () => {
        it('should encode to URL-safe base64', () => {
            const text = 'Hello World!'
            const encoded = to.base64url(text)
            expect(encoded).not.toContain('+')
            expect(encoded).not.toContain('/')
            expect(encoded).not.toContain('=')
        })

        it('should decode from URL-safe base64', () => {
            const text = 'Hello World!'
            const encoded = to.base64url(text)
            const decoded = from.base64url(encoded)
            expect(decoded).toBe(text)
        })

        it('should roundtrip base64url encoding', () => {
            const text = 'Test with special chars: +/='
            const encoded = to.base64url(text)
            const decoded = from.base64url(encoded)
            expect(decoded).toBe(text)
        })

        it('should handle Unicode', () => {
            const text = '🎉 Привет!'
            const encoded = to.base64url(text)
            const decoded = from.base64url(encoded)
            expect(decoded).toBe(text)
        })
    })

    describe('binary transformer', () => {
        it('should encode to binary', () => {
            const text = 'A'
            const binary = to.binary(text)
            expect(binary).toBe('01000001')
        })

        it('should decode from binary', () => {
            const binary = '01000001'
            const text = from.binary(binary)
            expect(text).toBe('A')
        })

        it('should roundtrip binary encoding', () => {
            const text = 'Hi!'
            const binary = to.binary(text)
            const decoded = from.binary(binary)
            expect(decoded).toBe(text)
        })

        it('should handle multiple characters', () => {
            const text = 'ABC'
            const binary = to.binary(text)
            expect(binary).toBe('010000010100001001000011')
        })
    })

    describe('case transformers', () => {
        describe('lower', () => {
            it('should convert to lowercase', () => {
                const text = 'HELLO WORLD'
                const lower = to.lower(text)
                expect(lower).toBe('hello world')
            })

            it('should handle mixed case', () => {
                const text = 'HeLLo WoRLd'
                const lower = to.lower(text)
                expect(lower).toBe('hello world')
            })

            it('should handle already lowercase', () => {
                const text = 'hello'
                const lower = to.lower(text)
                expect(lower).toBe('hello')
            })
        })

        describe('upper', () => {
            it('should convert to uppercase', () => {
                const text = 'hello world'
                const upper = to.upper(text)
                expect(upper).toBe('HELLO WORLD')
            })

            it('should handle mixed case', () => {
                const text = 'HeLLo WoRLd'
                const upper = to.upper(text)
                expect(upper).toBe('HELLO WORLD')
            })

            it('should handle already uppercase', () => {
                const text = 'HELLO'
                const upper = to.upper(text)
                expect(upper).toBe('HELLO')
            })
        })
    })

    describe('reverse transformer', () => {
        it('should reverse string', () => {
            const text = 'Hello'
            const reversed = to.reverse(text)
            expect(reversed).toBe('olleH')
        })

        it('should reverse back to original', () => {
            const text = 'Test'
            const reversed = to.reverse(text)
            const restored = from.reverse(reversed)
            expect(restored).toBe(text)
        })

        it('should handle palindromes', () => {
            const text = 'racecar'
            const reversed = to.reverse(text)
            expect(reversed).toBe('racecar')
        })

        it('should handle empty string', () => {
            const reversed = to.reverse('')
            expect(reversed).toBe('')
        })
    })

    describe('complex chains with new transformers', () => {
        it('should chain url and base64', () => {
            const text = 'Hello World!'
            const transformed = transform.url.base64.transform(text)
            const restored = transform.url.base64.untransform(transformed)
            expect(restored).toBe(text)
        })

        it('should chain hex and reverse', () => {
            const text = 'Test'
            const transformed = transform.hex.reverse.transform(text)
            const restored = transform.hex.reverse.untransform(transformed)
            expect(restored).toBe(text)
        })

        it('should chain json and base64url', () => {
            const obj = { message: 'hello' }
            const transformed = transform.json.base64url.transform(obj)
            const restored = transform.json.base64url.untransform(transformed)
            expect(restored).toEqual(obj)
        })

        it('should chain multiple reversible transformers', () => {
            const text = 'Test'
            const transformed = transform.reverse.hex.base64.transform(text)
            const restored = transform.reverse.hex.base64.untransform(transformed)
            expect(restored).toBe(text)
        })

        it('should handle case transformers correctly (non-reversible)', () => {
            const text = 'HELLO'
            const lower = to.lower(text)
            expect(lower).toBe('hello')

            const upper = to.upper('world')
            expect(upper).toBe('WORLD')
        })
    })
})
