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
        let sql: Mysql.Pool | Postgres.Sql | ClickHouse

        if (options.type === 'mysql') {
            sql = await Mysql.createPool({
                host: options.host,
                port: options.port,
                database: options.database,
                user: options.username,
                password: options.password,
            })
        } else if (options.type === 'postgres') {
            sql = await Postgres({
                host: options.host,
                port: options.port,
                database: options.database,
                username: options.username,
                password: options.password,
                debug: options.postgres?.debug,
                onnotice: options.postgres?.onnotice as never,
            })
        } else if (options.type === 'clickhouse') {
            sql = new ClickHouse({
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
