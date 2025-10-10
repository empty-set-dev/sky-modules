import '@sky-modules/core/runtime'
import '@sky-modules/core/as'
import '@sky-modules/core/async/global'

// import './_define'
// import './_loadDefines'
// import './_plain'
// import './_reaction'
// import './_save'
// import './_share'
import './_types'

import internal from './__local'

declare global {
    interface Object {
        schema: Record<PropertyKey, unknown>
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        schema: unknown[]
    }
}

fire(async () => {
    await runtime

    const errors: string[] = []

    for (const k of Object.keys(internal.loadedDefines)) {
        const define = internal.defines[k]

        if (define == null) {
            errors.push(`define ${k} is defined, but not imported`)
            return
        }

        const id = internal.loadedDefines[k]
        define.value[internal.idSymbol] = id
    }

    for (const k of Object.keys(internal.defines)) {
        const define = internal.loadedDefines[k]

        if (define == null) {
            errors.push(`define ${k} is imported, but not defined`)
            return
        }

        const value = internal.defines[k]

        if (typeof value === 'object' || typeof value === 'function') {
            Object.freezeDeep(value)
        }
    }

    if (errors.length > 0) {
        throw new Error(`\n    > ${errors.join('\n    > ')}`)
    }
})
