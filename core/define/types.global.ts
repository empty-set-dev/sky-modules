import globalify from '@sky-modules/core/globalify'

import * as imports from './types'

declare global {
    const read: typeof imports.read
    const write: typeof imports.write
    const secret: typeof imports.secret
    const boolean: typeof imports.boolean
    const number: typeof imports.number
    const string: typeof imports.string
    const bigint: typeof imports.bigint
    const symbol: typeof imports.symbol
    const date: typeof imports.date
    const regexp: typeof imports.regexp
    const map: typeof imports.map
    const set: typeof imports.set
    const promise: typeof imports.promise
    const error: typeof imports.error
    const object: typeof imports.object
    const array: typeof imports.array
    const func: typeof imports.func
    const optional: typeof imports.optional
    const nullable: typeof imports.nullable
    const nullish: typeof imports.nullish
    type read<T> = imports.read<T>
    type write<T> = imports.write<T>
    type secret<T> = imports.secret<T>
    type date<T extends PropertyKey> = imports.date<T>
    type regexp<T extends PropertyKey> = imports.regexp<T>
    type map<K, V> = imports.map<K, V>
    type set<V> = imports.set<V>
    type promise<T extends PropertyKey> = imports.promise<T>
    type error<T extends PropertyKey> = imports.error<T>
    type array<T> = imports.array<T>
    type func = imports.func
}

globalify({ ...imports })
