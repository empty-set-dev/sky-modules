import { fire } from '#/async/async'
import runtime from '#/runtime/runtime'

import Internal from './internal/internal'

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
