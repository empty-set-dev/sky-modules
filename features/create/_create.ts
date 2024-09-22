export {}

declare global {
    function create(): Promise<void>
}

namespace lib {
    export async function create<T extends Class>(): Promise<void> {
        //
    }
}

Object.assign(global, lib)
