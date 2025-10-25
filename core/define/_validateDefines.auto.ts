import runtime from '#/runtime'
import runStaticCode from '#/runtime/runStaticCode'

import Internal from './Internal'

// Defer execution to avoid circular dependency issues
runStaticCode(async () => {
    // Dynamic import to break circular dependency
    const { fire } = await import('#/async')

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
})
