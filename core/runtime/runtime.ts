import deferred from '../Promise/deferred'

declare global {
    let isRuntime: boolean
    type runtime = typeof runtime
    const runtime: typeof lib.runtime
}

namespace Internal {
    export const [runtime, resolveRuntime] = deferred()

    export const isHot = typeof isRuntime === 'boolean'
}

namespace lib {
    export const runtime = Internal.runtime
}

init()

function init(): void {
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

Object.assign(global, lib)
