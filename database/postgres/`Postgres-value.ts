import 'includes/postgres/global'
import Ns = Postgres

declare global {
    interface Postgres {
        value(value: unknown): unknown
    }
}

Object.assign(Ns, {
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
