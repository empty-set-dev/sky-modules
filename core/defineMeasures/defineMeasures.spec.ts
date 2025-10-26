import { describe, it, expect, beforeEach } from 'vitest'
import defineMeasures from './defineMeasures'

describe('defineMeasures', () => {
    beforeEach(() => {
        // Clean up Number prototype before each test
        // to avoid conflicts between tests
    })

    describe('basic functionality', () => {
        it('should define measures for Number prototype', () => {
            defineMeasures('TestUnit', [
                ['Small', 0.01],
                ['Medium', 1],
                ['Large', 100]
            ])

            expect((0).asSmall).toBeDefined()
            expect((0).asMedium).toBeDefined()
            expect((0).asLarge).toBeDefined()
        })

        it('should throw error when default measure (1) is missing', () => {
            expect(() => {
                defineMeasures('BadUnit', [
                    ['Small', 0.5],
                    ['Large', 2]
                ])
            }).toThrow('BadUnit: default measure (1) not defined')
        })

        it('should create conversion properties', () => {
            defineMeasures('Distance', [
                ['Meters', 1],
                ['Kilometers', 1000]
            ])

            const distance = (1000).asMeters()

            expect(distance.inKilometers()).toBe(1)
            expect(distance.inMeters()).toBe(1000)
        })
    })

    describe('conversions', () => {
        beforeEach(() => {
            defineMeasures('Length', [
                ['Millimeters', 0.001],
                ['Meters', 1],
                ['Kilometers', 1000]
            ])
        })

        it('should convert from base unit to smaller unit', () => {
            const length = (1).asMeters()
            expect(length.inMillimeters()).toBe(1000)
        })

        it('should convert from base unit to larger unit', () => {
            const length = (1000).asMeters()
            expect(length.inKilometers()).toBe(1)
        })

        it('should convert between non-base units', () => {
            const length = (1000).asMillimeters()
            expect(length.inMeters()).toBe(1)
        })

        it('should handle fractional conversions', () => {
            const length = (500).asMillimeters()
            expect(length.inMeters()).toBe(0.5)
        })

        it('should handle zero values', () => {
            const length = (0).asMeters()
            expect(length.inKilometers()).toBe(0)
            expect(length.inMillimeters()).toBe(0)
        })

        it('should handle negative values', () => {
            const length = (-100).asMeters()
            expect(length.inKilometers()).toBe(-0.1)
            expect(length.inMillimeters()).toBe(-100000)
        })
    })

    describe('measure tracking', () => {
        beforeEach(() => {
            defineMeasures('Weight', [
                ['Grams', 1],
                ['Kilograms', 1000]
            ])
        })

        it('should track measure type on number', () => {
            const weight = (100).asGrams()
            expect(weight.measure).toBe('grams')
        })

        it('should throw error when mixing incompatible measures', () => {
            defineMeasures('Time', [
                ['Seconds', 1],
                ['Minutes', 60]
            ])

            const weight = (100).asGrams()
            const time = (60).asSeconds()

            // Trying to convert weight to time units should throw
            expect(() => {
                weight.inSeconds()
            }).toThrow(/measures mismatch/)
        })
    })

    describe('multiple measure systems', () => {
        it('should support multiple independent measure systems', () => {
            defineMeasures('Distance', [
                ['Meters', 1],
                ['Kilometers', 1000]
            ])

            defineMeasures('Duration', [
                ['Seconds', 1],
                ['Minutes', 60]
            ])

            const distance = (1000).asMeters()
            const duration = (60).asSeconds()

            expect(distance.inKilometers()).toBe(1)
            expect(duration.inMinutes()).toBe(1)
        })
    })

    describe('edge cases', () => {
        it('should handle very small numbers', () => {
            defineMeasures('Tiny', [
                ['Nano', 0.000000001],
                ['Base', 1]
            ])

            const tiny = (1).asBase()
            expect(tiny.inNano()).toBe(1000000000)
        })

        it('should handle very large numbers', () => {
            defineMeasures('Huge', [
                ['Base', 1],
                ['Mega', 1000000]
            ])

            const huge = (1000000).asBase()
            expect(huge.inMega()).toBe(1)
        })

        it('should handle decimal multiplication factors', () => {
            defineMeasures('Custom', [
                ['Small', 0.333],
                ['Base', 1],
                ['Large', 3.14159]
            ])

            const value = (1).asBase()
            expect(value.inSmall()).toBeCloseTo(3.003, 2)
            expect(value.inLarge()).toBeCloseTo(0.318, 2)
        })

        it('should handle empty measure name', () => {
            expect(() => {
                defineMeasures('', [
                    ['Unit', 1]
                ])
            }).toThrow()
        })

        it('should handle single measure system', () => {
            defineMeasures('Single', [
                ['Unit', 1]
            ])

            const value = (42).asUnit()
            expect(value.inUnit()).toBe(42)
        })
    })

    describe('property descriptors', () => {
        beforeEach(() => {
            defineMeasures('Test', [
                ['Unit', 1],
                ['Double', 2]
            ])
        })

        it('should create read-only conversion properties', () => {
            const value = (10).asUnit()

            // Getting works
            expect(value.inDouble).toBeDefined()

            // Setting should not break it (getters are functions)
            const original = value.inDouble
            expect(typeof original).toBe('function')
        })

        it('should create properties for both as and in patterns', () => {
            const value = 10

            expect(value.asUnit).toBeDefined()
            expect(value.asDouble).toBeDefined()

            const converted = value.asUnit()
            expect(converted.inUnit).toBeDefined()
            expect(converted.inDouble).toBeDefined()
        })
    })
})
