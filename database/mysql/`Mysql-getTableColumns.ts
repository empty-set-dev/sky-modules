import 'includes/mysql2/global'
import { Connection, Pool, RowDataPacket } from 'includes/mysql2'

import Ns = Mysql

declare global {
    interface Mysql {
        getTableColumns(connection: Connection | Pool, name: string): Promise<RowDataPacket[]>
    }
}

Object.assign(Ns, {
    async getTableColumns(connection: Connection | Pool, name: string): Promise<RowDataPacket[]> {
        const result = (await connection.query(`
            SELECT \`COLUMN_NAME\`
            FROM information_schema.columns
            WHERE \`TABLE_NAME\`='${name}'
        `)) as RowDataPacket[][]

        return result[0]
    },
})
