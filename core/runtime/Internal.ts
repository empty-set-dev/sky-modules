import deferred from '../deferred/deferred'

namespace Internal {
    export const [runtimePromise, resolveRuntime] = deferred()

    export const isHot = typeof isRuntime === 'boolean'
}

export default Internal
