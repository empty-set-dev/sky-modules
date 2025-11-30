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
    (string: string) => btoa(unescape(encodeURIComponent(string))),
    (base64: string) => decodeURIComponent(escape(atob(base64)))
)

declare global {
    namespace to {
        function url(string: string): string
    }

    namespace from {
        function url(encoded: string): string
    }
}
defineTransform(
    'url',
    (string: string) => encodeURIComponent(string),
    (encoded: string) => decodeURIComponent(encoded)
)

declare global {
    namespace to {
        function hex(string: string): string
    }

    namespace from {
        function hex(hex: string): string
    }
}
defineTransform(
    'hex',
    (string: string) => {
        let result = ''
        for (let i = 0; i < string.length; i++) {
            result += string.charCodeAt(i).toString(16).padStart(2, '0')
        }
        return result
    },
    (hex: string) => {
        let result = ''
        for (let i = 0; i < hex.length; i += 2) {
            result += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16))
        }
        return result
    }
)

declare global {
    namespace to {
        function base64url(string: string): string
    }

    namespace from {
        function base64url(base64url: string): string
    }
}
defineTransform(
    'base64url',
    (string: string) => btoa(unescape(encodeURIComponent(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''),
    (base64url: string) => {
        let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
        while (base64.length % 4) {
            base64 += '='
        }
        return decodeURIComponent(escape(atob(base64)))
    }
)

declare global {
    namespace to {
        function binary(string: string): string
    }

    namespace from {
        function binary(binary: string): string
    }
}
defineTransform(
    'binary',
    (string: string) => {
        let result = ''
        for (let i = 0; i < string.length; i++) {
            result += string.charCodeAt(i).toString(2).padStart(8, '0')
        }
        return result
    },
    (binary: string) => {
        let result = ''
        for (let i = 0; i < binary.length; i += 8) {
            result += String.fromCharCode(parseInt(binary.slice(i, i + 8), 2))
        }
        return result
    }
)

declare global {
    namespace to {
        function lower(string: string): string
    }

    namespace from {
        function lower(lower: string): string
    }
}
defineTransform(
    'lower',
    (string: string) => string.toLowerCase(),
    (lower: string) => lower
)

declare global {
    namespace to {
        function upper(string: string): string
    }

    namespace from {
        function upper(upper: string): string
    }
}
defineTransform(
    'upper',
    (string: string) => string.toUpperCase(),
    (upper: string) => upper
)

declare global {
    namespace to {
        function reverse(string: string): string
    }

    namespace from {
        function reverse(reversed: string): string
    }
}
defineTransform(
    'reverse',
    (string: string) => string.split('').reverse().join(''),
    (reversed: string) => reversed.split('').reverse().join('')
)
