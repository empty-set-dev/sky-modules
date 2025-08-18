import globalify from 'sky/utilities/globalify'

declare global {
    function async<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T> | void,
        ...args: A
    ): void
    function async_slot<T>(promise: undefined | null | Promise<T>): Promise<void | T>
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
    export function async_slot<T>(promise: undefined | null | Promise<T>): Promise<void | T> {
        return promise ?? Promise.resolve()
    }
}

globalify(lib)
