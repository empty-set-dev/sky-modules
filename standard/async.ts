import globalify from 'sky/utilities/globalify'

declare global {
    function async<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T> | void,
        ...args: A
    ): void
    type AsyncSlot<R = void> = Promise<R>
    function run_async_slot<A extends unknown[], T>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<T>
    function async_slot<T, R>(object: T, key?: keyof T): Promise<void | R>
}

namespace lib {
    export async function async<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<void | T> {
        try {
            return await callback(...args)
        } catch (error: unknown) {
            if (global.onAsyncError != null) {
                await onAsyncError(error)
            } else {
                throw error
            }
        }
    }
    export async function run_async_slot<A extends unknown[], T>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<T> {
        return async(callback, ...args) as Promise<T>
    }
}

globalify(lib)
