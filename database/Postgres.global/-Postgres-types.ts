import 'includes/postgres.global'

declare global {
    namespace Postgres {
        type Column = {
            name: string
            type: string
            primary?: boolean
            autoIncrement?: boolean
            unique?: boolean
            default?: unknown
            notNull?: boolean
            codepage?: string
        }
        type Index = {
            name?: string
            type: string
            columns: string[]
        }
    }
}
