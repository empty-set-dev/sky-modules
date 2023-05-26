import { Connection, Pool } from 'includes/mysql/defaultly'

export default async function mysql__useDatabase(
    connection: Connection | Pool,
    name: string
): Promise<void> {
    await connection.query(`USE \`${name}\``)
}
