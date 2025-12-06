import '@sky-modules/platform/node'
import { describe, test, expect } from 'vitest'
import {
    isUndefined,
    asUndefined,
    isNull,
    asNull,
    isNullish,
    asNullish,
    isBoolean,
    asBoolean,
    isNumber,
    asNumber,
    isBigInt,
    asBigInt,
    isSymbol,
    asSymbol,
    isString,
    asString,
    isTemplateStringsArray,
    asTemplateStringsArray,
    isArray,
    asArray,
    isObject,
    asObject,
    isFunction,
    asFunction,
} from '../type-guards'

describe('type-guards', () => {
    describe('isUndefined / asUndefined', () => {
        test('isUndefined returns true for undefined', () => {
            expect(isUndefined(undefined)).toBe(true)
        })

        test('isUndefined returns false for non-undefined values', () => {
            expect(isUndefined(null)).toBe(false)
            expect(isUndefined(0)).toBe(false)
            expect(isUndefined('')).toBe(false)
            expect(isUndefined(false)).toBe(false)
        })

        test('asUndefined passes for undefined', () => {
            expect(() => asUndefined(undefined)).not.toThrow()
        })

        test('asUndefined throws for non-undefined', () => {
            expect(() => asUndefined(null)).toThrow('not an undefined')
            expect(() => asUndefined(0)).toThrow('not an undefined')
        })
    })

    describe('isNull / asNull', () => {
        test('isNull returns true for null', () => {
            expect(isNull(null)).toBe(true)
        })

        test('isNull returns false for non-null values', () => {
            expect(isNull(undefined)).toBe(false)
            expect(isNull(0)).toBe(false)
            expect(isNull('')).toBe(false)
        })

        test('asNull passes for null', () => {
            expect(() => asNull(null)).not.toThrow()
        })

        test('asNull throws for non-null', () => {
            expect(() => asNull(undefined)).toThrow('not a null')
            expect(() => asNull(0)).toThrow('not a null')
        })
    })

    describe('isNullish / asNullish', () => {
        test('isNullish returns true for null and undefined', () => {
            expect(isNullish(null)).toBe(true)
            expect(isNullish(undefined)).toBe(true)
        })

        test('isNullish returns false for other values', () => {
            expect(isNullish(0)).toBe(false)
            expect(isNullish('')).toBe(false)
            expect(isNullish(false)).toBe(false)
        })

        test('asNullish passes for null and undefined', () => {
            expect(() => asNullish(null)).not.toThrow()
            expect(() => asNullish(undefined)).not.toThrow()
        })

        test('asNullish throws for non-nullish', () => {
            expect(() => asNullish(0)).toThrow('not a nullish')
            expect(() => asNullish('')).toThrow('not a nullish')
        })
    })

    describe('isBoolean / asBoolean', () => {
        test('isBoolean returns true for booleans', () => {
            expect(isBoolean(true)).toBe(true)
            expect(isBoolean(false)).toBe(true)
        })

        test('isBoolean returns false for non-booleans', () => {
            expect(isBoolean(1)).toBe(false)
            expect(isBoolean('true')).toBe(false)
            expect(isBoolean(null)).toBe(false)
        })

        test('asBoolean passes for booleans', () => {
            expect(() => asBoolean(true)).not.toThrow()
            expect(() => asBoolean(false)).not.toThrow()
        })

        test('asBoolean throws for non-booleans', () => {
            expect(() => asBoolean(1)).toThrow('not a boolean')
            expect(() => asBoolean('true')).toThrow('not a boolean')
        })
    })

    describe('isNumber / asNumber', () => {
        test('isNumber returns true for numbers', () => {
            expect(isNumber(0)).toBe(true)
            expect(isNumber(42)).toBe(true)
            expect(isNumber(-1.5)).toBe(true)
            expect(isNumber(NaN)).toBe(true)
            expect(isNumber(Infinity)).toBe(true)
        })

        test('isNumber returns false for non-numbers', () => {
            expect(isNumber('42')).toBe(false)
            expect(isNumber(true)).toBe(false)
            expect(isNumber(null)).toBe(false)
        })

        test('asNumber passes for numbers', () => {
            expect(() => asNumber(42)).not.toThrow()
            expect(() => asNumber(0)).not.toThrow()
        })

        test('asNumber throws for non-numbers', () => {
            expect(() => asNumber('42')).toThrow('not a number')
            expect(() => asNumber(true)).toThrow('not a number')
        })
    })

    describe('isBigInt / asBigInt', () => {
        test('isBigInt returns true for bigints', () => {
            expect(isBigInt(0n)).toBe(true)
            expect(isBigInt(42n)).toBe(true)
            expect(isBigInt(-100n)).toBe(true)
        })

        test('isBigInt returns false for non-bigints', () => {
            expect(isBigInt(42)).toBe(false)
            expect(isBigInt('42n')).toBe(false)
        })

        test('asBigInt passes for bigints', () => {
            expect(() => asBigInt(42n)).not.toThrow()
        })

        test('asBigInt throws for non-bigints', () => {
            expect(() => asBigInt(42)).toThrow('not a bigint')
        })
    })

    describe('isSymbol / asSymbol', () => {
        test('isSymbol returns true for symbols', () => {
            expect(isSymbol(Symbol())).toBe(true)
            expect(isSymbol(Symbol('test'))).toBe(true)
        })

        test('isSymbol returns false for non-symbols', () => {
            expect(isSymbol('symbol')).toBe(false)
            expect(isSymbol(null)).toBe(false)
        })

        test('asSymbol passes for symbols', () => {
            expect(() => asSymbol(Symbol())).not.toThrow()
        })

        test('asSymbol throws for non-symbols', () => {
            expect(() => asSymbol('symbol')).toThrow('not a symbol')
        })
    })

    describe('isString / asString', () => {
        test('isString returns true for strings', () => {
            expect(isString('')).toBe(true)
            expect(isString('hello')).toBe(true)
        })

        test('isString returns false for non-strings', () => {
            expect(isString(42)).toBe(false)
            expect(isString(null)).toBe(false)
        })

        test('asString passes for strings', () => {
            expect(() => asString('hello')).not.toThrow()
        })

        test('asString throws for non-strings', () => {
            expect(() => asString(42)).toThrow('not a string')
        })
    })

    describe('isTemplateStringsArray / asTemplateStringsArray', () => {
        test('isTemplateStringsArray returns true for template string arrays', () => {
            const tpl = (strings: TemplateStringsArray, ...values: any[]) => {
                expect(isTemplateStringsArray(strings)).toBe(true)
            }
            tpl`test ${42}`
        })

        test('isTemplateStringsArray returns false for regular arrays', () => {
            expect(isTemplateStringsArray(['a', 'b'])).toBe(false)
            expect(isTemplateStringsArray([])).toBe(false)
        })

        test('asTemplateStringsArray passes for template string arrays', () => {
            const tpl = (strings: TemplateStringsArray, ...values: any[]) => {
                expect(() => asTemplateStringsArray(strings)).not.toThrow()
            }
            tpl`test ${42}`
        })

        test('asTemplateStringsArray throws for non-template arrays', () => {
            expect(() => asTemplateStringsArray(['a', 'b'])).toThrow(
                'not a template string array'
            )
        })
    })

    describe('isArray / asArray', () => {
        test('isArray returns true for arrays', () => {
            expect(isArray([])).toBe(true)
            expect(isArray([1, 2, 3])).toBe(true)
        })

        test('isArray returns false for non-arrays', () => {
            expect(isArray('array')).toBe(false)
            expect(isArray({ length: 0 })).toBe(false)
            expect(isArray(null)).toBe(false)
        })

        test('asArray passes for arrays', () => {
            expect(() => asArray([])).not.toThrow()
            expect(() => asArray([1, 2])).not.toThrow()
        })

        test('asArray throws for non-arrays', () => {
            expect(() => asArray('array')).toThrow('not an array')
        })
    })

    describe('isObject / asObject', () => {
        test('isObject returns true for objects', () => {
            expect(isObject({})).toBe(true)
            expect(isObject({ a: 1 })).toBe(true)
            expect(isObject(new Date())).toBe(true)
        })

        test('isObject returns false for arrays and null', () => {
            expect(isObject([])).toBe(false)
            expect(isObject(null)).toBe(false)
            expect(isObject('object')).toBe(false)
            expect(isObject(42)).toBe(false)
        })

        test('asObject passes for objects', () => {
            expect(() => asObject({})).not.toThrow()
            expect(() => asObject({ a: 1 })).not.toThrow()
        })

        test('asObject throws for non-objects', () => {
            expect(() => asObject([])).toThrow('not an object')
            expect(() => asObject(null)).toThrow('not an object')
        })
    })

    describe('isFunction / asFunction', () => {
        test('isFunction returns true for functions', () => {
            expect(isFunction(() => {})).toBe(true)
            expect(isFunction(function () {})).toBe(true)
            expect(isFunction(class {})).toBe(true)
        })

        test('isFunction returns false for non-functions', () => {
            expect(isFunction(null)).toBe(false)
            expect(isFunction({})).toBe(false)
            expect(isFunction('function')).toBe(false)
        })

        test('asFunction passes for functions', () => {
            expect(() => asFunction(() => {})).not.toThrow()
            expect(() => asFunction(function () {})).not.toThrow()
        })

        test('asFunction throws for non-functions', () => {
            expect(() => asFunction('function')).toThrow('not a function')
            expect(() => asFunction(null)).toThrow('not a function')
        })
    })

    describe('type narrowing with TypeScript', () => {
        test('isString narrows type correctly', () => {
            const value: unknown = 'hello'
            if (isString(value)) {
                // TypeScript should recognize value as string here
                expect(value.toUpperCase()).toBe('HELLO')
            }
        })

        test('isNumber narrows type correctly', () => {
            const value: unknown = 42
            if (isNumber(value)) {
                // TypeScript should recognize value as number here
                expect(value.toFixed(2)).toBe('42.00')
            }
        })

        test('isArray narrows type correctly', () => {
            const value: unknown = [1, 2, 3]
            if (isArray(value)) {
                // TypeScript should recognize value as array here
                expect(value.length).toBe(3)
            }
        })
    })
})
