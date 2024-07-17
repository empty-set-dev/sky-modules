export {}

declare global {
    namespace Postgres {
        const value: (value: unknown) => unknown
    }
}

Object.assign(Postgres, {
    value(value: unknown): unknown {
        if (value == null) {
            return 'NULL'
        }

        if (value === true) {
            return 'TRUE'
        }

        if (value === false) {
            return 'FALSE'
        }

        if (typeof value === 'number') {
            return value
        }

        if (typeof value === 'object') {
            return JSON.stringify(value)
        }

        return value
    },
})
