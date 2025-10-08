import { runsOnClientSide } from '@sky-modules/platform/runsOnSide'

import { invokeCallback } from './Callback'

declare global {
    const fire: typeof lib.fire
    const task: typeof lib.task
    const handleAsyncError: typeof lib.handleAsyncError
    let onAsyncError: (error: unknown) => void
}

namespace lib {
    define('sky.core.fire', fire)
    export function fire<A extends unknown[], R>(
        callback: Callback<A, Promise<R>>,
        ...args: A
    ): PromiseLike<void | R> {
        return invokeCallback(callback, ...args).catch(error => {
            return onAsyncError(error)
        })
    }

    define('sky.core.task', task)
    export function task<A extends unknown[], R>(
        callback: Callback<A, Promise<R>>,
        ...args: A
    ): Promise<R> {
        return invokeCallback(callback, ...args)
    }

    export function handleAsyncError(error: unknown): void {
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
Object.assign(global, { onAsyncError: lib.handleAsyncError })
