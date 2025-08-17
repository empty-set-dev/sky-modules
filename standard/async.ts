import globalify from 'sky/utilities/globalify'

declare global {
    function async<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T> | void,
        ...args: A
    ): void
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
}

globalify(lib)
