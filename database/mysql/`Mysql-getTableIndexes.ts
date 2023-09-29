import { Connection, Pool, RowDataPacket } from 'includes/mysql'

import './`Mysql'
import Ns = Mysql

declare global {
    namespace Mysql {
        function getTableIndexes(
            connection: Connection | Pool,
            name: string
        ): Promise<RowDataPacket[]>
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
