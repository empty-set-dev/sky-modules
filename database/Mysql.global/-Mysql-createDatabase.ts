export {}

import Ns = Mysql

declare global {
    namespace Mysql {
        const createDatabase: (
            connection: Mysql.Connection | Mysql.Pool,
            name: string
        ) => Promise<void>
    }
}

Object.assign(Ns, {
    async createDatabase(connection: Mysql.Connection | Mysql.Pool, name: string): Promise<void> {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``)
    },
})
