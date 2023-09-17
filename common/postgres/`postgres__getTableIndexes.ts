import postgres from 'includes/postgres'

export default async function postgres__getTableColumns(
    sql: postgres.Sql,
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    const result = await sql`
        SHOW INDEX FROM \`${name}\`
    `
    return result[0]
}
