import * as imports from './types'

declare global {
    type read = typeof imports.read
    const read: typeof imports.read
    type write = typeof imports.write
    const write: typeof imports.write
    type secret = typeof imports.secret
    const secret: typeof imports.secret

    const boolean: typeof imports.boolean & { new (): void }
    const number: typeof imports.number & { new (): void }
    const string: typeof imports.string & { new (): void }
    const object: typeof imports.object & { new (): void }
    type array = typeof imports.array
    const array: typeof imports.array
    type func<T extends Function> = imports.func<T>
    const func: typeof imports.func
    type optional = typeof imports.optional
    const optional: (<T>(value: T) => undefined | T) & {
        boolean: undefined | typeof boolean
        number: undefined | typeof number
        string: undefined | typeof string
        func: undefined | typeof func
    }
    type nullable = typeof imports.nullable
    const nullable: (<T>(value: T) => null | T) & {
        boolean: null | typeof boolean
        number: null | typeof number
        string: null | typeof string
        func: null | typeof func
    }
    type nullish = typeof imports.nullable
    const nullish: (<T>(value: T) => undefined | null | T) & {
        boolean: undefined | null | typeof boolean
        number: undefined | null | typeof number
        string: undefined | null | typeof string
        func: undefined | null | typeof func
    }
}

Object.assign(global, imports)
