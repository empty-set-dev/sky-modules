import './switch_thread'

import globalify from 'sky/utilities/globalify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Defines = Record<string, any>

declare global {
    const define: typeof lib.define & { new (): void }
    const boolean: typeof lib.boolean & { new (): void }
    const number: typeof lib.number & { new (): void }
    const string: typeof lib.string & { new (): void }
    const object: typeof lib.object & { new (): void }
    const array: typeof lib.array & { new (): void }
    const func: typeof lib.func & { new (): void }
    const optional: (<T>(value: T) => undefined | T) & { new (): void } & {
        boolean: undefined | typeof boolean
        number: undefined | typeof number
        string: undefined | typeof string
    }
    const nullable: (<T>(value: T) => undefined | T) & { new (): void } & {
        boolean: null | typeof boolean
        number: null | typeof number
        string: null | typeof string
    }
    const nullish: (<T>(value: T) => undefined | T) & { new (): void } & {
        boolean: undefined | null | typeof boolean
        number: undefined | null | typeof number
        string: undefined | null | typeof string
    }
    function loadDefines(defines: Defines): void
    type Plain<T> = lib.Plain<T>
}

namespace local {
    export const classes: Record<string, Class> = {}
    export const properties: Record<string, (...args: unknown[]) => unknown> = {}
    export const methods: Record<string, (...args: unknown[]) => unknown> = {}
    export const defines: Record<string, { id: number; Class: Class }> = {}
}

namespace lib {
    export function define(name: string, fn?: Function): (target: Class) => void {
        fn

        return function (target: Class): void {
            if (isRuntime) {
                throw Error('runtime define')
            }

            // console.log(name)

            // console.log(Object.getOwnPropertyDescriptors(target.prototype))

            local.classes[name] = target
        }
    }

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class Func<T extends Function> {
        private FuncID!: void
    }
    export function func<T extends Function = () => void>(): Func<T> {
        return null!
    }

    optional.number = optional(number)
    export function optional<T>(value: T): undefined | T {
        return value
    }

    export function nullable<T>(value: T): null | T {
        return value
    }

    export function nullish<T>(value: T): undefined | null | T {
        return value
    }

    export async function loadDefines(defines?: Defines): Promise<void> {
        if (defines == null) {
            return
        }

        Object.keys(defines).forEach(
            k => (local.defines[k] = { id: defines[k] } as { id: number; Class: Class })
        )
    }

    type OptionalProperties<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T]

    export type PlainFunctionArgument<T> = T extends void
        ? void
        : T extends { type: infer Type }
          ? Type
          : T extends new (...args: infer A) => infer I
            ? I
            : T extends () => Func<infer F>
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
          : T extends () => Func<infer F>
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

    async(async () => {
        await switch_thread

        Object.keys(local.defines).forEach(k => {
            if (local.classes[k] == null) {
                throw Error(`class ${k} is defined, but not imported`)
            }

            local.defines[k].Class = local.classes[k]
        })

        Object.keys(local.classes).forEach(k => {
            if (local.defines[k] == null) {
                throw Error(`class ${k} is imported, but not defined`)
            }
        })
    })
}

globalify(lib)
