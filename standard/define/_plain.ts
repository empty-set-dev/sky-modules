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
        description: T,
        object: Plain<T> & object
    ): Plain<T> {
        if (local.types[type] != null) {
            return makePlainObject(type, object)
        }

        let properties: PropertyDescriptorMap = {}
        Object.keys(description).map(k => {
            const symbol = Symbol(k)
            properties[k] = {
                get(this: Record<symbol, unknown>): unknown {
                    return this[symbol]
                },
                set(this: Record<symbol, unknown>, value: unknown): void {
                    this[symbol] = value
                },
                enumerable: true,
                configurable: true,
            }
        })
        local.types[type] = Object.defineProperties({}, properties)
        local.descriptions[type] = description
        return makePlainObject(type, object)
    }

    function makePlainObject<T>(type: string, object: T): T {
        const newObject = Object.assign(Object.create(local.types[type]), object)
        const description = local.descriptions[type]
        Object.keys(description).forEach(k => {
            const property = description[k]
            if (Array.isArray(property)) {
                //
            } else if (typeof property === 'object') {
                newObject[k] = plain(type + '.' + k, property, newObject[k])
            }
        })
        return newObject
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
