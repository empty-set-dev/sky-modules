import './switch_thread'

import globalify from 'sky/utilities/globalify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Defines = Record<string, any>

declare global {
    function define(name: string): (target: Object) => void
    const number: typeof lib.number
    const string: typeof lib.string
    const link: typeof lib.link
    function loadDefines(defines: Defines): void
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
    export function string(target: Object, key: string): void {
        target
        key
        return null!
    }
    export function link(target: Object, key: string): void {
        target
        key
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

    async(async () => {
        await switch_thread

        Object.keys(allDefines).forEach(k => {
            if (classes[k] == null) {
                throw Error(`class ${k} is defined, but not imported`)
            }

            allDefines[k].Class = classes[k]
        })

        console.log(classes)
        Object.keys(classes).forEach(k => {
            if (allDefines[k] == null) {
                throw Error(`class ${k} is imported, but not defined`)
            }
        })
    })
}

globalify(lib)
