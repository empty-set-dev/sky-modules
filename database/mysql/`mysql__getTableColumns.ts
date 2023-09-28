import { Connection, Pool, RowDataPacket } from 'includes/mysql'

export default async function mysql__getTableColumns(
    connection: Connection | Pool,
    name: string
): Promise<RowDataPacket[]> {
    const result = (await connection.query(`
        SELECT \`COLUMN_NAME\`
        FROM information_schema.columns
        WHERE \`TABLE_NAME\`='${name}'
    `)) as RowDataPacket[][]
    return result[0]
}
