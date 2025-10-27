import './Object.global'

import assume from '#/assume/assume'

/**
 * Marks a schema property as read-only.
 * @param schema - The schema type to mark as read-only
 * @returns The same schema type
 * @example
 * ```ts
 * const UserSchema = {
 *   id: read(number)
 * }
 * ```
 */
export type read<T> = typeof read<T>
export function read<T>(schema: T): T {
    return schema
}

/**
 * Marks a schema property as write-only.
 * @param schema - The schema type to mark as write-only
 * @returns The same schema type
 * @example
 * ```ts
 * const UserSchema = {
 *   password: write(string)
 * }
 * ```
 */
export type write<T> = typeof write<T>
export function write<T>(schema: T): T {
    return schema
}

/**
 * Marks a schema property as secret (excluded from serialization).
 * @param schema - The schema type to mark as secret
 * @returns The same schema type
 * @example
 * ```ts
 * const UserSchema = {
 *   apiKey: secret(string)
 * }
 * ```
 */
export type secret<T> = typeof secret<T>
export function secret<T>(schema: T): T {
    return schema
}

/**
 * Decorator for defining a boolean property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @example
 * ```ts
 * class User {
 *   @boolean isActive: boolean
 * }
 * ```
 */
export function boolean<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof boolean } }>(target)
    target.schema ??= {}
    target.schema[key] = boolean
}

/**
 * Decorator for defining a number property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @example
 * ```ts
 * class User {
 *   @number age: number
 * }
 * ```
 */
export function number<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof number } }>(target)
    target.schema ??= {}
    target.schema[key] = number
}

/**
 * Decorator for defining a string property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @example
 * ```ts
 * class User {
 *   @string name: string
 * }
 * ```
 */
export function string<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof string } }>(target)
    target.schema ??= {}
    target.schema[key] = string
}

/**
 * Decorator for defining a bigint property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @example
 * ```ts
 * class Transaction {
 *   @bigint amount: bigint
 * }
 * ```
 */
export function bigint<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof bigint } }>(target)
    target.schema ??= {}
    target.schema[key] = bigint
}

/**
 * Decorator for defining a symbol property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @example
 * ```ts
 * class Config {
 *   @symbol uniqueId: symbol
 * }
 * ```
 */
export function symbol<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof symbol } }>(target)
    target.schema ??= {}
    target.schema[key] = symbol
}

/**
 * Decorator for defining a Date property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @example
 * ```ts
 * class Event {
 *   @date createdAt: Date
 * }
 * ```
 */
export type date<T extends PropertyKey> = typeof date<T>
export function date<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof date } }>(target)
    target.schema ??= {}
    target.schema[key] = date
}

/**
 * Decorator for defining a RegExp property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @example
 * ```ts
 * class Validator {
 *   @regexp pattern: RegExp
 * }
 * ```
 */
export type regexp<T extends PropertyKey> = typeof regexp<T>
export function regexp<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof regexp } }>(target)
    target.schema ??= {}
    target.schema[key] = regexp
}

/**
 * Creates a decorator for defining a Map property in a schema.
 * @param keyType - The type of map keys
 * @param valueType - The type of map values
 * @returns A property decorator function
 * @example
 * ```ts
 * class Cache {
 *   @map(string, number) stats: Map<string, number>
 * }
 * ```
 */
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

/**
 * Creates a decorator for defining a Set property in a schema.
 * @param valueType - The type of set values
 * @returns A property decorator function
 * @example
 * ```ts
 * class Collection {
 *   @set(string) tags: Set<string>
 * }
 * ```
 */
export type set<V> = typeof set<V>
export function set<V>(valueType: V): <K extends PropertyKey>(target: Object, key: K) => void {
    return <K extends PropertyKey>(target: Object, key: K): void => {
        assume<{ schema: { [P in K]?: V } }>(target)
        target.schema ??= {}
        target.schema[key] = valueType
    }
}

/**
 * Creates a decorator for defining a Promise property in a schema.
 * @param type - The type that the promise resolves to
 * @returns A property decorator function
 * @example
 * ```ts
 * class AsyncData {
 *   @promise(string) data: Promise<string>
 * }
 * ```
 */
export type promise<T extends PropertyKey> = typeof promise<T>
export function promise<T>(type: T): <K extends PropertyKey>(target: Object, key: K) => void {
    return <K extends PropertyKey>(target: Object, key: K): void => {
        assume<{ schema: { [P in K]?: T } }>(target)
        target.schema ??= {}
        target.schema[key] = type
    }
}

/**
 * Decorator for defining an Error property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @example
 * ```ts
 * class Response {
 *   @error lastError: Error
 * }
 * ```
 */
export type error<T extends PropertyKey> = typeof error<T>
export function error<T extends PropertyKey>(target: Object, key: T): void {
    assume<{ schema: { [K in T]?: typeof error } }>(target)
    target.schema ??= {}
    target.schema[key] = error
}

/**
 * Creates a decorator for defining an object or class property in a schema.
 * @param schema - The object schema or class constructor
 * @returns A property decorator function
 * @example
 * ```ts
 * class User {
 *   @object(Address) address: Address
 * }
 * ```
 */
export function object<T extends PropertyKey, C extends Class | object>(
    schema: C
): (target: Object, key: T) => void {
    return (target: Object, key: T): void => {
        assume<{ schema: { [K in T]?: C } }>(target)
        target.schema ??= {}
        target.schema[key] = schema
    }
}

/**
 * Creates a decorator for defining an array property in a schema.
 * @param type - The type of array elements
 * @returns A property decorator function
 * @example
 * ```ts
 * class Team {
 *   @array(string) members: string[]
 * }
 * ```
 */
export type array<T> = typeof array<T>
export function array<T>(type: T): <K extends PropertyKey>(target: Object, key: K) => void {
    return <K extends PropertyKey>(target: Object, key: K): void => {
        assume<{ schema: { [P in K]?: T } }>(target)
        target.schema ??= {}
        target.schema[key] = type
    }
}

/**
 * Decorator for defining a function property in a schema.
 * @param target - The target object containing the schema
 * @param key - The property key
 * @returns A decorator function
 * @example
 * ```ts
 * class Controller {
 *   @func onClick: () => void
 * }
 * ```
 */
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
/**
 * Marks a schema type as optional (allows undefined).
 * @param schema - The schema type to make optional
 * @returns The schema type union with undefined
 * @example
 * ```ts
 * const UserSchema = {
 *   email: optional(string)
 * }
 * ```
 */
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
/**
 * Marks a schema type as nullable (allows null).
 * @param schema - The schema type to make nullable
 * @returns The schema type union with null
 * @example
 * ```ts
 * const UserSchema = {
 *   avatar: nullable(string)
 * }
 * ```
 */
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
/**
 * Marks a schema type as nullish (allows null or undefined).
 * @param schema - The schema type to make nullish
 * @returns The schema type union with null and undefined
 * @example
 * ```ts
 * const UserSchema = {
 *   deletedAt: nullish(date)
 * }
 * ```
 */
export function nullish<T>(schema: T): undefined | null | T {
    return schema
}
