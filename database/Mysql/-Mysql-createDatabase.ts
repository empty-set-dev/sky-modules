import 'libs/mysql2/global'

declare global {
    namespace Mysql {
        const createDatabase: (
            connection: Mysql.Connection | Mysql.Pool,
            name: string
        ) => Promise<void>
    }
}

Object.assign(Mysql, {
    async createDatabase(connection: Mysql.Connection | Mysql.Pool, name: string): Promise<void> {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``)
    },
})
