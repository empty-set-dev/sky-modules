import postgres from 'includes/postgres'

export default async function postgres__isTableExists(
    sql: postgres.Sql,
    database: string,
    name: string
): Promise<boolean> {
    const [{ exists }] = await sql`
        SELECT EXISTS(
            SELECT *
            FROM information_schema.tables
            WHERE
                table_catalog = ${database} AND
                table_name = ${name}
        )
    `

    return exists
}
