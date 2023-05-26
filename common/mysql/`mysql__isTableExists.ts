import { Connection, Pool, RowDataPacket } from 'includes/mysql/defaultly'

export default async function mysql__isTableExists(
    connection: Connection | Pool,
    name: string
): Promise<boolean> {
    const result = (await connection.query(`
        SELECT * 
        FROM \`INFORMATION_SCHEMA\`.\`TABLES\`
        WHERE \`TABLE_NAME\`='${name}'
        LIMIT 1
    `)) as RowDataPacket[][]
    return result[0].length > 0
}
