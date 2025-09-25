export {}

declare global {
    const as: typeof lib.as & (new () => void)
}

namespace lib {
    export function as<T>(value: unknown): asserts value is T {
        //
    }
}

Object.assign(global, lib)
