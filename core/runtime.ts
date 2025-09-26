import 'sky/core/Promise/global'

declare global {
    let isRuntime: boolean
    type runtime = typeof runtime
    const runtime: typeof lib.runtime
}
namespace local {
    export const [runtime, resolveRuntime] = Promise.new()

    export const isHot = typeof isRuntime === 'boolean'
}

namespace lib {
    export const runtime = local.runtime
}

init()

function init(): void {
    if (local.isHot) {
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

            local.resolveRuntime()
        },
        configurable: true,
        enumerable: true,
    })
}

Object.assign(global, lib)
