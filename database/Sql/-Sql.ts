namespace Sql {
    export interface Options {
        type: 'mysql' | 'postgres'
        host: string
        port: number
        database: string
        username: string
        password: string
        debug: boolean
        max_lifetime?: number
        onnotice?: unknown
    }
}
interface Sql {
    (...args: unknown[]): string | Promise<unknown[]>
}
class Sql {
    public static async connect(options: Sql.Options): Promise<Sql> {
        if (options.type === 'mysql') {
            const pool = await Mysql.createPool({
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
                        const arg = args[i] as { ___builded?: boolean; ___buildedStr?: boolean }
                        if (typeof arg === 'string' && !arg['___buildedStr']) {
                            query += template[i] + escape(arg)
                        } else if (typeof arg === 'object' && arg['___builded']) {
                            query += arg['___builded']
                            delete arg['___builded']
                        } else {
                            query += template[i] + arg
                        }
                    }

                    query += template[template.length - 1]

                    const promise = new Promise.Void(r => r()).then(() => {
                        if (promise['___builded']) {
                            return pool.query(query).then(result => result[0])
                        }

                        return
                    }) as Promise<unknown[]> & { ['___builded']?: boolean }

                    return Object.assign(promise, {
                        ___builded: query,
                    })
                },
                Sql.prototype,
                {
                    ['__type']: 'mysql',
                    ['__sql']: pool,
                    createTable: Sql.prototype.createTable,
                    insert: Sql.prototype.insert,
                    isTableExists: Sql.prototype.isTableExists,
                    select: Sql.prototype.select,
                    useDatabase: Sql.prototype.useDatabase,
                }
            )
        } else if (options.type === 'postgres') {
            const sql = Postgres({
                host: options.host,
                port: options.port,
                database: options.database,
                username: options.username,
                password: options.password,
                debug: options.debug,
                onnotice: options.onnotice as never,
            })

            return Object.assign(sql, {
                ['__type']: 'postgres',
                ['__sql']: sql,
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
        columns: Postgres.Column_[],
        indexes?: Postgres.Index[]
    ): Promise<void> {
        if (this['__type'] === 'postgres') {
            return Postgres.createTable(this['__sql'], database, name, columns, indexes)
        } else if (this['__type'] === 'mysql') {
            return Postgres.createTable(
                this['__sql'],
                database,
                name,
                columns,
                indexes
            ) as unknown as Promise<void>
        }
    }

    async createIndexes(database: string, name: string, indexes?: Postgres.Index[]): Promise<void> {
        if (this['__type'] === 'postgres') {
            return Postgres.createIndexes(this['__sql'], name, indexes)
        } else if (this['__type'] === 'mysql') {
            // TODO
        }
    }

    async insert(
        name: string,
        columns: string[],
        conflict: string | string[],
        updateColumns: string[],
        values: unknown[][]
    ): Promise<unknown[]> {
        if (this['__type'] === 'postgres') {
            return Postgres.insert(this['__sql'], name, columns, conflict, updateColumns, values)
        } else if (this['__type'] === 'mysql') {
            return Mysql.insert(this['__sql'], name, columns, updateColumns, values as never)
        }

        return []
    }

    async isTableExists(database: string, name: string): Promise<boolean> {
        if (this['__type'] === 'postgres') {
            return Postgres.isTableExists(this['__sql'], database, name)
        } else if (this['__type'] === 'mysql') {
            return Mysql.isTableExists(this['__sql'], database, name)
        }

        return false
    }

    async select<T extends unknown>(
        name: string,
        columns: string[],
        query?: string & { ___builded?: string }
    ): Promise<T[] & { describe(): unknown }> {
        if (this['__type'] === 'postgres') {
            return Postgres.select(this['__sql'], name, columns, query)
        } else if (this['__type'] === 'mysql') {
            let query_: string & { ___builded?: boolean }

            if (query) {
                query_ = query['___builded']!
                delete query['___builded']
            }

            return Mysql.select(this['__sql'], name, columns, query_!) as never
        }

        return [] as never
    }

    async useDatabase(name: string): Promise<void> {
        if (this['__type'] === 'postgres') {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return Postgres.useDatabase(this['__sql'], name)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return Mysql.useDatabase(this['__sql'], name)
        }
    }

    private __type!: 'mysql' | 'postgres'
    private __sql!: Postgres.Sql & Mysql.Connection
}

export default Sql
