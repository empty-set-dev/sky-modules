import 'sky/standard/Promise/global'

import globalify from 'sky/standard/globalify'

declare global {
    var isRuntime: boolean
    type runtime = typeof runtime
    const runtime: typeof lib.runtime
}

namespace lib {
    const [runtime_, resolveRuntime] = Promise.new()
    export const runtime = runtime_

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

            resolveRuntime()
        },
        configurable: true,
        enumerable: true,
    })
}

globalify(lib)
