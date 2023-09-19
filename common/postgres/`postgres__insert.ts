/* eslint-disable @typescript-eslint/no-explicit-any */
import postgres from 'includes/postgres'

export default async function postgres__insert(
    sql: postgres.Sql,
    name: string,
    columns: string[],
    conflict: string,
    updateColumns: string[],
    values: any[]
): Promise<any[]> {
    return await sql`
        INSERT INTO ${sql(name)}
        (${sql.unsafe(columns.map(column => `"${column.toLowerCase()}"`).join(','))})
        VALUES ${sql(values)}
        ${
            updateColumns.length > 0
                ? sql`
                    ON CONFLICT (${sql(conflict.toLowerCase())}) DO UPDATE SET
                        ${sql.unsafe(
                            updateColumns
                                .map(
                                    column =>
                                        `"${column.toLowerCase()}"=excluded."${column.toLowerCase()}"`
                                )
                                .join(',')
                        )}
                `
                : sql``
        }
        returning *
    `
}
