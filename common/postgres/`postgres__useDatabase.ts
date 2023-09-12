import postgres from 'includes/postgres/defaultly'

export default async function mysql__useDatabase(sql: postgres.Sql, name: string): Promise<void> {
    await sql`USE \`${name}\``
}
