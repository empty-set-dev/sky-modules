import './_define'
import './_loadDefines'
import './_plain'
import './_reaction'
import './_save'
import './_share'
import './_types'

import '../async'
import '../runtime'

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

queueMicrotask(async () => {
    const errors: string[] = []
    Object.keys(local.loadedDefines).forEach(k => {
        if (local.defines[k] == null) {
            errors.push(`define ${k} is defined, but not imported`)
            return
        }

        local.defines[k].value[local.idSymbol] = local.loadedDefines[k]
    })

    Object.keys(local.defines).forEach(k => {
        const value = local.loadedDefines[k]

        if (value == null) {
            errors.push(`define ${k} is imported, but not defined`)
            return
        }

        if (Array.isArray(value) || typeof value === 'object' || typeof value === 'function') {
            Object.freezeDeep(value)
        }
    })

    if (errors.length > 0) {
        throw Error(`\n    > ${errors.join('\n    > ')}`)
    }
})
