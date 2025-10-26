import './Object.global'

import assume from '#/assume/assume'

export type read<T> = typeof read<T>
export function read<T>(schema: T): T {
    return schema
}
export type write<T> = typeof write<T>
export function write<T>(schema: T): T {
    return schema
}
export type secret<T> = typeof secret<T>
export function secret<T>(schema: T): T {
    return schema
}

export function boolean<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof boolean } }>(target)
    target.schema ??= {}
    target.schema[key] = boolean
}

export function number<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof number } }>(target)
    target.schema ??= {}
    target.schema[key] = number
}

export function string<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof string } }>(target)
    target.schema ??= {}
    target.schema[key] = string
}

export function bigint<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof bigint } }>(target)
    target.schema ??= {}
    target.schema[key] = bigint
}

export function symbol<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof symbol } }>(target)
    target.schema ??= {}
    target.schema[key] = symbol
}

export type date<T extends PropertyKey> = typeof date<T>
export function date<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof date } }>(target)
    target.schema ??= {}
    target.schema[key] = date
}

export type regexp<T extends PropertyKey> = typeof regexp<T>
export function regexp<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof regexp } }>(target)
    target.schema ??= {}
    target.schema[key] = regexp
}

export type map<K, V> = typeof map<K, V>
export function map<K, V>(
    keyType: K,
    valueType: V
): <T extends PropertyKey>(target: Object, key: T) => void {
    const schema = { keyType, valueType }
    return <T extends PropertyKey>(target: Object, key: T): void => {
        assume<{ schema: { [P in T]?: { keyType: K; valueType: V } } }>(target)
        target.schema ??= {}
        target.schema[key] = schema
    }
}

export type set<V> = typeof set<V>
export function set<V>(valueType: V): <K extends PropertyKey>(target: Object, key: K) => void {
    return <K extends PropertyKey>(target: Object, key: K): void => {
        assume<{ schema: { [P in K]?: V } }>(target)
        target.schema ??= {}
        target.schema[key] = valueType
    }
}

export type promise<T extends PropertyKey> = typeof promise<T>
export function promise<T>(type: T): <K extends PropertyKey>(target: Object, key: K) => void {
    return <K extends PropertyKey>(target: Object, key: K): void => {
        assume<{ schema: { [P in K]?: T } }>(target)
        target.schema ??= {}
        target.schema[key] = type
    }
}

export type error<T extends PropertyKey> = typeof error<T>
export function error<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof error } }>(target)
    target.schema ??= {}
    target.schema[key] = error
}

export function object<T extends PropertyKey, C extends Class | object>(
    schema: C
): (target: Object, key: T) => void {
    return (target: Object, key: T): void => {
        assume<{ schema: { [K in T]?: C } }>(target)
        target.schema ??= {}
        target.schema[key] = schema
    }
}

export type array<T> = typeof array<T>
export function array<T>(type: T): <K extends PropertyKey>(target: Object, key: K) => void {
    return <K extends PropertyKey>(target: Object, key: K): void => {
        assume<{ schema: { [P in K]?: T } }>(target)
        target.schema ??= {}
        target.schema[key] = type
    }
}

export type func<T extends PropertyKey, F extends Function = () => void> = typeof func<T, F>
export function func<T extends PropertyKey, F extends Function = () => void>(
    target: Object,
    key: T
): void & func<T, F> {
    assume<{ schema: { [K in T]?: typeof func<T, F> } }>(target)
    target.schema ??= {}
    target.schema[key] = func<T, F>
}

optional.boolean = optional(boolean)
optional.number = optional(number)
optional.string = optional(string)
optional.bigint = optional(bigint)
optional.symbol = optional(symbol)
optional.date = optional(date)
optional.regexp = optional(regexp)
optional.error = optional(error)
optional.func = optional(func)
export function optional<T>(schema: T): undefined | T {
    return schema
}

nullable.boolean = nullable(boolean)
nullable.number = nullable(number)
nullable.string = nullable(string)
nullable.bigint = nullable(bigint)
nullable.symbol = nullable(symbol)
nullable.date = nullable(date)
nullable.regexp = nullable(regexp)
nullable.error = nullable(error)
nullable.func = nullable(func)
export function nullable<T>(schema: T): null | T {
    return schema
}

nullish.boolean = nullish(boolean)
nullish.number = nullish(number)
nullish.string = nullish(string)
nullish.bigint = nullish(bigint)
nullish.symbol = nullish(symbol)
nullish.date = nullish(date)
nullish.regexp = nullish(regexp)
nullish.error = nullish(error)
nullish.func = nullish(func)
export function nullish<T>(schema: T): undefined | null | T {
    return schema
}
