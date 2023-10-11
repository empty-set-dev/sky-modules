import 'includes/mysql2/global'
import { Connection, Pool, RowDataPacket } from 'mysql2'

import Ns = Mysql

declare global {
    interface Mysql {
        getTableIndexes(connection: Connection | Pool, name: string): Promise<RowDataPacket[]>
    }
}

Object.assign(Ns, {
    async getTableIndexes(connection: Connection | Pool, name: string): Promise<RowDataPacket[]> {
        const result = (await connection.query(`
            SHOW INDEX FROM \`${name}\`
        `)) as RowDataPacket[][]
        return result[0]
    },
})
