import Internal from './Internal'

// Defer execution to avoid circular dependency issues
void Promise.resolve().then(async () => {
    // Dynamic import to break circular dependency
    const { fire } = await import('#/async')
    const runtime = (await import('#/runtime')).default

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
