import { runsOnClientSide } from '@sky-modules/platform/runsOnSide'

import { invokeCallback } from './Callback'

declare global {
    function task<T, A extends unknown[]>(
        callback: (...args: A) => Promise<T> | void,
        ...args: A
    ): PromiseLike<T>
    function task<T, A extends unknown[], R>(
        object: T,
        callback: (this: T, ...args: A) => Promise<R> | void,
        ...args: A
    ): PromiseLike<R>
    type Async<R = void> = Promise<R>
    function continuous<T, A extends unknown[], R>(
        object: T,
        callback: (...args: A) => Promise<R>,
        ...args: A
    ): Promise<T>
    function continuous<A extends unknown[], T>(
        callback: (...args: A) => Promise<T>,
        ...args: A
    ): Promise<T>
    const default_onAsyncError: typeof lib.default_onAsyncError
    let onAsyncError: (error: unknown) => void
}

namespace lib {
    // [ ] return Promise with overrided then, catch, finally methods for better stack traces
    define('sky.core.async', task)
    export function task<A extends unknown[], R>(
        callback: Callback<A, Promise<R>>,
        ...args: A
    ): void | Promise<void | R> {
        return invokeCallback(callback, ...args).catch(error => {
            return onAsyncError(error)
        })
    }

    export async function continuous<T, A extends unknown[], R>(...args: unknown[]): Promise<R> {
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
            return task(object, callback, ...args_) as Promise<R>
        } else {
            return task(callback, ...args_) as Promise<R>
        }
    }

    export function default_onAsyncError(error: unknown): void {
        if (runsOnClientSide) {
            setTimeout(() => {
                throw error
            })
        } else {
            throw error
        }
    }
}

Object.assign(global, lib)
Object.assign(global, { onAsyncError: lib.default_onAsyncError })
