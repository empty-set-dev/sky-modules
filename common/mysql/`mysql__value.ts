import { escape } from 'common/mysql/defaultly'

export default function mysql__value(value: unknown): unknown {
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

    return escape(value)
}
