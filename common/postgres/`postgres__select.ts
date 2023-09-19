import postgres from 'includes/postgres'

export default async function postgres__select(
    sql: postgres.Sql,
    name: string,
    columns: string[],
    query?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
    return await sql`
            SELECT ${sql.unsafe(`${columns.map(c => `${c.toLowerCase()} as "${c}"`).join(',')}`)}
            FROM ${sql(name)}
            ${query ? query : ''}
        `
}
