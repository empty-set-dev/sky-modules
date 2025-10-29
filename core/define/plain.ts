import assume from '../assume'

import define from './define'
import { UnknownSchemaError } from './errors'
import Internal from './internal/internal'
import { func } from './types'

type OptionalProperties<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T]

export type PlainFunctionArgument<T> = T extends void
    ? void
    : T extends { type: infer Type }
      ? Type
      : T extends new (...args: infer A) => infer I
        ? I
        : T extends (target: Object, key: string) => func<infer F>
          ? F
          : T extends (this: infer _This, ...args: infer _A) => infer _R
            ? never
            : T extends (infer A)[]
              ? Plain<A>[]
              : T extends object
                ? {
                      [K in keyof ({
                          [K in OptionalProperties<T>]?: null extends T[K]
                              ? null | Plain<T[K]>
                              : Plain<T[K]>
                      } & {
                          [K in keyof Omit<T, OptionalProperties<T>>]: null extends T[K]
                              ? null | Plain<T[K]>
                              : Plain<T[K]>
                      })]: ({
                          [K in OptionalProperties<T>]?: null extends T[K]
                              ? null | Plain<T[K]>
                              : Plain<T[K]>
                      } & {
                          [K in keyof Omit<T, OptionalProperties<T>>]: null extends T[K]
                              ? null | Plain<T[K]>
                              : Plain<T[K]>
                      })[K]
                  }
                : never

export type Plain<T> = T extends { type: infer Type }
    ? Type
    : T extends new (...args: infer A) => infer I
      ? I
      : T extends (target: Object, key: string) => func<infer F>
        ? F
        : T extends (this: infer _This, ...args: infer _A) => infer _R
          ? never
          : T extends (infer A)[]
            ? Plain<A>[]
            : T extends object
              ? {
                    [K in keyof ({
                        [K in OptionalProperties<T>]?: null extends T[K]
                            ? null | Plain<T[K]>
                            : Plain<T[K]>
                    } & {
                        [K in keyof Omit<T, OptionalProperties<T>>]: null extends T[K]
                            ? null | Plain<T[K]>
                            : Plain<T[K]>
                    })]: ({
                        [K in OptionalProperties<T>]?: null extends T[K]
                            ? null | Plain<T[K]>
                            : Plain<T[K]>
                    } & {
                        [K in keyof Omit<T, OptionalProperties<T>>]: null extends T[K]
                            ? null | Plain<T[K]>
                            : Plain<T[K]>
                    })[K]
                }
              : never

export default function plain<T extends object>(schema: T, object: Plain<T>): Plain<T> {
    assume<{
        [Internal.constructorSymbol]: (new (object: Plain<T>) => Plain<T>) & Internal.Static
    }>(schema)

    if (Array.isArray(schema)) {
        return object
    }

    const constructor = schema[Internal.constructorSymbol]

    if (constructor == null) {
        throw new UnknownSchemaError()
    }

    return new constructor(object)
}

define('sky.core.plain', plain)
