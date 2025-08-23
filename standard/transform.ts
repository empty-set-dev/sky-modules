import globalify from 'sky/utilities/globalify'

declare global {
    namespace to {}
    namespace from {}
    const transform: typeof lib.transform
}

namespace lib {
    export const to = {}
    export const from = {}

    export function defineTransform<To, From, A extends unknown[]>(
        type: string,
        to: (value: From, ...args: A) => To,
        from: (value: To, ...args: A) => From
    ): void {
        if (
            !extends_type<Record<string, Function>>(lib.to) ||
            !extends_type<Record<string, Function>>(lib.from)
        ) {
            return null!
        }

        lib.to[type] = to
        lib.from[type] = from
    }
}

globalify(lib)

declare global {
    namespace to {
        function json(
            value: unknown,
            replacer?: (this: unknown, key: string, value: unknown) => unknown,
            space?: string | number
        ): ReturnType<typeof JSON.stringify>
    }

    namespace from {
        function json(json: string): ReturnType<typeof JSON.parse>
    }
}
defineTransform(
    'json',
    (
        value: unknown,
        replacer?: (this: unknown, key: string, value: unknown) => unknown,
        space?: string | number
    ) => JSON.stringify(value, replacer, space),
    (json: string) => JSON.parse(json)
)
