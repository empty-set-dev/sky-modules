import mysql from 'common/mysql'
import postgres, { postgres__Column, postgres__Index } from 'common/postgres'

export interface SqlOptions {
    type: 'mysql' | 'postgres'
    host: string
    port: number
    database: string
    username: string
    password: string
    debug: boolean
}

export default interface Sql {
    (...args: unknown[]): string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (strings: TemplateStringsArray, ...args: unknown[]): any[]
}
export default class Sql {
    public static async connect(options: SqlOptions): Promise<Sql> {
        if (options.type === 'mysql') {
            const pool = await mysql.createPool({
                host: options.host,
                port: options.port,
                database: options.database,
                user: options.username,
                password: options.password,
            })

            return new Sql()
        } else if (options.type === 'postgres') {
            const sql = postgres({
                host: options.host,
                port: options.port,
                database: options.database,
                username: options.username,
                password: options.password,
                debug: options.debug,
            })

            return Object.assign(sql, {
                __type: 'postgres',
                __sql: sql,
                createTable: Sql.prototype.createTable,
                insert: Sql.prototype.insert,
                isTableExists: Sql.prototype.isTableExists,
                select: Sql.prototype.select,
                useDatabase: Sql.prototype.useDatabase,
            }) as never as Sql
        }

        return null as never
    }

    unsafe!: (...args: any[]) => any
    // unsafe(str: string): string {
    //     if (this['__type'] === 'postgres') {
    //         return this['__sql'].unsafe(str)
    //     } else if (this['__type'] === 'mysql') {
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         return ''
    //     }

    //     return ''
    // }

    async createTable(
        database: string,
        name: string,
        columns: postgres__Column[],
        indexes?: postgres__Index[]
    ): Promise<void> {
        if (this['__type'] === 'postgres') {
            return postgres__createTable(this['__sql'], database, name, columns, indexes)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mysql__createTable(
                this['__sql'],
                database,
                name,
                columns,
                indexes
            ) as never as Promise<void>
        }
    }

    async insert(
        name: string,
        columns: string[],
        conflict: string,
        updateColumns: string[],
        values: unknown[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any[]> {
        if (this['__type'] === 'postgres') {
            return postgres__insert(this['__sql'], name, columns, conflict, updateColumns, values)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mysql__insert(this['__sql'], name, columns, updateColumns, values as any)
        }

        return []
    }

    async isTableExists(database: string, name: string): Promise<boolean> {
        if (this['__type'] === 'postgres') {
            return postgres__isTableExists(this['__sql'], name)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mysql__isTableExists(this['__sql'], name)
        }

        return false
    }

    async select(name: string, columns: string[], query?: string): Promise<any[]> {
        if (this['__type'] === 'postgres') {
            return postgres__select(this['__sql'], name, columns, query)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mysql__select(this['__sql'], name, columns, query)
        }

        return []
    }

    async useDatabase(name: string): Promise<void> {
        if (this['__type'] === 'postgres') {
            return postgres__useDatabase(this['__sql'], name)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mysql__useDatabase(this['__sql'], name)
        }
    }

    private __type!: 'mysql' | 'postgres'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private __sql: any
}
