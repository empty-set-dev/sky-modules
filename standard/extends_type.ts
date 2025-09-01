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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace test {
    declare let extends_type: typeof lib.extends_type
    extends_type
    extends_type = lib.extends_type
}

{
    console.log(extends_type)
}
