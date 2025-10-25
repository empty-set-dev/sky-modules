import { bench, describe } from 'vitest'

/**
 * Options for benchmark comparison
 */
export interface BenchmarkCompareOptions {
    /**
     * Number of iterations to run
     */
    iterations?: number

    /**
     * Time to run the benchmark in milliseconds
     */
    time?: number

    /**
     * Warmup iterations before actual measurement
     */
    warmup?: number
}

/**
 * Result of a benchmark run
 */
export interface BenchmarkResult {
    name: string
    ops: number // Operations per second
    mean: number // Mean execution time in ms
    samples: number
}

/**
 * Compare multiple implementations of the same functionality
 */
export function benchmarkCompare(
    name: string,
    implementations: Record<string, () => void | Promise<void>>,
    options?: BenchmarkCompareOptions
): void {
    describe(name, () => {
        for (const [implName, impl] of Object.entries(implementations)) {
            bench(
                implName,
                impl,
                options
                    ? {
                          iterations: options.iterations,
                          time: options.time,
                          warmupIterations: options.warmup,
                      }
                    : undefined
            )
        }
    })
}

/**
 * Benchmark a single function
 */
export function benchmarkFunction(
    name: string,
    fn: () => void | Promise<void>,
    options?: BenchmarkCompareOptions
): void {
    bench(
        name,
        fn,
        options
            ? {
                  iterations: options.iterations,
                  time: options.time,
                  warmupIterations: options.warmup,
              }
            : undefined
    )
}

/**
 * Create test data for benchmarks
 */
export function createBenchmarkData<T>(
    generator: (index: number) => T,
    count: number
): T[] {
    return Array.from({ length: count }, (_, i) => generator(i))
}

/**
 * Benchmark different array sizes
 */
export function benchmarkArraySizes<T>(
    name: string,
    operation: (data: T[]) => void,
    dataGenerator: (index: number) => T,
    sizes: number[] = [10, 100, 1000, 10000]
): void {
    describe(name, () => {
        for (const size of sizes) {
            const data = createBenchmarkData(dataGenerator, size)
            bench(`${name} (size: ${size})`, () => {
                operation(data)
            })
        }
    })
}

/**
 * Measure execution time of a function
 */
export async function measureExecutionTime(
    fn: () => void | Promise<void>
): Promise<number> {
    const start = performance.now()
    await fn()
    const end = performance.now()
    return end - start
}

/**
 * Run a function multiple times and get average execution time
 */
export async function averageExecutionTime(
    fn: () => void | Promise<void>,
    iterations: number = 100
): Promise<{
    average: number
    min: number
    max: number
    samples: number[]
}> {
    const samples: number[] = []

    for (let i = 0; i < iterations; i++) {
        const time = await measureExecutionTime(fn)
        samples.push(time)
    }

    const average = samples.reduce((sum, time) => sum + time, 0) / samples.length
    const min = Math.min(...samples)
    const max = Math.max(...samples)

    return { average, min, max, samples }
}

/**
 * Compare performance of two functions
 * Returns percentage difference (positive means fn1 is faster)
 */
export async function comparePerformance(
    fn1: () => void | Promise<void>,
    fn2: () => void | Promise<void>,
    iterations: number = 100
): Promise<{
    fn1Time: number
    fn2Time: number
    percentageDiff: number
    faster: 'fn1' | 'fn2'
}> {
    const result1 = await averageExecutionTime(fn1, iterations)
    const result2 = await averageExecutionTime(fn2, iterations)

    const percentageDiff = ((result2.average - result1.average) / result1.average) * 100
    const faster = result1.average < result2.average ? 'fn1' : 'fn2'

    return {
        fn1Time: result1.average,
        fn2Time: result2.average,
        percentageDiff: Math.abs(percentageDiff),
        faster,
    }
}
