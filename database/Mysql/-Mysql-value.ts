export {}

declare global {
    namespace Mysql {
        const value: (value: unknown) => unknown
    }
}

Object.assign(Mysql, {
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
            return Mysql.escape(JSON.stringify(value))
        }

        return Mysql.escape(value)
    },
})
