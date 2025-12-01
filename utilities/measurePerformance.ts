import Console from '@sky-modules/core/Console'

/**
 * Measures and compares the performance of multiple code variations.
 *
 * Runs multiple variations of code multiple times across multiple cycles,
 * providing average execution times for comparison. Useful for benchmarking
 * different implementation approaches.
 *
 * @param times Number of iterations to run each variation per cycle
 * @param cyclesCount Number of cycles to repeat the measurement
 * @param variations Array of [name, callback] tuples representing code to measure
 *
 * @example Comparing array operations
 * ```typescript
 * import measurePerformance from '@sky-modules/utilities/measurePerformance'
 *
 * const data = Array.from({ length: 1000 }, (_, i) => i)
 *
 * measurePerformance(1000, 5, [
 *   ['Array.push', () => {
 *     const arr: number[] = []
 *     data.forEach(x => arr.push(x))
 *   }],
 *   ['Spread operator', () => {
 *     const arr = [...data]
 *   }],
 *   ['Array.from', () => {
 *     const arr = Array.from(data)
 *   }]
 * ])
 * // Output:
 * // Cycle 1
 * // Array.push
 * // 45ms
 * // Spread operator
 * // 12ms
 * // Array.from
 * // 15ms
 * // ...
 * // Array.push: 43ms
 * // Spread operator: 11ms
 * // Array.from: 14ms
 * ```
 *
 * @example Testing string concatenation
 * ```typescript
 * const parts = ['a', 'b', 'c', 'd', 'e']
 *
 * measurePerformance(10000, 3, [
 *   ['+ operator', () => {
 *     let str = ''
 *     parts.forEach(p => str += p)
 *   }],
 *   ['Array.join', () => {
 *     const str = parts.join('')
 *   }],
 *   ['Template literal', () => {
 *     const str = `${parts[0]}${parts[1]}${parts[2]}${parts[3]}${parts[4]}`
 *   }]
 * ])
 * ```
 */
export default function measurePerformance(
    times: number,
    cyclesCount: number,
    variations: [name: string, callback: (iteration: number) => void][]
): void {
    const results: number[] = []
    repeat(cyclesCount, i => {
        Console.log(`Cycle ${i + 1}`)
        variations.forEach((variation, j) => {
            Console.log(variation[0])

            results[j] ??= 0
            const [, callback] = variation
            const time = Date.now()

            for (let k = 0; k < times; ++k) {
                callback(k + 1)
            }

            const deltaTime = Date.now() - time
            results[j] += deltaTime
            Console.log(`${deltaTime}ms\n`)
        })
    })
    results.forEach((result, i) =>
        Console.log(`${variations[i][0]}: ${Math.floor(result / cyclesCount)}ms`)
    )
}
