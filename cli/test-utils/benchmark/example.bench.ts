/**
 * Example benchmark tests
 *
 * This is a reference implementation showing how to write benchmark tests
 * for performance-critical code using the benchmark utilities.
 *
 * To run benchmarks: vitest bench cli/test-utils/benchmark
 */

import { describe } from 'vitest'
import {
    benchmarkCompare,
    benchmarkArraySizes,
    createBenchmarkData,
    benchmarkFunction,
} from './helpers'

describe('Array Operations Benchmark Examples', () => {
    // Example 1: Compare different implementations
    benchmarkCompare('Array push vs spread', {
        'push method': () => {
            const arr: number[] = []
            for (let i = 0; i < 1000; i++) {
                arr.push(i)
            }
        },
        'spread operator': () => {
            let arr: number[] = []
            for (let i = 0; i < 1000; i++) {
                arr = [...arr, i]
            }
        },
        'concat method': () => {
            let arr: number[] = []
            for (let i = 0; i < 1000; i++) {
                arr = arr.concat(i)
            }
        },
    })

    // Example 2: Benchmark different array sizes
    benchmarkArraySizes(
        'Array map operation',
        data => {
            data.map(x => x * 2)
        },
        i => i,
        [100, 1000, 10000]
    )

    // Example 3: Benchmark a single function
    benchmarkFunction('Array filter and map chain', () => {
        const data = Array.from({ length: 1000 }, (_, i) => i)
        data.filter(x => x % 2 === 0).map(x => x * 2)
    })

    // Example 4: Compare for loop vs forEach
    const testData = createBenchmarkData(i => i, 10000)

    benchmarkCompare('Iteration methods', {
        'for loop': () => {
            let sum = 0
            for (let i = 0; i < testData.length; i++) {
                sum += testData[i]
            }
        },
        forEach: () => {
            let sum = 0
            testData.forEach(x => {
                sum += x
            })
        },
        'for...of': () => {
            let sum = 0
            for (const x of testData) {
                sum += x
            }
        },
        reduce: () => {
            testData.reduce((sum, x) => sum + x, 0)
        },
    })
})

describe('String Operations Benchmark Examples', () => {
    const longString = 'x'.repeat(10000)

    benchmarkCompare('String concatenation', {
        'plus operator': () => {
            let result = ''
            for (let i = 0; i < 100; i++) {
                result = result + 'x'
            }
        },
        'template literals': () => {
            let result = ''
            for (let i = 0; i < 100; i++) {
                result = `${result}x`
            }
        },
        'array join': () => {
            const arr = []
            for (let i = 0; i < 100; i++) {
                arr.push('x')
            }
            arr.join('')
        },
    })

    benchmarkFunction('String replace vs replaceAll', () => {
        longString.replace(/x/g, 'y')
    })
})

describe('Object Operations Benchmark Examples', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }

    benchmarkCompare('Object clone methods', {
        'spread operator': () => {
            const clone = { ...obj }
        },
        'Object.assign': () => {
            const clone = Object.assign({}, obj)
        },
        JSON: () => {
            const clone = JSON.parse(JSON.stringify(obj))
        },
    })

    benchmarkCompare('Object key iteration', {
        'Object.keys': () => {
            Object.keys(obj).forEach(key => {
                const value = obj[key as keyof typeof obj]
            })
        },
        'Object.entries': () => {
            Object.entries(obj).forEach(([key, value]) => {
                // Access key and value
            })
        },
        'for...in': () => {
            for (const key in obj) {
                const value = obj[key as keyof typeof obj]
            }
        },
    })
})
