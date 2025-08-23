import globalify from 'sky/utilities/globalify'

import local from './__local'

declare global {
    type plain = typeof lib.plain
    const plain: typeof lib.plain
    type Plain<T> = lib.Plain<T>
}

namespace lib {
    define('sky.standard.plain', plain)
    export function plain<T extends object>(
        type: string,
        typeDescription: T,
        object: Plain<T> & object
    ): Plain<T> {
        if (local.types[type] != null) {
            return new local.types[type](typeDescription, object)
        }

        const propertiesMap = local.reactivePropertyDescriptors(typeDescription)
        const prototype = Object.defineProperties({}, propertiesMap)

        function constructor(
            this: Plain<T> & object,
            description: T,
            object: Plain<T> & object
        ): Plain<T> {
            Object.assign(this, object)
            Object.keys(object).forEach(k => {
                const value = this[k as keyof Plain<T>]
                if (Array.isArray(value)) {
                    //
                } else if (typeof value === 'object') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ;(this as any)[k] = plain(
                        type + '.' + k,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (description as any)[k],
                        value as object
                    )
                }
            })
            return this
        }
        constructor.prototype = prototype
        local.types[type] = constructor as ((
            this: Plain<T>,
            description: T,
            object: Plain<T>
        ) => Plain<T>) &
            (new <T>(description: object, object: T) => T)
        local.descriptions[type] = typeDescription
        return new local.types[type](typeDescription, object)
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
