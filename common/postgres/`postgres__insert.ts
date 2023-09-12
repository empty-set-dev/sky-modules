import postgres from 'includes/postgres/defaultly'

import postgres__value from './`postgres__value'

export default async function postgres__insert(
    sql: postgres.Sql,
    name: string,
    columns: string[],
    updateColumns: string[],
    values: unknown[][]
): Promise<{ insertedId: number }[]> {
    return (await sql`
        INSERT INTO \`${name}\`
        (${columns.map(column => `\`${column}\``).join(',')})
        VALUES ${values
            .map(values_ => `(${values_.map(value => postgres__value(value)).join(',')})`)
            .join(',')}
        ${
            updateColumns.length > 0
                ? `
                    ON DUPLICATE KEY UPDATE
                        ${updateColumns.map(column => `\`${column}\`=VALUES(\`${column}\`)`)}
                `
                : ''
        }
    `) as unknown as { insertedId: number }[]
}
