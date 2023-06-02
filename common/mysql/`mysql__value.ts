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

    return `"${value}"`
}
