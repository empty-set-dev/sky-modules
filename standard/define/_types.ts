import globalify from 'sky/utilities/globalify'

declare global {
    const boolean: typeof lib.boolean & { new (): void }
    const number: typeof lib.number & { new (): void }
    const string: typeof lib.string & { new (): void }
    const object: typeof lib.object & { new (): void }
    const array: typeof lib.array & { new (): void }
    type func<T extends Function> = lib.func<T>
    const func: typeof lib.func & { new (): void }
    const optional: (<T>(value: T) => undefined | T) & { new (): void } & {
        boolean: undefined | typeof boolean
        number: undefined | typeof number
        string: undefined | typeof string
        func: undefined | typeof func
    }
    const nullable: (<T>(value: T) => undefined | T) & { new (): void } & {
        boolean: null | typeof boolean
        number: null | typeof number
        string: null | typeof string
        func: null | typeof func
    }
    const nullish: (<T>(value: T) => undefined | T) & { new (): void } & {
        boolean: undefined | null | typeof boolean
        number: undefined | null | typeof number
        string: undefined | null | typeof string
        func: undefined | null | typeof func
    }
}

namespace lib {
    // eslint-disable-next-line no-constant-condition
    if (false) {
        boolean.type = undefined! as boolean
    }
    export function boolean(target: Object, key: string): void {
        target
        key
        return null!
    }

    // eslint-disable-next-line no-constant-condition
    if (false) {
        number.type = undefined! as number
    }
    export function number(target: Object, key: string): void {
        target
        key
        return null!
    }

    // eslint-disable-next-line no-constant-condition
    if (false) {
        string.type = undefined! as string
    }
    export function string(target: Object, key: string): void {
        target
        key
        return null!
    }

    export function object(type: unknown): (target: Object, key: string) => void
    export function object(target: Object, key: string): void
    export function object(...args: unknown[]): unknown {
        args
        return null!
    }

    export function array(type: unknown): (target: Object, key: string) => void
    export function array(target: Object, key: string): void
    export function array(...args: unknown[]): unknown {
        args
        return null!
    }

    export type func<T extends Function> = {
        type: T
    }
    export function func<T extends Function = () => void>(): func<T> {
        return null!
    }

    optional.boolean = optional(boolean)
    optional.number = optional(number)
    optional.string = optional(string)
    optional.func = optional(func)
    export function optional<T>(value: T): undefined | T {
        return value
    }

    nullable.boolean = nullable(boolean)
    nullable.number = nullable(number)
    nullable.string = nullable(string)
    nullable.func = nullable(func)
    export function nullable<T>(value: T): null | T {
        return value
    }

    nullish.boolean = nullish(boolean)
    nullish.number = nullish(number)
    nullish.string = nullish(string)
    nullish.func = nullish(func)
    export function nullish<T>(value: T): undefined | null | T {
        return value
    }
}

globalify(lib)
