import { runsOnClientSide } from '@sky-modules/platform'

import Callback, { invokeCallback } from '../Callback'

export function fire<A extends unknown[], R>(
    callback: Callback<A, Promise<R>>,
    ...args: A
): PromiseLike<void | R> {
    return invokeCallback(callback, ...args).catch((error: unknown) => {
        return handleAsyncError(error)
    })
}

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

// Defer define calls to avoid circular dependency
void Promise.resolve().then(async () => {
    const { default: define } = await import('../define/define')
    define('sky.core.fire', fire)
    define('sky.core.task', task)
    define('sky.core.handleAsyncError', handleAsyncError)
})
