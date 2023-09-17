import postgres from 'includes/postgres'

export default async function postgres__insert(
    sql: postgres.Sql,
    name: string,
    columns: string[],
    conflict: string,
    updateColumns: string[],
    values: unknown[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
    try {
        return await sql`
        INSERT INTO ${sql(name)}
        (${sql.unsafe(columns.map(column => `${column.toLowerCase()}`).join(','))})
        VALUES ${sql(values as any)}
        ${sql.unsafe(
            updateColumns.length > 0
                ? `
                    ON CONFLICT (${conflict.toLowerCase()}) DO UPDATE SET
                        ${updateColumns
                            .map(
                                column =>
                                    `"${column.toLowerCase()}"=excluded."${column.toLowerCase()}"`
                            )
                            .join(',')}
                `
                : ''
        )}
        returning *
    `
    } catch (err: any) {
        console.log(err.message)
        throw err.query
    }

    return {} as any
}
