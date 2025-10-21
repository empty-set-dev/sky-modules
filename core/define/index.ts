import internal from './Internal'

export { default } from './define'
export * from './define'

// Self-define (define and schema are already exported to global in define.ts)
define('sky.core.define', define)
define('sky.core.schema', schema)

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