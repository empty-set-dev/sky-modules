import Internal from './Internal'
import isRuntime from './isRuntime'

/**
 * Run static code before runtime and track its completion
 * Used for deferred define calls that need to complete before runtime starts
 */
type runStaticCode = typeof runStaticCode
function runStaticCode(callback: () => Promise<void>): void {
    const promise = Promise.resolve().then(callback)

    if (!isRuntime()) {
        Internal.pendingTasks.add(promise)
        void promise.finally(() => Internal.pendingTasks.delete(promise))
    }
}

export default runStaticCode
