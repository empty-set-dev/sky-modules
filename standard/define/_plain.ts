import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    type plain = typeof lib.plain
    const plain: typeof lib.plain
    type Plain<T> = lib.Plain<T>
}

namespace lib {
    define('sky.standard.plain', plain)
    export function plain<T extends object>(schema: T, object: Plain<T> & object): Plain<T> {
        if (!extends_type<local.Static>(schema)) {
            return null!
        }

        const schemaID = schema[local.idSymbol]

        if (local.types[schemaID] != null) {
            return new local.types[schemaID](object)
        }

        local.types[schemaID] = local.makePlain(schema) as ((
            this: Plain<T>,
            object: Plain<T>
        ) => Plain<T>) &
            (new <T>(object: T) => T)
        local.schemas[schemaID] = schema
        return new local.types[schemaID](object)
    }

    type OptionalProperties<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T]

    export type PlainFunctionArgument<T> = T extends void
        ? void
        : T extends { type: infer Type }
          ? Type
          : T extends new (...args: infer A) => infer I
            ? I
            : T extends () => func<infer F>
              ? F
              : // eslint-disable-next-line @typescript-eslint/no-unused-vars
                T extends (this: infer _This, ...args: infer _A) => infer _R
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
          : T extends () => func<infer F>
            ? F
            : // eslint-disable-next-line @typescript-eslint/no-unused-vars
              T extends (this: infer _This, ...args: infer _A) => infer _R
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
}

globalify(lib)
