import 'includes/mysql2/global'
import { Connection, Pool, RowDataPacket } from 'includes/mysql2'

import Ns = Mysql

declare global {
    interface Mysql {
        select(
            connection: Connection | Pool,
            name: string,
            columns: string[],
            query?: string
        ): Promise<RowDataPacket[]>
    }
}

Object.assign(Ns, {
    async select(
        connection: Connection | Pool,
        name: string,
        columns: string[],
        query?: string
    ): Promise<RowDataPacket[]> {
        return (
            await connection.query(`
                SELECT ${columns.map(column => `\`${column}\``).join(',')}
                FROM \`${name}\`
                ${query ? query : ''}
            `)
        )[0] as RowDataPacket[]
    },
})
