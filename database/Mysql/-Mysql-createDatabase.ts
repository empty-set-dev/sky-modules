import { Connection, Pool } from '@pkgs/mysql2'

declare global {
    namespace Mysql {
        const createDatabase: (connection: Connection | Pool, name: string) => Promise<void>
    }
}

Object.assign(Mysql, {
    async createDatabase(connection: Connection | Pool, name: string): Promise<void> {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``)
    },
})
