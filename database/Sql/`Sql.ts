import mysql, {
    escape,
    mysql__insert,
    mysql__select,
    mysql__createTable,
    mysql__isTableExists,
    mysql__useDatabase,
} from 'database/mysql'
import postgres, {
    postgres__Column,
    postgres__Index,
    postgres__createTable,
    postgres__createIndexes,
    postgres__insert,
    postgres__select,
    postgres__isTableExists,
    postgres__useDatabase,
} from 'database/postgres'

export interface SqlOptions {
    type: 'mysql' | 'postgres'
    host: string
    port: number
    database: string
    username: string
    password: string
    debug: boolean
    max_lifetime?: number
}

export default interface Sql {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: unknown[]): string | Promise<any[]>
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

            return Object.assign(
                (template: TemplateStringsArray, ...args: unknown[]) => {
                    if (!template.raw) {
                        if (typeof template === 'string') {
                            return Object.assign('`' + template + '`', { ___buildedStr: true })
                        }
                        if (Array.isArray(template)) {
                            return Object.assign(
                                '(' + template.map(p => escape(p)).join(',') + ')',
                                { ___buildedStr: true }
                            )
                        }
                    }

                    let query = ''

                    for (const i in args) {
                        const arg = args[i]
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (typeof arg === 'string' && !(arg as any).___buildedStr) {
                            query += template[i] + escape(arg)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } else if (typeof arg === 'object' && (arg as any).___builded) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            query += (arg as any).___builded
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            delete (arg as any).___builded
                        } else {
                            query += template[i] + arg
                        }
                    }

                    query += template[template.length - 1]

                    const promise = new Promise<void>(resolve => resolve()).then(() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if ((promise as any).___builded) {
                            return pool.query(query).then(result => result[0])
                        }

                        return
                    })

                    return Object.assign(promise, {
                        ___builded: query,
                    })
                },
                Sql.prototype,
                {
                    __type: 'mysql',
                    __sql: pool,
                    createTable: Sql.prototype.createTable,
                    insert: Sql.prototype.insert,
                    isTableExists: Sql.prototype.isTableExists,
                    select: Sql.prototype.select,
                    useDatabase: Sql.prototype.useDatabase,
                }
            )
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
                createIndexes: Sql.prototype.createIndexes,
                insert: Sql.prototype.insert,
                isTableExists: Sql.prototype.isTableExists,
                select: Sql.prototype.select,
                useDatabase: Sql.prototype.useDatabase,
            }) as never as Sql
        }

        return null as never
    }

    unsafe!: (str: string) => string

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

    async createIndexes(
        database: string,
        name: string,
        indexes?: postgres__Index[]
    ): Promise<void> {
        if (this['__type'] === 'postgres') {
            return postgres__createIndexes(this['__sql'], name, indexes)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            // TODO
        }
    }

    async insert(
        name: string,
        columns: string[],
        conflict: string | string[],
        updateColumns: string[],
        values: unknown[][]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any[]> {
        if (this['__type'] === 'postgres') {
            return postgres__insert(this['__sql'], name, columns, conflict, updateColumns, values)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mysql__insert(this['__sql'], name, columns, updateColumns, values)
        }

        return []
    }

    async isTableExists(database: string, name: string): Promise<boolean> {
        if (this['__type'] === 'postgres') {
            return postgres__isTableExists(this['__sql'], database, name)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mysql__isTableExists(this['__sql'], database, name)
        }

        return false
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async select(name: string, columns: string[], query?: string): Promise<any[]> {
        if (this['__type'] === 'postgres') {
            return postgres__select(this['__sql'], name, columns, query)
        } else if (this['__type'] === 'mysql') {
            let query_: string
            if (query) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                query_ = (query as any).___builded
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                delete (query as any).___builded
            }
            return mysql__select(this['__sql'], name, columns, query_!)
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
