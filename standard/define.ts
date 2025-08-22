import './switch_thread'

import globalify from 'sky/utilities/globalify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Defines = Record<string, any>

declare global {
    const define: typeof lib.define & { new (): void }
    const number: typeof lib.number & { new (): void }
    const string: typeof lib.string & { new (): void }
    const object: typeof lib.object & { new (): void }
    const array: typeof lib.array & { new (): void }
    const optional: typeof lib.optional & { new (): void }
    const nullable: typeof lib.nullable & { new (): void }
    const nullish: typeof lib.nullish & { new (): void }
    function loadDefines(defines: Defines): void
    type Plain<T> = lib.Plain<T>
}

namespace lib {
    const classes: Record<string, Class> = {}
    const properties: Record<string, (...args: unknown[]) => unknown> = {}
    const methods: Record<string, (...args: unknown[]) => unknown> = {}
    const allDefines: Record<string, { id: number; Class: Class }> = {}

    export function define(name: string): (target: Class) => void {
        return function (target: Class): void {
            if (isRuntime) {
                throw Error('runtime define')
            }

            console.log(name)

            console.log(Object.getOwnPropertyDescriptors(target.prototype))

            classes[name] = target
        }
    }

    export function number(target: Object, key: string): void {
        target
        key
        return null!
    }
    number.type = undefined! as number

    export function string(target: Object, key: string): void {
        target
        key
        return null!
    }
    string.type = undefined! as string

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

    export function optional<T>(value: T): undefined | T {
        value
        return null!
    }

    export function nullable<T>(value: T): null | T {
        value
        return null!
    }

    export function nullish<T>(value: T): undefined | null | T {
        value
        return null!
    }

    export async function loadDefines(defines?: Defines): Promise<void> {
        if (defines == null) {
            return
        }

        Object.keys(defines).forEach(
            k => (allDefines[k] = { id: defines[k] } as { id: number; Class: Class })
        )
    }

    type OptionalProperties<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T]

    export type Plain<T> = T extends { type: infer Type }
        ? Type
        : T extends new (...args: infer A) => infer I
          ? I
          : T extends (this: infer This, ...args: infer A) => infer R
            ? This extends object
                ? (this: This, ...args: A) => R
                : (...args: A) => R
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

        Object.keys(allDefines).forEach(k => {
            if (classes[k] == null) {
                throw Error(`class ${k} is defined, but not imported`)
            }

            allDefines[k].Class = classes[k]
        })

        Object.keys(classes).forEach(k => {
            if (allDefines[k] == null) {
                throw Error(`class ${k} is imported, but not defined`)
            }
        })
    })
}

globalify(lib)
