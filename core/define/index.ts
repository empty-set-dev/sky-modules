import { fire } from '../async'
import runtime from '../runtime'

import Internal from './Internal'

export { default } from './define'
export * from './define'
export { default as schema } from './schema'
export type { schema } from './schema'

fire(async () => {
    await runtime

    const errors: string[] = []

    for (const k of Object.keys(Internal.loadedDefines)) {
        const define = Internal.defines[k]

        if (define == null) {
            errors.push(`define ${k} is defined, but not imported`)
            return
        }

        const id = Internal.loadedDefines[k]
        define.value[Internal.idSymbol] = id
    }

    for (const k of Object.keys(Internal.defines)) {
        const define = Internal.loadedDefines[k]

        if (define == null) {
            errors.push(`define ${k} is imported, but not defined`)
            return
        }

        const value = Internal.defines[k]

        if (typeof value === 'object' || typeof value === 'function') {
            Object.freezeDeep(value)
        }
    }

    if (errors.length > 0) {
        throw new Error(`\n    > ${errors.join('\n    > ')}`)
    }
})
