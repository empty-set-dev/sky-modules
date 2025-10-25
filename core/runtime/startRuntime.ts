import Internal from './Internal'

/**
 * Start runtime mode after waiting for all pending async tasks
 * This ensures all fire() and task() calls complete before runtime starts
 */
export default async function startRuntime(): Promise<void> {
    // Wait for all pending microtasks (Promise.resolve().then() with define calls)
    await new Promise(resolve => setTimeout(resolve, 0))

    // Wait for all pending fire/task promises to complete
    while (Internal.pendingTasks.size > 0) {
        await Promise.all(Array.from(Internal.pendingTasks))
    }

    // Set isRuntime = true
    Internal.isRuntime = true
    Internal.resolveRuntime()
}
