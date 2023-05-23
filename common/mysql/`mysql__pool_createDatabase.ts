import {
    FieldPacket,
    OkPacket,
    Pool,
    ResultSetHeader,
    RowDataPacket,
} from 'includes/mysql/defaultly'

export default async function mysql__pool_createDatabase(
    pool: Pool,
    name: string
): Promise<
    [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]
> {
    return pool.query(`CREATE DATABASE IF NOT EXISTS ${name}`)
}
