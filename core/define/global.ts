import '@sky-modules/core/runtime'
import '@sky-modules/core/as'

import './_define'
import './_loadDefines'
// import './_plain'
// import './_reaction'
// import './_save'
// import './_share'
import './_types'

import '@sky-modules/core/task'

import local from './__local'

declare global {
    interface Object {
        schema: Record<PropertyKey, unknown>
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        schema: unknown[]
    }
}

task(async () => {
    await runtime

    const errors: string[] = []

    for (const k of Object.keys(local.loadedDefines)) {
        const define = local.defines[k]

        if (define == null) {
            errors.push(`define ${k} is defined, but not imported`)
            return
        }

        const id = local.loadedDefines[k]
        define.value[local.idSymbol] = id
    }

    for (const k of Object.keys(local.defines)) {
        const define = local.loadedDefines[k]

        if (define == null) {
            errors.push(`define ${k} is imported, but not defined`)
            return
        }

        const value = local.defines[k]

        if (typeof value === 'object' || typeof value === 'function') {
            Object.freezeDeep(value)
        }
    }

    if (errors.length > 0) {
        throw new Error(`\n    > ${errors.join('\n    > ')}`)
    }
})
