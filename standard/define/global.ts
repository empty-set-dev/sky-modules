import '../async'
import '../runtime'

import local from './__local'
import './_define'
import './_loadDefines'
import './_plain'
import './_reaction'
import './_save'
import './_share'
import './_types'

declare global {
    interface Object {
        schema: Record<PropertyKey, unknown>
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> {
        schema: unknown[]
    }
}

async(async () => {
    await runtime

    const errors: string[] = []
    Object.keys(local.loadedDefines).forEach(k => {
        const define = local.defines[k]

        if (define == null) {
            errors.push(`define ${k} is defined, but not imported`)
            return
        }

        const id = local.loadedDefines[k]
        define.value[local.idSymbol] = id
    })
    Object.keys(local.defines).forEach(k => {
        const define = local.loadedDefines[k]

        if (define == null) {
            errors.push(`define ${k} is imported, but not defined`)
            return
        }

        const value = local.defines[k]

        if (Array.isArray(value) || typeof value === 'object' || typeof value === 'function') {
            Object.freezeDeep(value)
        }
    })

    if (errors.length > 0) {
        throw Error(`\n    > ${errors.join('\n    > ')}`)
    }
})
