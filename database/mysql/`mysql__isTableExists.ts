import { Connection, Pool, RowDataPacket } from 'includes/mysql'

export default async function mysql__isTableExists(
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
}
