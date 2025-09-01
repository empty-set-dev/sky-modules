export {}

declare global {
    type read = typeof lib.read
    const read: typeof lib.read
    type write = typeof lib.write
    const write: typeof lib.write
    type secret = typeof lib.secret
    const secret: typeof lib.secret

    const boolean: typeof lib.boolean & { new (): void }
    const number: typeof lib.number & { new (): void }
    const string: typeof lib.string & { new (): void }
    const object: typeof lib.object & { new (): void }
    type array = typeof lib.array
    const array: typeof lib.array
    type func<T extends Function> = lib.func<T>
    const func: typeof lib.func
    type optional = typeof lib.optional
    const optional: (<T>(value: T) => undefined | T) & {
        boolean: undefined | typeof boolean
        number: undefined | typeof number
        string: undefined | typeof string
        func: undefined | typeof func
    }
    type nullable = typeof lib.nullable
    const nullable: (<T>(value: T) => null | T) & {
        boolean: null | typeof boolean
        number: null | typeof number
        string: null | typeof string
        func: null | typeof func
    }
    type nullish = typeof lib.nullable
    const nullish: (<T>(value: T) => undefined | null | T) & {
        boolean: undefined | null | typeof boolean
        number: undefined | null | typeof number
        string: undefined | null | typeof string
        func: undefined | null | typeof func
    }
}

namespace lib {
    export function read<T>(schema: T): T {
        return schema
    }
    export function write<T>(schema: T): T {
        return schema
    }
    export function secret<T>(schema: T): T {
        return schema
    }

    // eslint-disable-next-line no-constant-condition
    if (false) {
        boolean.type = undefined! as boolean
    }
    export function boolean(target: Object, key: string): void {
        target.schema ??= {}
        target.schema[key] = boolean
    }

    // eslint-disable-next-line no-constant-condition
    if (false) {
        number.type = undefined! as number
    }
    export function number(target: Object, key: string): void {
        target.schema ??= {}
        target.schema[key] = number
    }

    // eslint-disable-next-line no-constant-condition
    if (false) {
        string.type = undefined! as string
    }
    export function string(target: Object, key: string): void {
        target.schema ??= {}
        target.schema[key] = string
    }

    export function object<T extends Class | object>(
        schema: T
    ): (target: Object, key: string) => void {
        return (target: Object, key: string): void => {
            target.schema ??= {}
            target.schema[key] = schema
        }
    }

    export function array<T>(type: T): (target: Object, key: string) => void {
        return (target: Object, key: string): void => {
            target.schema ??= {}
            target.schema[key] = type
        }
    }

    export type func<T extends Function> = {
        type: T
    }
    export function func<T extends Function = () => void>(
        target: Object,
        key: string
    ): void & func<T> {
        target.schema ??= {}
        target.schema[key] = func<T>
    }

    optional.boolean = optional(boolean)
    optional.number = optional(number)
    optional.string = optional(string)
    optional.func = optional(func)
    export function optional<T>(schema: T): undefined | T {
        return schema
    }

    nullable.boolean = nullable(boolean)
    nullable.number = nullable(number)
    nullable.string = nullable(string)
    nullable.func = nullable(func)
    export function nullable<T>(schema: T): null | T {
        return schema
    }

    nullish.boolean = nullish(boolean)
    nullish.number = nullish(number)
    nullish.string = nullish(string)
    nullish.func = nullish(func)
    export function nullish<T>(schema: T): undefined | null | T {
        return schema
    }
}

Object.assign(global, lib)
