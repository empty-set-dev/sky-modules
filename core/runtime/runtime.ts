import deferred from '../deferred/deferred'

namespace Internal {
    export const [runtimePromise, resolveRuntime] = deferred()

    export const isHot = typeof isRuntime === 'boolean'
}

export default Internal.runtimePromise

initRuntime()

function initRuntime(): void {
    if (Internal.isHot) {
        return
    }

    Object.defineProperty(global, 'isRuntime', {
        get(): boolean {
            return false
        },
        set(): void {
            Object.defineProperty(global, 'isRuntime', {
                configurable: false,
                enumerable: true,
                get() {
                    return true
                },
                set() {
                    //
                },
            })

            Internal.resolveRuntime()
        },
        configurable: true,
        enumerable: true,
    })
}
