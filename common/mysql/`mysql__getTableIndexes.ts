import { Connection, Pool, RowDataPacket } from 'includes/mysql'

export default async function mysql__getTableColumns(
    connection: Connection | Pool,
    name: string
): Promise<RowDataPacket[]> {
    const result = (await connection.query(`
        SHOW INDEX FROM \`${name}\`
    `)) as RowDataPacket[][]
    return result[0]
}
