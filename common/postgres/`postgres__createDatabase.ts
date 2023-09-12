import postgres from 'includes/postgres/defaultly'

export default async function postgres__createDatabase(
    sql: postgres.Sql,
    name: string
): Promise<void> {
    await sql`CREATE DATABASE IF NOT EXISTS \`${name}\``
}
