import 'sky/standard/runtime'
import 'sky/standard/modules'
import 'sky/standard/as'

import './_define'
import './_loadDefines'
import './_plain'
import './_reaction'
import './_save'
import './_share'
import './_types'

import 'sky/standard/async'

import local from './__local'
iAm('sky.standard.define', import('./global'))

declare global {
    interface Modules {
        'sky.standard.define': typeof import('./global')
    }

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

        if (typeof value === 'object' || typeof value === 'function') {
            Object.freezeDeep(value)
        }
    })

    if (errors.length > 0) {
        throw Error(`\n    > ${errors.join('\n    > ')}`)
    }
})
