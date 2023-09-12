import postgres from 'includes/postgres/defaultly'

export default async function postgres__isTableExists(
    sql: postgres.Sql,
    database: string,
    name: string
): Promise<boolean> {
    const result = await sql`
        SELECT * 
        FROM \`INFORMATION_SCHEMA\`.\`TABLES\`
        WHERE
            \`TABLE_SCHEMA\`='${database}' AND
            \`TABLE_NAME\`='${name}'
        LIMIT 1
    `

    return result[0].length > 0
}
