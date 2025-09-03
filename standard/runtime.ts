import 'sky/standard/Promise/global'

declare global {
    let isRuntime: boolean
    type runtime = typeof runtime
    const runtime: typeof lib.runtime
}

namespace lib {
    export const [runtime, resolveRuntime] = Promise.new()

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

Object.assign(global, lib)
