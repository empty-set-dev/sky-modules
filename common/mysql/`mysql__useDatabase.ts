import { Connection, Pool } from 'includes/mysql'

export default async function mysql__useDatabase(
    connection: Connection | Pool,
    name: string
): Promise<void> {
    await connection.query(`USE \`${name}\``)
}
