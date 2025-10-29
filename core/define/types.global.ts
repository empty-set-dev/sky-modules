import globalify from '@sky-modules/core/globalify'

import * as imports from './types'

declare global {
    const read: typeof imports.read
    type read<T> = imports.read<T>
    const write: typeof imports.write
    type write<T> = imports.write<T>
    const secret: typeof imports.secret
    type secret<T> = imports.secret<T>
    const boolean: typeof imports.boolean
    const string: typeof imports.string
    const bigint: typeof imports.bigint
    const symbol: typeof imports.symbol
    const date: typeof imports.date
    type date<T extends PropertyKey> = imports.date<T>
    const regexp: typeof imports.regexp
    type regexp<T extends PropertyKey> = imports.regexp<T>
    const map: typeof imports.map
    type map<K, V> = imports.map<K, V>
    const set: typeof imports.set
    type set<V> = imports.set<V>
    const promise: typeof imports.promise
    type promise<T extends PropertyKey> = imports.promise<T>
    const error: typeof imports.error
    type error<T extends PropertyKey> = imports.error<T>
    const object: typeof imports.object
    const array: typeof imports.array
    type array<T> = imports.array<T>
    const func: typeof imports.func
    type func<T extends PropertyKey, F extends Function = () => void> = imports.func<T, F>
    const optional: typeof imports.optional
    type optional<T> = imports.optional<T>
    const nullable: typeof imports.nullable
    type nullable<T> = imports.nullable<T>
    const nullish: typeof imports.nullish
    type nullish<T> = imports.nullish<T>
    const number: typeof imports.number
}

globalify({ ...imports })
