import { vi } from 'vitest'

/**
 * Wait for a specific amount of time
 * Useful for testing async operations and timeouts
 */
export async function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wait for a condition to become true
 * @param condition Function that returns true when condition is met
 * @param timeout Maximum time to wait in milliseconds
 * @param interval How often to check the condition in milliseconds
 */
export async function waitFor(
    condition: () => boolean | Promise<boolean>,
    timeout = 5000,
    interval = 50
): Promise<void> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
        if (await condition()) {
            return
        }
        await wait(interval)
    }

    throw new Error(`Timeout waiting for condition after ${timeout}ms`)
}

/**
 * Create a spy function that can be used to track calls
 * This is a thin wrapper around vi.fn() for consistency
 */
export function createSpy<T extends (...args: any[]) => any>(
    implementation?: T
): ReturnType<typeof vi.fn<T>> {
    return vi.fn(implementation)
}

/**
 * Mock console methods to suppress output during tests
 * Returns cleanup function to restore original console methods
 */
export function mockConsole(): () => void {
    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error
    const originalInfo = console.info

    console.log = vi.fn()
    console.warn = vi.fn()
    console.error = vi.fn()
    console.info = vi.fn()

    return () => {
        console.log = originalLog
        console.warn = originalWarn
        console.error = originalError
        console.info = originalInfo
    }
}

/**
 * Create a deferred promise that can be resolved/rejected externally
 */
export function createDeferred<T = void>() {
    let resolve: (value: T | PromiseLike<T>) => void
    let reject: (reason?: any) => void

    const promise = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })

    return {
        promise,
        resolve: resolve!,
        reject: reject!,
    }
}

/**
 * Flush all pending promises
 * Useful for testing code that uses Promise.resolve() or nextTick-like behavior
 */
export async function flushPromises(): Promise<void> {
    return new Promise(resolve => setImmediate(resolve))
}

/**
 * Run a function and expect it to throw
 * Returns the error that was thrown
 */
export async function expectToThrow<E = Error>(
    fn: () => void | Promise<void>
): Promise<E> {
    try {
        await fn()
        throw new Error('Expected function to throw, but it did not')
    } catch (error) {
        return error as E
    }
}

/**
 * Create a mock implementation that returns different values on successive calls
 */
export function createSequentialMock<T>(...values: T[]) {
    let index = 0
    return vi.fn(() => {
        if (index >= values.length) {
            throw new Error(`Sequential mock exhausted (called ${index + 1} times, only ${values.length} values provided)`)
        }
        return values[index++]
    })
}
