import { runsOnClientSide } from '@sky-modules/platform'

import Callback, { invokeCallback } from '#/Callback'
import RuntimeInternal from '#/runtime/Internal'
import isRuntime from '#/runtime/isRuntime'
import runStaticCode from '#/runtime/runStaticCode'

export function fire<A extends unknown[], R>(
    callback: Callback<A, Promise<R>>,
    ...args: A
): PromiseLike<void | R> {
    return invokeCallback(callback, ...args).catch((error: unknown) => {
        return handleAsyncError(error)
    })
}

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
runStaticCode(async () => {
    const { default: define } = await import('../define/define')
    define('sky.core.fire', fire)
    define('sky.core.task', task)
    define('sky.core.handleAsyncError', handleAsyncError)
})
