import deferred from '../deferred/deferred'

namespace Internal {
    export const [runtimePromise, resolveRuntime] = deferred()

    export let isRuntime = false

    // Track pending async tasks (fire/task) before runtime
    export const pendingTasks: Set<Promise<unknown>> = new Set()
}

export default Internal
