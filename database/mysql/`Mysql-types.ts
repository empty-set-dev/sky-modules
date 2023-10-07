import 'includes/mysql2'

declare global {
    namespace Mysql {
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
