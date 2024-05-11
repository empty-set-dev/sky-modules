namespace Sql {
    type SqlType = 'mysql' | 'postgres' | 'clickhouse'

    export interface Options {
        type: SqlType
        host: string
        port: number
        database: string
        username: string
        password: string

        postgres?: {
            debug?: boolean
            max_lifetime?: number
            onnotice?: unknown
        }
    }

    export async function connect(options: Options): Promise<Sql> {
        const sql = function SqlQueriBuilder(
            template: TemplateStringsArray,
            ...args: unknown[]
        ): unknown {
            if (!template.raw) {
                if (typeof template === 'string') {
                    return Object.assign('`' + template + '`', { ___buildedStr: true })
                }
                if (Array.isArray(template)) {
                    return Object.assign('(' + template.map(p => escape(p)).join(',') + ')', {
                        ___buildedStr: true,
                    })
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
                    return query
                }

                return
            }) as Promise<unknown[]> & { ['___builded']?: boolean }

            return Object.assign(promise, {
                ___builded: query,
            })
        } as Sql

        sql['__type'] = options.type

        Object.setPrototypeOf(sql, SqlPrototype)

        if (options.type === 'mysql') {
            sql['__sql'] = await Mysql.createPool({
                host: options.host,
                port: options.port,
                database: options.database,
                user: options.username,
                password: options.password,
            })
        } else if (options.type === 'postgres') {
            sql['__sql'] = await Postgres({
                host: options.host,
                port: options.port,
                database: options.database,
                username: options.username,
                password: options.password,
                debug: options.postgres?.debug,
                onnotice: options.postgres?.onnotice as never,
            })
        } else if (options.type === 'clickhouse') {
            sql['__sql'] = new ClickHouse({
                url: options.host,
                port: options.port,
                database: options.database,
                basicAuth: {
                    username: options.username,
                    password: options.password,
                },
            })
        }

        return sql
    }
}

type Sql = {
    (template: TemplateStringsArray, ...args: unknown[]): unknown
} & SqlClass

export default Sql

class SqlClass {
    unsafe(str: string): string {
        return str
    }

    async createTable(
        database: string,
        name: string,
        columns: Postgres.Column_[],
        indexes?: Postgres.Index[]
    ): Promise<void> {
        if (this.__isPostgres(this.__sql)) {
            return Postgres.createTable(this['__sql'], database, name, columns, indexes)
        } else if (this.__isMysql(this.__sql)) {
            return Mysql.createTable(this['__sql'], database, name, columns, indexes)
        } else if (this.__isClickHouse(this.__sql)) {
            return ClickHouse.createTable(this['__sql'], database, name, columns, indexes)
        }
    }

    async createIndexes(database: string, name: string, indexes?: Postgres.Index[]): Promise<void> {
        if (this['__type'] === 'postgres') {
            return Postgres.createIndexes(this['__sql'], name, indexes)
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
        } else if (this['__type'] === 'clickhouse') {
            return ClickHouse.insert(this['__sql'], name, columns, updateColumns, values as never)
        }

        throw new Error('not implemented')
    }

    async isTableExists(database: string, name: string): Promise<boolean> {
        if (this['__type'] === 'postgres') {
            return Postgres.isTableExists(this['__sql'], database, name)
        } else if (this['__type'] === 'mysql') {
            return Mysql.isTableExists(this['__sql'], database, name)
        } else if (this['__type'] === 'clickhouse') {
            return ClickHouse.isTableExists(this['__sql'], database, name)
        }

        throw new Error('not implemented')
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
        } else if (this['__type'] === 'clickhouse') {
            return ClickHouse.select(this['__sql'], name, columns, query) as never
        }

        throw new Error('not implemented')
    }

    async useDatabase(name: string): Promise<void> {
        if (this['__type'] === 'postgres') {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return Postgres.useDatabase(this['__sql'], name)
        } else if (this['__type'] === 'mysql') {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return Mysql.useDatabase(this['__sql'], name)
        } else if (this['__type'] === 'clickhouse') {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return ClickHouse.useDatabase(this['__sql'], name)
        }

        throw new Error('not implemented')
    }

    private __isMysql(sql: SqlClass['__sql']): sql is Mysql.Pool {
        return this.__type === 'mysql'
    }
    private __isPostgres(sql: SqlClass['__sql']): sql is Postgres.Sql {
        return this.__type === 'postgres'
    }
    private __isClickHouse(sql: SqlClass['__sql']): sql is ClickHouse {
        return this.__type === 'clickhouse'
    }

    private __type!: 'mysql' | 'postgres' | 'clickhouse'
    private __sql!: Mysql.Pool | Postgres.Sql | ClickHouse
}

const SqlPrototype = Object.setPrototypeOf(SqlClass.prototype, Function)
