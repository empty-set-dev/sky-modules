import { Connection, Pool, RowDataPacket } from 'includes/mysql/defaultly'

export default async function mysql__select(
    connection: Connection | Pool,
    name: string,
    columns: string[],
    query?: string
): Promise<RowDataPacket[]> {
    return (
        await connection.query(`
            SELECT ${columns.map(column => `\`${column}\``)}
            FROM \`${name}\`
            ${query ? query : ''}
        `)
    )[0] as RowDataPacket[]
}
