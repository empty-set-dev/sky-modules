import postgres from 'includes/postgres'

export default async function postgres__isTableExists(
    sql: postgres.Sql,
    database: string,
    name: string
): Promise<boolean> {
    const result = await sql`
        SELECT * 
        FROM information_schema.tables
        WHERE
            table_catalog = ${database} AND
            table_name = ${sql(name)}
        LIMIT 1
    `

    return result.length > 0
}
