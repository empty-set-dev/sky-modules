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
        (${columns.map(column => `${column.toLowerCase()}`).join(',')})
        VALUES ${sql(values)}
        ${
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
        }
        returning *
    `
}
