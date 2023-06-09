import { Connection, Pool } from 'includes/mysql/defaultly'

import mysql__value from './`mysql__value'

export default async function mysql__insert(
    connection: Connection | Pool,
    name: string,
    columns: string[],
    updateColumns: string[],
    values: unknown[][]
): Promise<void> {
    await connection.query(`
        INSERT INTO \`${name}\`
        (${columns.map(column => `\`${column}\``).join(',')})
        VALUES ${values
            .map(values_ => `(${values_.map(value => mysql__value(value)).join(',')})`)
            .join(',')}
        ${
            updateColumns.length > 0
                ? `
                    AS data
                    ON DUPLICATE KEY UPDATE
                        ${updateColumns.map(column => `\`${column}\`=data.\`${column}\``)}
                `
                : ''
        }
    `)
}
