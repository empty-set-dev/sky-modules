import globalify from 'sky/utilities/globalify'

declare global {
    function async<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T> | void,
        ...args: A
    ): PromiseLike<T>
    function async<T, A extends unknown[], R>(
        object: T,
        callback: (this: T, ...args: A) => Promise<R> | void,
        ...args: A
    ): PromiseLike<R>
    type AsyncSlot<R = void> = Promise<R>
    function run_async_slot<A extends unknown[], T>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<T>
    function async_slot<T, R>(object: T, key?: keyof T): Promise<void | R>
}

namespace lib {
    export async function async<T, A extends unknown[], R>(...args: unknown[]): Promise<void | T> {
        let object!: T
        let callback!: (...args: A) => Promise<R> | void
        let args_: A
        if (typeof args[0] !== 'function') {
            object = args[0] as T
            callback = args[1] as (this: T, ...args: A) => Promise<R> | void
            args_ = args.slice(2) as A
        } else {
            callback = args[0] as (this: T, ...args: A) => Promise<R> | void
            args_ = args.slice(1) as A
        }

        try {
            if (object != null) {
                return (await callback.call(object, ...args_)) as T
            } else {
                return (await callback(...args_)) as T
            }
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
