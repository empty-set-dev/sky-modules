import '/includes/mysql2'
import { Connection, Pool, RowDataPacket } from 'mysql2'

import Ns = Mysql

declare global {
    interface Mysql {
        isTableExists(
            connection: Connection | Pool,
            database: string,
            name: string
        ): Promise<boolean>
    }
}

Object.assign(Ns, {
    async isTableExists(
        connection: Connection | Pool,
        database: string,
        name: string
    ): Promise<boolean> {
        const result = (await connection.query(`
            SELECT * 
            FROM information_schema.tables
            WHERE
                table_catalog = '${database}' AND
                table_name = '${name}'
            LIMIT 1
        `)) as RowDataPacket[][]

        return result[0].length > 0
    },
})
