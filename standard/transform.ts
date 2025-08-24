import globalify from 'sky/utilities/globalify'

declare global {
    type Transform = keyof typeof to & keyof typeof from
    namespace to {}
    namespace from {}
    const defineTransform: typeof lib.defineTransform
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

declare global {
    namespace to {
        function base64(string: string): ReturnType<typeof JSON.stringify>
    }

    namespace from {
        function base64(base64: string): string
    }
}
defineTransform(
    'base64',
    (string: string) => btoa(string),
    (base64: string) => atob(base64)
)

type transform = {
    [k in Transform]: transform
} & {
    transformers: string[]
    transform(this: transform, value: unknown): unknown
    untransform(value: unknown): unknown
}
const transform: transform = {
    transform(this: transform, value: unknown): unknown {
        for (let i = 0; i < this.transformers.length; ++i) {
            value = to[this.transformers[i] as keyof typeof to](value as never)
        }

        return value
    },
    untransform(value: unknown): unknown {
        for (let i = this.transformers.length - 1; i >= 0; --i) {
            value = from[this.transformers[i] as keyof typeof from](value as never)
        }

        return value
    },
} as transform & {
    transform(value: unknown): unknown
    untransform(value: unknown): unknown
}

const props: PropertyDescriptorMap = {}
Object.keys(to).forEach(name => {
    props[name] = {
        get(this: transform): unknown {
            let self = this

            if (self === transform) {
                self = Object.create(transform)
            }

            self.transformers ??= []
            self.transformers.push(name)

            return self
        },
        set(this: Record<string, unknown>, value: unknown): void {
            this[name] = value
        },
    }
})

Object.defineProperties(transform, props)

class SvgFormat extends String {
    parse(): object {
        return { root: {} }
    }
}

const svg = new SvgFormat('<root></root>')
svg
