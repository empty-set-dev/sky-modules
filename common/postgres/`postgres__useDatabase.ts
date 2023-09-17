import postgres from 'includes/postgres'

export default async function mysql__useDatabase(sql: postgres.Sql, name: string): Promise<void> {
    await sql`USE \`${name}\``
}
