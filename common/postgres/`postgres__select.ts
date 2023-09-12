import postgres from 'includes/postgres/defaultly'

export default async function postgres__select(
    sql: postgres.Sql,
    name: string,
    columns: string[],
    query?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
    return await sql`
            SELECT ${columns.map(column => `\`${column}\``).join(',')}
            FROM \`${name}\`
            ${query ? query : ''}
        `
}
