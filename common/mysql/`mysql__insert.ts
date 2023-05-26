import { Connection, Pool } from 'includes/mysql/defaultly'

export default async function mysql__insert(
    connection: Connection | Pool,
    name: string,
    columns: string[],
    values: unknown[][]
): Promise<void> {
    await connection.query(`
        INSERT INTO \`${name}\`
        (${columns.map(column => `\`${column}\``).join(',')})
        VALUES ${values
            .map(values_ => `(${values_.map(value => `"${value}"`).join(',')})`)
            .join(',')}
        ON DUPLICATE KEY UPDATE
            ${columns.map(column => `\`${column}\`=VALUES(\`${column}\`)`)}
    `)
}
