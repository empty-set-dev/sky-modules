import postgres from 'includes/postgres'

export default async function postgres__getTableColumns(
    sql: postgres.Sql,
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    const result = await sql`
        SELECT \`COLUMN_NAME\`
        FROM \`INFORMATION_SCHEMA\`.\`COLUMNS\`
        WHERE \`TABLE_NAME\`='${name}'
    `
    return result[0]
}
