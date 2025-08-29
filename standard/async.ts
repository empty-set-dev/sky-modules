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
    type Async<R = void> = Promise<R>
    function run_async_slot<T, A extends unknown[], R>(
        object: T,
        callback: (...args: A) => Promise<R>,
        ...args: A
    ): Promise<T>
    function run_async_slot<A extends unknown[], T>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<T>
}

namespace lib {
    export async function async<T, A extends unknown[], R>(...args: unknown[]): Promise<void | R> {
        let object: undefined | T
        let callback: (...args: A) => Promise<R> | void
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
                return (await callback.call(object, ...args_)) as R
            } else {
                return (await callback(...args_)) as R
            }
        } catch (error: unknown) {
            if (global.onAsyncError != null) {
                await onAsyncError(error)
            } else {
                throw error
            }
        }
    }

    export async function run_async_slot<T, A extends unknown[], R>(
        ...args: unknown[]
    ): Promise<R> {
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

        if (object != null) {
            return async(object, callback, ...args_) as Promise<R>
        } else {
            return async(callback, ...args_) as Promise<R>
        }
    }
}

globalify(lib)
