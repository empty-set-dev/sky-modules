import assume from '../assume'

export type Transform = string

export const to: Record<string, Function> = {}
export const from: Record<string, Function> = {}

export function defineTransform<To, From, A extends unknown[]>(
    type: string,
    toFn: (value: From, ...args: A) => To,
    fromFn: (value: To, ...args: A) => From
): void {
    assume<Record<string, Function>>(to)
    assume<Record<string, Function>>(from)

    to[type] = toFn
    from[type] = fromFn

    Object.defineProperty(transform, type, {
        get(this: transform): unknown {
            let self = this

            if (self === transform) {
                self = Object.create(transform)
            }

            self.transformers ??= []
            self.transformers.push(type)

            return self
        },
        set(this: Record<string, unknown>, value: unknown): void {
            this[type] = value
        },
    })
}

export type transform = {
    [k in Transform]: transform
} & {
    transformers: string[]
    transform(this: transform, value: unknown): unknown
    untransform(value: unknown): unknown
}

export const transform: transform = {
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
