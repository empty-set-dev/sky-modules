import './async'
import './switch_thread'
import './Promise/global'
import './singleton'

import globalify from 'sky/standard/globalify'

declare global {
    var isRuntime: boolean
    type runtime = typeof runtime
    const runtime: Promise<void>
}

namespace lib {
    const [runtime, resolveRuntime] = Promise.new()

    Object.defineProperty(global, 'isRuntime', {
        get(): boolean {
            return false
        },
        set(): void {
            async(async () => {
                asyncSingletons.resolveBeforeRuntime()
                await asyncSingletons
                resolveRuntime()
                await runtime
            })

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
        },
        configurable: true,
        enumerable: true,
    })
}

globalify(lib)
