import './switch_thread'

import globalify from 'sky/utilities/globalify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Defines = Record<string, any>

type Object<T> = T extends Promise<unknown> ? never : T

declare global {
    function define(name: string): (target: Object) => void
    function number(target: Object, key: string): number
    function string(target: Object, key: string): string
    function link<T>(target: T, key: string): T
    function child<T>(target: T, key: string): T
    function loadDefines<T extends Defines>(defines: Object<T>): void
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

    export function number(target: Object, key: string): number {
        return null!
    }
    export function string(target: Object, key: string): void {}
    export function link(target: Object, key: string): void {}
    export function child(target: Object, key: string): void {}

    export async function loadDefines(defines: Defines): Promise<void> {
        Object.keys(defines).forEach(
            k => (allDefines[k] = { id: defines[k] } as { id: number; Class: Class })
        )
    }

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
