import { runsOnClientSide } from '@sky-modules/platform'

import Callback, { invokeCallback } from '../Callback'
import define from '../define'

define('sky.core.fire', fire)
export function fire<A extends unknown[], R>(
    callback: Callback<A, Promise<R>>,
    ...args: A
): PromiseLike<void | R> {
    return invokeCallback(callback, ...args).catch((error: unknown) => {
        return handleAsyncError(error)
    })
}

define('sky.core.task', task)
export function task<A extends unknown[], R>(
    callback: Callback<A, Promise<R>>,
    ...args: A
): Promise<R> {
    return invokeCallback(callback, ...args)
}

define('sky.core.handleAsyncError', handleAsyncError)
export function handleAsyncError(error: unknown): void {
    if (runsOnClientSide) {
        setTimeout(() => {
            throw error
        })
    } else {
        throw error
    }
}
