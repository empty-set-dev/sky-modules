import 'sky/standard/Promise/global'

declare global {
    let isRuntime: boolean
    type runtime = typeof runtime
    const runtime: typeof lib.runtime
}

export const isHot = typeof isRuntime === 'boolean'

namespace local {
    export const [runtime, resolveRuntime] = Promise.new()
}

namespace lib {
    export const runtime = local.runtime
    init()
}

function init(): void {
    if (isHot) {
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
