export {}

declare global {
    type extends_type = typeof lib.extends_type
    const extends_type: typeof lib.extends_type
}

namespace lib {
    export function extends_type<T>(value: unknown): asserts value is T {
        //
    }
}

Object.assign(global, lib)
