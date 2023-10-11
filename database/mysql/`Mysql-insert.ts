import 'includes/mysql2'
import { Connection, Pool } from 'mysql2'

import './`Mysql-value'
import Ns = Mysql

declare global {
    interface Mysql {
        insert(
            connection: Connection | Pool,
            name: string,
            columns: string[],
            updateColumns: string[],
            values: [][]
        ): Promise<{ id: number }[]>
    }
}

Object.assign(Ns, {
    async insert(
        connection: Connection | Pool,
        name: string,
        columns: string[],
        updateColumns: string[],
        values: unknown[][]
    ): Promise<unknown[]> {
        return (await connection.query(`
            INSERT INTO \`${name}\`
                (${columns.map(column => `\`${column}\``).join(',')})
            VALUES ${values
                .map(values_ => `(${values_.map(value => Ns.value(value)).join(',')})`)
                .join(',')}
            ${
                updateColumns.length > 0
                    ? `
                        ON DUPLICATE KEY UPDATE
                            ${updateColumns.map(column => `\`${column}\`=VALUES(\`${column}\`)`)}
                    `
                    : ''
            }
        `)) as unknown[]
    },
})
