import { runsOnClientSide } from '@sky-modules/platform'

import Callback, { invokeCallback } from '#/Callback'
import define from '#/define/define'
import RuntimeInternal from '#/runtime/Internal'
import isRuntime from '#/runtime/isRuntime'

define('sky.core.fire', fire)
/**
 * Execute async function without waiting, with error handling
 *
 * Fire-and-forget execution pattern that:
 * - Executes the callback immediately
 * - Doesn't block the calling code
 * - Catches and handles errors automatically
 * - Useful for side effects that don't need to block execution
 *
 * @example
 * ```typescript
 * // Fire async operation without waiting
 * fire(async () => {
 *   await logAnalytics()
 *   await sendNotification()
 * })
 *
 * // With arguments
 * fire(async (userId, data) => {
 *   await saveUserData(userId, data)
 * }, '123', { name: 'John' })
 * ```
 *
 * @template A - Callback argument types
 * @template R - Return type
 * @param callback - Async function to execute
 * @param args - Arguments to pass to callback
 * @returns Promise that resolves when complete or catches errors
 */
export function fire<A extends unknown[], R>(
    callback: Callback<A, Promise<R>>,
    ...args: A
): PromiseLike<void | R> {
    return invokeCallback(callback, ...args).catch((error: unknown) => {
        return handleAsyncError(error)
    })
}

define('sky.core.task', task)
/**
 * Execute async function and track it before runtime
 *
 * Tasks are tracked during initialization phase to ensure:
 * - All async operations complete before runtime
 * - Proper initialization order
 * - No race conditions during startup
 *
 * @example
 * ```typescript
 * // During initialization
 * await task(async () => {
 *   await loadConfig()
 *   await initializeDatabase()
 * })
 *
 * // With arguments
 * await task(async (moduleName) => {
 *   await loadModule(moduleName)
 * }, 'auth')
 * ```
 *
 * @template A - Callback argument types
 * @template R - Return type
 * @param callback - Async function to execute
 * @param args - Arguments to pass to callback
 * @returns Promise resolving to callback result
 */
export async function task<A extends unknown[], R>(
    callback: Callback<A, Promise<R>>,
    ...args: A
): Promise<R> {
    const promise = invokeCallback(callback, ...args)

    // Track promise before runtime
    if (!isRuntime()) {
        RuntimeInternal.pendingTasks.add(promise)
        await promise.finally(() => RuntimeInternal.pendingTasks.delete(promise))
    }

    return promise
}

define('sky.core.handleAsyncError', handleAsyncError)
/**
 * Handle async errors appropriately for the runtime environment
 *
 * On client-side: Throws error in next tick to preserve stack trace
 * On server-side: Throws error immediately
 *
 * @example
 * ```typescript
 * try {
 *   await someAsyncOperation()
 * } catch (error) {
 *   handleAsyncError(error)
 * }
 * ```
 *
 * @param error - Error to handle
 */
export function handleAsyncError(error: unknown): void {
    if (runsOnClientSide) {
        setTimeout(() => {
            throw error
        })
    } else {
        throw error
    }
}
